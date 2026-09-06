import { ReactNode } from "react";

export function SectionHeading({
  title,
  detail,
  action,
}: {
  title: string;
  detail?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-base-line pb-5">
      <div>
        <h2 className="font-display text-2xl text-ink sm:text-3xl">{title}</h2>
        {detail && <p className="mt-1.5 max-w-lg text-sm text-ink-faint">{detail}</p>}
      </div>
      {action}
    </div>
  );
}
