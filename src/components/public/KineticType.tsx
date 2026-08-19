"use client";

import { Fragment, type CSSProperties } from "react";
import { useMountedReducedMotion } from "./useMountedReducedMotion";

type KineticTypeProps = {
  as?: "h1" | "h2" | "p";
  className?: string;
  id?: string;
  lines: readonly string[];
  variant: "memory" | "odometer" | "whisper";
};

export function KineticType({
  as: Tag = "p",
  className,
  id,
  lines,
  variant,
}: KineticTypeProps) {
  const reduce = useMountedReducedMotion();
  let characterIndex = 0;

  return (
    <Tag
      id={id}
      className={`kinetic-type ${className ?? ""}`}
      data-kinetic={variant}
      data-reduce={reduce}
      aria-label={lines.join(" ")}
    >
      {lines.map((line, lineIndex) => (
        <span className="kinetic-type__line" aria-hidden="true" key={`${line}-${lineIndex}`}>
          {line.split(" ").map((word, wordIndex) => (
            <Fragment key={`${word}-${wordIndex}`}>
              <span className="kinetic-type__word">
                {Array.from(word).map((character) => {
                  const index = characterIndex++;
                  return (
                    <span
                      className="kinetic-type__character"
                      style={{ "--character-index": index } as CSSProperties}
                      key={`${character}-${index}`}
                    >
                      {character}
                    </span>
                  );
                })}
              </span>
              {wordIndex < line.split(" ").length - 1 ? " " : null}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}
