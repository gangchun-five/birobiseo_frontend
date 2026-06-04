type ProcessStepProps = {
  index: number;
  label: string;
};

export function ProcessStep({ index, label }: ProcessStepProps) {
  return (
    <div className="soft-card relative p-5 text-center">
      <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#1F5D2C] text-sm font-black text-white">{index}</div>
      <p className="font-black text-[#173f22]">{label}</p>
    </div>
  );
}
