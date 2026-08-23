export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 bg-green-950 py-16 text-center text-white sm:py-20">
      <span className="rounded-full border border-brown-400/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brown-300">
        {eyebrow}
      </span>
      <h1 className="font-heading text-4xl font-bold sm:text-5xl">{title}</h1>
      <span className="h-px w-16 bg-brown-400" />
      {description && <p className="max-w-2xl text-green-100">{description}</p>}
    </div>
  );
}
