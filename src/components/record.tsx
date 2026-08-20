import type { ReactNode } from "react";
import type { Evidence } from "@/lib/content";

/* Panel, field row, portrait frame and evidence chips. #0014. */

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** Notched panel. The 1px rule is a padded parent so the notch keeps its edge. */
export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("panel notch", className)}>
      <div className="panel-in notch px-5 py-5 sm:px-6 sm:py-[22px]">
        {children}
      </div>
    </div>
  );
}

/** A numbered field row: `2 NODE /` over its value. */
export function Field({
  n,
  label,
  tone,
  children,
}: {
  n: number;
  label: string;
  tone?: "a" | "g" | "r" | "dim";
  children: ReactNode;
}) {
  return (
    <div>
      <div className="lbl">
        {n} {label} /
      </div>
      <div className={cx("val", tone && `val-${tone}`)}>{children}</div>
    </div>
  );
}

/**
 * The portrait. public/portrait.png is white-on-transparent; the amber comes
 * from the token through a CSS mask, never from the file. #0015.
 */
export function Portrait({
  width = 146,
  height = 172,
  caption = "[ img 01 ]",
}: {
  width?: number;
  height?: number;
  caption?: string;
}) {
  return (
    <div className="shrink-0">
      <div className="portrait-frame" style={{ width, height }}>
        <div
          className="portrait-mask"
          role="img"
          aria-label="Ali Ezzeddine — dithered portrait"
        />
      </div>
      <div
        className="lbl mt-[7px] text-center"
        style={{ letterSpacing: "0.1em" }}
      >
        {caption}
      </div>
    </div>
  );
}

/** Archive ID, or NOT ISSUED when the record has none. */
export function ArchiveId({ id }: { id?: string }) {
  if (!id) {
    return (
      <div
        className="val"
        style={{
          color: "var(--ink-faint)",
          borderBottom: "1px dashed #3a3f38",
          paddingBottom: "2px",
        }}
      >
        Not issued
      </div>
    );
  }
  return <div className="val val-a archive-id">{id}</div>;
}

/** Evidence chips. The arrow renders from `href`, so it never over-promises. */
export function Chips({ items }: { items: Evidence[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item) => {
        const className = cx(
          "chip",
          item.tone === "live" && "chip-g",
          item.tone === "none" && "chip-n",
        );
        return item.href ? (
          <a key={item.label} className={className} href={item.href}>
            {item.label} &rarr;
          </a>
        ) : (
          <span key={item.label} className={className}>
            {item.label}
          </span>
        );
      })}
    </div>
  );
}
