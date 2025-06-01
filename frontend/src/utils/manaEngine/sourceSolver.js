import { drawTypeMin, drawTwoTypeMin } from './manaMath';

export function estimateSourcesNeeded({
  deckSize,
  turn,
  drawSpells = 0,
  pipReq,
  threshold = 0.8,
  maxSources = 40
}) {
  const drawCount = 7 + turn + drawSpells;

  const required = pipReq;
  const solutions = [];

  for (let totalSources = 1; totalSources <= Math.min(maxSources, 20); totalSources++)
    {
    let prob = 0;

    if (required.length === 1) {
      const colorCount = required[0][1];
      prob = drawTypeMin(deckSize, totalSources, drawCount, colorCount);
    }

    if (required.length === 2) {
      const [a, b] = required;
      const countA = a[1];
      const countB = b[1];

      for (let sA = 1; sA <= totalSources - 1; sA++) {
        const sB = totalSources - sA;
        const p = drawTwoTypeMin(deckSize, sA, sB, drawCount, countA, countB);
        prob = Math.max(prob, p); // track best config
      }
    }

    solutions.push({ sources: totalSources, prob });

    if (prob >= threshold) {
      return {
        minRequired: totalSources,
        distribution: solutions
      };
    }
  }

  return {
    minRequired: null,
    distribution: solutions
  };
}
