import { defaultResult } from "@/data/recommendations";

export function RecommendationResult({ visible = true }: { visible?: boolean }) {
  return (
    <article className={`soft-card p-6 transition-all duration-300 ${visible ? "opacity-100" : "opacity-55"}`}>
      <p className="text-sm font-black text-[#6FA044]">AI 추천 결과</p>
      <h3 className="mt-2 text-2xl font-black text-[#173f22]">{defaultResult.fertilizer}</h3>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {defaultResult.npk.map((item) => (
          <div key={item.label} className="rounded-2xl bg-[#F5F8F1] p-4">
            <p className="text-sm font-bold text-[#63725f]">{item.label}</p>
            <p className="text-2xl font-black text-[#1F5D2C]">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <h4 className="font-black text-[#173f22]">권장 배합 비율</h4>
          <ul className="mt-3 grid gap-2 text-sm text-[#52624f]">
            {defaultResult.blend.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-black text-[#173f22]">예상 효과</h4>
          <ul className="mt-3 grid gap-2 text-sm text-[#52624f]">
            {defaultResult.effects.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
      <div className="mt-6 rounded-2xl bg-[#173f22] p-4 text-white">
        <h4 className="font-black">사용 방법</h4>
        <ul className="mt-2 grid gap-1 text-sm text-white/78">
          {defaultResult.usage.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    </article>
  );
}
