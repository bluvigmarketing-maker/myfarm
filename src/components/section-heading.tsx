export function SectionHeading({
  eyebrow,
  title,
  description,
  onDark = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  onDark?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span
        className={
          onDark
            ? "w-fit rounded-full border border-brown-400/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brown-300"
            : "w-fit rounded-full border border-brown-400/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brown-700"
        }
      >
        {eyebrow}
      </span>
      <h2
        className={
          onDark
            ? "font-heading text-3xl font-semibold text-white sm:text-4xl"
            : "font-heading text-3xl font-semibold text-green-950 sm:text-4xl"
        }
      >
        {title}
      </h2>
      <span className="h-px w-16 bg-brown-400" />
      {description && (
        <p className={onDark ? "max-w-2xl text-green-100" : "max-w-2xl text-green-700"}>
          {description}
        </p>
      )}
    </div>
  );
}
