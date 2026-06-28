"use client";
import Image from "next/image";
import { Eye } from "lucide-react";
import Link from "next/link";

const ProductCard = ({ product }) => {
  const { _id, images, mainImage, name, price, oldPrice, discount } = product;
  
  let imageUrl = "/placeholder.jpg";
  const displayImage = mainImage || (images && images[0]);
  if (displayImage) {
    imageUrl = displayImage.startsWith("http")
      ? displayImage
      : displayImage.startsWith("/")
      ? `${process.env.NEXT_PUBLIC_API_URL}${displayImage}`
      : `${process.env.NEXT_PUBLIC_API_URL}/${displayImage}`;
  }

  return (
    <Link href={`/productdet/${_id}`}>
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-2xl bg-white">
          <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
            -{discount}%
          </div>
          <div className="relative h-[420px] overflow-hidden">
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center">
                <Eye size={22} />
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-4 px-2">
          <h3 className="font-semibold text-lg leading-6 line-clamp-2 min-h-[56px]">
            {name}
          </h3>
          <div className="mt-2 text-yellow-500">★★★★★</div>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            <span className="font-bold text-green-900 text-xl">
              Rs. {price?.toLocaleString()}.00
            </span>
            <span className="line-through text-gray-500 text-lg">
              Rs. {oldPrice?.toLocaleString()}.00
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;