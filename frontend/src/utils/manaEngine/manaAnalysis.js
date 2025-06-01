import { getColorCost } from './manaCostParser';
import { isLand, classifyManaSource } from './cardClassifier';
import { drawType } from './manaMath';
import { extractCommanderColorIdentity } from './commanderSupport';

export function estimateLandsPerTurn(deckSize, landCount, maxTurn = 12) {
  const results = [];
  for (let turn = 0; turn <= maxTurn; turn++) {
    const dist = new Array(13).fill(0);
    for (let drawn = 0; drawn <= 12; drawn++) {
      dist[drawn] = drawType(deckSize, landCount, 7 + turn, drawn);
    }
    results.push(dist);
  }
  return results;
}

export function estimateCastabilityPerCard(cardEntry, landPerTurn) {
  const { colorCost } = cardEntry;
  const threshold = colorCost.t;

  const castChances = landPerTurn.map((dist) => {
    let prob = 0;
    for (let lands = threshold; lands < dist.length; lands++) {
      const p = dist[lands];
      if (p > 0) prob += p;
    }
    return Math.max(0, Math.min(prob, 1));
  });

  return {
    name: cardEntry.card.name,
    cmc: colorCost.t,
    castChances,
  };
}

export function analyzeDeckMana(cards, commanderNames = []) {
  const stats = {
    landCount: 0,
    landSources: Array(32).fill(0),
    pipCosts: [],
    pipMap: new Map(),
    colorIdentity: [],
    colorViolations: [],
  };

  const deckSize = cards.reduce((sum, c) => sum + c.count, 0);

  const nonCommanders = cards.filter(c =>
    !commanderNames.some(cmd => cmd.toLowerCase() === c.name.toLowerCase())
  );

  stats.colorIdentity = extractCommanderColorIdentity(cards, commanderNames);

  for (const card of nonCommanders) {
    const { count } = card;

    if (isLand(card)) {
      stats.landCount += count;
      const source = classifyManaSource(card);
      stats.landSources[source.index] += count;
      continue;
    }

    const colorCost = getColorCost(card.mana_cost);
    stats.pipCosts.push({ card, count, colorCost });

    const key = JSON.stringify(colorCost);
    if (!stats.pipMap.has(key)) stats.pipMap.set(key, { ...colorCost, total: 0 });
    stats.pipMap.get(key).total += count;

    const outsideColor = (card.color_identity || []).some(
      c => !stats.colorIdentity.includes(c)
    );
    if (outsideColor) {
      stats.colorViolations.push(card.name);
    }
  }

  stats.deckSize = deckSize;

  const landSim = estimateLandsPerTurn(stats.deckSize, stats.landCount);
  const castability = stats.pipCosts.map(cardEntry =>
    estimateCastabilityPerCard(cardEntry, landSim)
  );
  stats.castability = castability;

  return stats;
}

