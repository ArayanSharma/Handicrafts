import Image from "next/image";
import { Star, User } from "lucide-react";

export default function ReviewCard({ review }) {
  return (
    <div className="border rounded-md overflow-hidden bg-white">
      {/* Product */}
      <div className="p-4">
        <h3 className="text-xs underline text-gray-700 mb-2">
          about {review.product}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div className="flex">
            {[...Array(review.rating)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill="#fbbf24"
                color="#fbbf24"
              />
            ))}
          </div>

          <span className="text-xs text-gray-500">
            {review.date}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <User size={16} />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">
              {review.user}
            </span>

            {review.verified && (
              <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded">
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="relative h-[520px]">
        <Image
          src={review.image}
          alt={review.product}
          fill
          className="object-cover"
        />
      </div>

      {/* Review Text */}
      <div className="p-4">
        {review.review && (
          <p className="font-semibold text-sm mb-1">
            {review.review}
          </p>
        )}

        {review.subReview && (
          <p className="text-xs text-gray-500">
            {review.subReview}
          </p>
        )}
      </div>
    </div>
  );
}