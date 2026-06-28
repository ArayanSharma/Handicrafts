"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CartSidebar from "../../../components/cart/CartSidebar";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart, Zap, Star, ChevronLeft, Eye, Clock, Truck,
  ShieldCheck, Headphones, RotateCcw, Copy, Check, X, Plus, Minus, Tag, Package
} from "lucide-react";
import { useProduct, useReviews } from "../../../hooks/useProduct.js";
import InspireSection from "@/app/(website)/components/home/InspireSection";
import ReviewCard from "@/app/(website)/components/product/ReviewCard";
import ReviewSection from "@/app/(website)/components/reviews/Reviews";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const imgUrl = (path) => {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;
  return path.startsWith("/") ? `${BASE}${path}` : `${BASE}/${path}`;
};

const StarRow = ({ rating, size = 16 }) =>
  [1, 2, 3, 4, 5].map((s) => (
    <Star
      key={s}
      size={size}
      className={s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
    />
  ));

/* ─── Countdown Timer ─── */
function CountdownTimer({ seconds = 7200 }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setTimeLeft((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const m = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");
  return (
    <div className="flex items-center gap-2 mt-1">
      {[{ v: h, l: "Hours" }, { v: m, l: "Mins" }, { v: s, l: "Secs" }].map(({ v, l }) => (
        <div key={l} className="flex flex-col items-center bg-amber-500 text-white rounded-full w-14 h-14 justify-center">
          <span className="text-lg font-bold leading-tight">{v}</span>
          <span className="text-[9px] leading-tight">{l}</span>
        </div>
      ))}
    </div>
  );
}



/* ─── Main Page ─── */
export default function ProductDetailPage() {
  const { product_id } = useParams();
  const { product, related, loading, error } = useProduct(product_id);
  const { reviews, avg } = useReviews(product_id);

  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartMsg, setCartMsg] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: "", phone: "", email: "", address: "", city: "", state: "", pincode: "",
  });
  const [checkoutMsg, setCheckoutMsg] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  const [returnsOpen, setReturnsOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <p className="text-xl">😕 {error || "Product not found"}</p>
        <Link href="/" className="text-green-700 underline">Go Back</Link>
      </div>
    );

  const { name, description, price, oldPrice, discount, images = [], mainImage, hoverImage, variants = [], stock, category } = product;

  const productImages = [...images];
  if (productImages.length === 0) {
    if (mainImage) productImages.push(mainImage);
    if (hoverImage) productImages.push(hoverImage);
  }

  const savings = (oldPrice || 0) - price;
  const OFFER_CODE = "FIRSTORDER";

  const handleCopy = () => {
    navigator.clipboard.writeText(OFFER_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const idx = cartItems.findIndex((i) => i.productId === product_id && i.variant === selectedVariant);
      if (idx > -1) {
        cartItems[idx].quantity += quantity;
      } else {
        cartItems.push({ productId: product_id, name: product.name, price: product.price, mainImage: product.mainImage, quantity, variant: selectedVariant });
      }
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      window.dispatchEvent(new Event("cartUpdated"));
      setCartMsg("✅ Added to cart!");
      setTimeout(() => { setCartMsg(""); setCartOpen(true); }, 600);
    } catch {
      setCartMsg("❌ Something went wrong. Try again.");
    }
  };

  const handleQuickOrder = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setCheckoutMsg("");
    try {
      let token = localStorage.getItem("token");
      if (!token) {
        const nameParts = checkoutForm.fullName.trim().split(" ");
        const regRes = await fetch(`${BASE}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName: nameParts[0] || "Guest", lastName: nameParts.slice(1).join(" ") || "User", email: checkoutForm.email, password: "QuickOrderTemp123!" }),
        });
        const regData = await regRes.json();
        if (regRes.ok && regData.success) {
          token = regData.token;
          localStorage.setItem("token", regData.token);
          if (regData.user) localStorage.setItem("user", JSON.stringify(regData.user));
        } else if (regData.message?.includes("already exists")) {
          const logRes = await fetch(`${BASE}/api/auth/login`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: checkoutForm.email, password: "QuickOrderTemp123!" }),
          });
          const logData = await logRes.json();
          if (logRes.ok && logData.success) { token = logData.token; localStorage.setItem("token", logData.token); }
          else throw new Error("This email is already registered. Please login first.");
        } else throw new Error(regData.message || "Failed to create account.");
      }
      const orderRes = await fetch(`${BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: [{ product: product_id, name: product.name, image: product.mainImage || product.images?.[0] || "", price: product.price, quantity }],
          shippingAddress: { fullName: checkoutForm.fullName, phone: checkoutForm.phone, address: checkoutForm.address, city: checkoutForm.city, state: checkoutForm.state, pincode: checkoutForm.pincode, country: "India" },
          paymentMethod: "COD", itemsPrice: price * quantity, shippingPrice: 0, taxPrice: 0, totalPrice: price * quantity,
          notes: selectedVariant ? `Variant: ${selectedVariant}` : "",
        }),
      });
      const orderData = await orderRes.json();
      if (orderRes.ok && orderData.success) {
        setCheckoutMsg("🎉 Order placed successfully!");
        setTimeout(() => { setShowCheckout(false); setCheckoutMsg(""); }, 3000);
      } else throw new Error(orderData.message || "Failed to place order.");
    } catch (err) {
      setCheckoutMsg(`❌ ${err.message}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const AccordionItem = ({ title, open, toggle, children }) => (
    <div className="border-t border-gray-200">
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center py-4 text-sm font-semibold text-gray-800 hover:text-green-800 transition"
      >
        {title}
        <span className={`transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
          <Plus size={18} />
        </span>
      </button>
      {open && <div className="pb-4 text-sm text-gray-600 leading-relaxed">{children}</div>}
    </div>
  );

  return (
    <>
      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-700 flex items-center gap-1">
            <ChevronLeft size={15} /> Home
          </Link>
          {category && <><span>›</span><span className="capitalize">{category?.name || category}</span></>}
          <span>›</span>
          <span className="text-gray-800 font-medium line-clamp-1">{name}</span>
        </nav>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left — Gallery */}
          <div>
            <div className="relative h-[460px] rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
              {productImages.length > 0 ? (
                <Image src={imgUrl(productImages[selectedImg])} alt={name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                  -{discount}%
                </div>
              )}
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`relative w-18 h-18 flex-shrink-0 rounded-xl overflow-hidden border-2 transition w-[72px] h-[72px] ${selectedImg === i ? "border-green-700" : "border-gray-200 hover:border-green-300"}`}
                  >
                    <Image src={imgUrl(img)} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">{name}</h1>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex">{<StarRow rating={Math.round(avg)} />}</div>
              <span className="text-sm text-gray-500">{avg > 0 ? `${avg} (${reviews.length} reviews)` : "No reviews yet"}</span>
            </div>

            {/* Live viewers */}
            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
              <Eye size={15} className="text-green-600" />
              <span><strong className="text-gray-800">26 people</strong> are viewing this right now</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-green-900">Rs. {price?.toLocaleString()}.00</span>
              {oldPrice > price && (
                <span className="line-through text-gray-400 text-base">Rs. {oldPrice?.toLocaleString()}.00</span>
              )}
              {discount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">-{discount}%</span>
              )}
            </div>
            {savings > 0 && <p className="text-sm text-red-500 font-medium mt-0.5">You save Rs. {savings.toLocaleString()}!</p>}

            {/* Hurry up + timer */}
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <Clock size={15} className="text-red-500" /> Hurry Up! Sale ends in
              </p>
              <CountdownTimer seconds={7745} />
            </div>

            {/* Offer code */}
            <div className="mt-5 rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                <Tag size={15} className="text-green-700" />
                <span className="text-sm font-semibold text-gray-700">Available Offers</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-sm text-gray-700">
                  Use code <strong className="text-green-800">{OFFER_CODE}</strong> for{" "}
                  <strong>10% OFF + 5% Extra</strong> on prepaid orders.
                </p>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-green-700 border border-green-300 rounded-lg px-2.5 py-1.5 hover:bg-green-50 transition flex-shrink-0 ml-3"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Delivery */}
            <div className="mt-3 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <Truck size={16} className="text-green-700 flex-shrink-0" />
              <div>
                <span className="text-xs text-gray-500 font-medium">Estimated Delivery</span>
                <p className="text-sm font-semibold text-gray-800">Get it within 5 – 7 days</p>
              </div>
            </div>

            {/* Stock */}
            <div className="mt-3">
              {stock > 0 ? (
                <span className="text-green-700 text-sm font-medium">✅ In Stock ({stock} left)</span>
              ) : (
                <span className="text-red-500 text-sm font-medium">❌ Out of Stock</span>
              )}
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">Select Size / Variant:</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition ${selectedVariant === v ? "border-green-700 bg-green-50 text-green-800" : "border-gray-200 hover:border-green-300"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-5 flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Qty:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100 transition">
                  <Minus size={14} />
                </button>
                <span className="px-4 py-2 font-semibold text-base min-w-[40px] text-center">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2 hover:bg-gray-100 transition">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-semibold text-base hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button
                onClick={() => setShowCheckout(true)}
                disabled={stock === 0}
                className="flex-1 bg-green-800 text-white py-4 rounded-2xl font-semibold text-base hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap size={18} /> Buy It Now
              </button>
            </div>

            {cartMsg && (
              <p className="mt-2 text-center text-sm font-semibold text-green-700">{cartMsg}</p>
            )}

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-4 gap-3 text-center border-t border-gray-100 pt-5">
              {[
                { icon: <Truck size={22} />, label: "Free Shipping" },
                { icon: <ShieldCheck size={22} />, label: "Secure Checkout" },
                { icon: <Headphones size={22} />, label: "Customer Support" },
                { icon: <RotateCcw size={22} />, label: "Friendly Return Policy" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <div className="text-gray-700">{icon}</div>
                  <p className="text-xs text-gray-600 leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="mt-4">
              <AccordionItem title="Description" open={descOpen} toggle={() => setDescOpen(!descOpen)}>
                {description || "No description available for this product."}
              </AccordionItem>
              <AccordionItem title="Shipping Policy" open={false} toggle={() => { }}>
                <div className="border border-gray-200 rounded-xl p-3">
                  <p className="font-semibold text-gray-800 mb-1">Shipping Policy</p>
                  <p>We offer fast and reliable shipping PAN India for all items. Orders are processed within <strong>2-3 business days</strong> and shipped via standard delivery, which typically takes 4-5 business days.</p>
                </div>
              </AccordionItem>
              <AccordionItem title="Returns and Cancellation" open={returnsOpen} toggle={() => setReturnsOpen(!returnsOpen)}>
                Returns accepted within 7 days of delivery. Item must be unused and in original packaging. Contact us to initiate a return.
              </AccordionItem>
              <AccordionItem title="More Information" open={infoOpen} toggle={() => setInfoOpen(!infoOpen)}>
                <div className="flex items-start gap-2">
                  <Package size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>🏺 <strong>100% Handmade</strong> — This product was handcrafted by skilled artisans. Every piece is unique.</span>
                </div>
              </AccordionItem>
            </div>
          </div>
        </div>

        <InspireSection />

        {/* Reviews */}
        <ReviewSection />

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.slice(0, 4).map((p) => (
                <Link key={p._id} href={`/productdet/${p._id}`}>
                  <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition">
                    <div className="relative h-44">
                      <Image src={imgUrl(p.mainImage || p.images?.[0])} alt={p.name} fill className="object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-sm line-clamp-2 text-gray-800">{p.name}</p>
                      <p className="text-green-800 font-bold mt-1 text-sm">Rs. {p.price?.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Quick Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Package size={20} className="text-green-700" /> Quick Checkout
              </h3>
              <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-gray-700 transition">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleQuickOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Full Name</label>
                <input type="text" required placeholder="Enter your full name" value={checkoutForm.fullName} onChange={(e) => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 text-gray-900" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Phone</label>
                  <input type="tel" required placeholder="Phone number" value={checkoutForm.phone} onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Email</label>
                  <input type="email" required placeholder="Email for tracking" value={checkoutForm.email} onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Shipping Address</label>
                <textarea required rows="3" placeholder="Full address with landmarks…" value={checkoutForm.address} onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 text-gray-900 resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[["City", "city"], ["State", "state"], ["Pincode", "pincode"]].map(([label, key]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">{label}</label>
                    <input type="text" required placeholder={label} value={checkoutForm[key]} onChange={(e) => setCheckoutForm({ ...checkoutForm, [key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-green-500 text-gray-900" />
                  </div>
                ))}
              </div>
              <div className="bg-green-50 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Order Total</p>
                  <p className="text-green-900 font-bold text-xl">Rs. {(price * quantity).toLocaleString()}.00</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">Cash on Delivery</p>
                  <p className="text-xs text-gray-400">Pay when it arrives</p>
                </div>
              </div>
              {checkoutMsg && (
                <p className={`text-center text-sm font-semibold ${checkoutMsg.startsWith("❌") ? "text-red-500" : "text-green-700"}`}>{checkoutMsg}</p>
              )}
              <button type="submit" disabled={checkoutLoading} className="w-full bg-green-800 text-white py-4 rounded-2xl font-semibold text-base hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50">
                {checkoutLoading ? "Placing Order…" : "Confirm & Order Now"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}