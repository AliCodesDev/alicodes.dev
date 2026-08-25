import type { CSSProperties, ReactNode } from "react";
import type { Evidence } from "@/lib/content";
import { cx } from "@/lib/cx";

/* Panel, field row, portrait frame and evidence chips. #0014. */

/**
 * Notched panel. The 1px rule is a padded parent so the notch keeps its edge.
 *
 * `inner` replaces the default padding wholesale — the dossier sets its own,
 * and the record panel has none at all because its head, body and foot each
 * carry theirs and the body has to be the only thing that scrolls.
 */
export function Panel({
  children,
  className,
  inner,
  id,
}: {
  children: ReactNode;
  className?: string;
  inner?: string;
  id?: string;
}) {
  return (
    <div id={id} className={cx("panel notch", className)}>
      <div
        className={cx(
          "panel-in notch",
          inner ?? "px-5 py-5 sm:px-6 sm:py-[22px]",
        )}
      >
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
      {/*
       * Size travels as custom properties rather than as `width`/`height`, so
       * the narrow layout can restate it in CSS. An inline width would win
       * against any media query and pin the portrait at its desktop size.
       */}
      <div
        className="portrait-frame"
        style={{ "--pw": `${width}px`, "--ph": `${height}px` } as CSSProperties}
      >
        <div
          className="portrait-mask"
          role="img"
          aria-label="Ali Ezzeddine — dithered portrait"
        />
        <div className="portrait-scan" aria-hidden="true" />
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

/**
 * Evidence chips. The arrow renders from `href`, so it never over-promises —
 * #0018. A chip that is linkable and nothing more goes amber for the same
 * reason a linkable source does; a chip that is *live* stays green, because
 * green outranks amber and a live thing with a URL is still live.
 */
export function Chips({ items }: { items: Evidence[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item) => {
        const className = cx(
          "chip",
          item.tone === "live" && "chip-g",
          item.tone === "none" && "chip-n",
          (item.tone === "link" || (item.href && !item.tone)) && "chip-a",
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

/**
 * The numbered field grid: `2/3/4` down the left, `5/6/7` down the right.
 *
 * The column-major order is CSS (`grid-auto-flow: column` over a fixed row
 * count), not a reordered array. Doing it in the markup meant the DOM ran
 * 2,5,3,6,4,7 — which is the order a screen reader announces, and the order a
 * keyboard walks — to make a row-first grid *look* column-first. It also made
 * the mobile layout, which wants plain row order, impossible without a second
 * copy of the list.
 */
export function FieldGrid({
  rows,
  className,
  children,
}: {
  rows: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cx("field-grid", className)}
      style={{ "--rows": rows } as CSSProperties}
    >
      {children}
    </div>
  );
}

/** One numbered field in a record head. */
export type FieldSpec = {
  label: string;
  value: ReactNode;
  tone?: "a" | "g" | "r" | "dim";
};

/**
 * The head of a work record: position, title, archive ID, lede, and the
 * numbered field grid. The `SafiyrFile` and `GenieResolved` artboards.
 *
 * Fields are given in reading order; `FieldGrid` lays them out column-major.
 * Field 1 is the title, which is why the numbering starts at 2.
 */
export function RecordHead({
  position,
  total,
  title,
  archiveId,
  lede,
  fields,
}: {
  /** Curated position in the collection — `order`, not an array index. #0007. */
  position: number;
  total: number;
  title: string;
  archiveId?: string;
  lede: string;
  fields: FieldSpec[];
}) {
  const rows = Math.ceil(fields.length / 2);

  return (
    <Panel inner="rec-in">
      <div className="rec-top">
        <div className="min-w-0 flex-1">
          <div className="lbl">
            {position}_{total} /
          </div>
          <h1 className="val rec-title">{title}</h1>
        </div>
        <div className="shrink-0 text-right">
          <div className="lbl">Archive# /</div>
          <ArchiveId id={archiveId} />
        </div>
      </div>

      <p className="rec-lede">{lede}</p>

      <FieldGrid rows={rows} className="rec-fields">
        {fields.map((field, i) => (
          <Field key={field.label} n={i + 2} label={field.label} tone={field.tone}>
            {field.value}
          </Field>
        ))}
      </FieldGrid>
    </Panel>
  );
}
