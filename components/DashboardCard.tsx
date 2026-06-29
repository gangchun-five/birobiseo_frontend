type DashboardCardProps = {
  label: string;
  value: string;
  tone?: string;
};

export function DashboardCard({ label, value, tone = "#1F5D2C" }: DashboardCardProps) {
  return (
    <article className="soft-card p-5">
      <p className="text-sm font-medium text-[#63725f]">{label}</p>
      <p className="mt-2 text-2xl font-bold" style={{ color: tone }}>{value}</p>
    </article>
  );
}


