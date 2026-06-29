type RecommendationResultData = {
  recommendedProduct: {
    name: string;
  };
  npk: {
    n: number;
    p: number;
    k: number;
    unit: string;
  };
  blend: Array<{
    name: string;
    ratio: number;
    unit: string;
  }>;
  effects: Array<{
    label: string;
    value: string;
  }>;
  usage: {
    amount: string;
    method: string;
    timing: string;
    cautions: string[];
  };
};

export function RecommendationResult({
  result,
  visible = true
}: {
  result: RecommendationResultData;
  visible?: boolean;
}) {
  return (
    <article className={`soft-card p-6 transition-all duration-300 ${visible ? "opacity-100" : "opacity-55"}`}>
      <p className="text-sm font-medium text-[#6FA044]">AI 추천 결과</p>
      <h3 className="mt-2 text-2xl font-bold text-[#173f22]">{result.recommendedProduct.name}</h3>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: "N", value: result.npk.n },
          { label: "P", value: result.npk.p },
          { label: "K", value: result.npk.k }
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-[#F5F8F1] p-4">
            <p className="text-sm font-medium text-[#63725f]">{item.label}</p>
            <p className="text-2xl font-bold text-[#1F5D2C]">{item.value}</p>
            <p className="text-xs font-medium text-[#63725f]">{result.npk.unit}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <h4 className="font-bold text-[#173f22]">권장 퇴비 처방량</h4>
          <ul className="mt-3 grid gap-2 text-sm text-[#52624f]">
            {result.blend.map((item) => <li key={item.name}>{item.name} {item.ratio}{item.unit}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#173f22]">상품 주요 효과</h4>
          <ul className="mt-3 grid gap-2 text-sm text-[#52624f]">
            {result.effects.map((item) => <li key={item.label}>{item.value}</li>)}
          </ul>
        </div>
      </div>
      <div className="mt-6 rounded-2xl bg-[#173f22] p-4 text-white">
        <h4 className="font-bold">사용 방법</h4>
        <ul className="mt-2 grid gap-1 text-sm text-white/78">
          <li>{result.usage.amount}</li>
          <li>{result.usage.method}</li>
          <li>{result.usage.timing}</li>
          {result.usage.cautions.map((caution) => <li key={caution}>{caution}</li>)}
        </ul>
      </div>
    </article>
  );
}
