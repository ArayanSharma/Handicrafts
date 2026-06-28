import Image from "next/image";

export default function BannerSection() {
  return (
    <section
      style={{
        padding: "30px 0 70px",
        background: "#fff",
      }}
    >
      <div
        style={{
          width: "94%",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "340px",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <Image
            src="/b1.webp"
            alt="Banner"
            fill
            priority
            style={{
              objectFit: "cover",
            }}
          />

    
        
        </div>
      </div>
    </section>
  );
}