"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useCinematicMotion } from "./use-cinematic-motion";

function Word({ word, index, count, progress, enabled }: { word: string; index: number; count: number; progress: MotionValue<number>; enabled: boolean }) {
  const color = useTransform(progress, [index / count, (index + 1) / count], ["#96918b", "#f0ece7"]);
  return <><motion.span style={{ color: enabled ? color : undefined }}>{word}</motion.span>{" "}</>;
}

export function ReadingReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const enabled = useCinematicMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return <p ref={ref} className={`reading-reveal ${className}`}>{words.map((word, index) => <Word key={index} word={word} index={index} count={words.length} progress={scrollYProgress} enabled={enabled} />)}</p>;
}
