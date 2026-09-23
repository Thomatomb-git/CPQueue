import confetti from "canvas-confetti";

export function triggerQuestSolvedConfetti(originElement?: HTMLElement | null) {
  if (typeof window === "undefined") return;

  let origin = { x: 0.5, y: 0.6 };

  if (originElement) {
    const rect = originElement.getBoundingClientRect();
    origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    };
  }

  // Neobrutalism pop palette
  const colors = ["#22C55E", "#FACC15", "#2563EB", "#0EA5E9", "#FAFAFA"];

  confetti({
    particleCount: 45,
    spread: 60,
    origin,
    colors,
    ticks: 150,
    gravity: 1.2,
    scalar: 1.1,
    shapes: ["square", "circle"],
    disableForReducedMotion: true,
  });
}
