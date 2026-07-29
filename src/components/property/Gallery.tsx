"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";

export function Gallery({
  photoIds,
  title,
}: {
  photoIds: string[];
  title: string;
}) {
  const [index, setIndex] = useState(0);

  function go(delta: number) {
    setIndex((i) => (i + delta + photoIds.length) % photoIds.length);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  }

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={`${title} photos`}
      onKeyDown={onKeyDown}
      className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-navy-card lg:aspect-[16/10]"
    >
      <Image
        src={`https://picsum.photos/id/${photoIds[index]}/1200/900`}
        alt={`${title}, photo ${index + 1} of ${photoIds.length}`}
        fill
        priority
        sizes="(min-width: 1024px) 65vw, 100vw"
        className="object-cover"
      />

      {photoIds.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-porcelain transition-colors hover:bg-ink"
          >
            <ArrowLeft size={18} weight="bold" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-porcelain transition-colors hover:bg-ink"
          >
            <ArrowRight size={18} weight="bold" aria-hidden="true" />
          </button>
          <span
            className="tnum absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 text-xs text-porcelain"
            aria-hidden="true"
          >
            {index + 1} / {photoIds.length}
          </span>
        </>
      )}
    </div>
  );
}
