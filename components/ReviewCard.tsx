import type { Review } from "@/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="soft-card hover-lift p-6">
      <div className="mb-3 font-black text-[#E0A13A]">별점 {review.rating}</div>
      <p className="min-h-20 text-sm leading-7 text-[#52624f]">{review.content}</p>
      <div className="mt-5 border-t border-[#1f5d2c]/10 pt-4">
        <p className="font-black text-[#173f22]">{review.name}</p>
        <p className="text-sm text-[#63725f]">{review.product}</p>
      </div>
    </article>
  );
}
