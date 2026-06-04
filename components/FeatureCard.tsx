type FeatureCardProps = {
  title: string;
  description?: string;
  icon?: string;
};

export function FeatureCard({ title, description, icon = "잎" }: FeatureCardProps) {
  return (
    <article className="soft-card hover-lift p-6">
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#F5F8F1] text-sm font-black text-[#1F5D2C]" aria-hidden="true">{icon}</div>
      <h3 className="text-lg font-black text-[#173f22]">{title}</h3>
      {description && <p className="mt-3 text-sm leading-7 text-[#63725f]">{description}</p>}
    </article>
  );
}
