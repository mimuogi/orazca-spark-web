export function analyzeMana(deckCards) {
    const stats = {
      totalLands: 0,
      totalSpells: 0,
      colorSymbols: { W: 0, U: 0, B: 0, R: 0, G: 0 },
      cmcCurve: {},
      colorCounts: { W: 0, U: 0, B: 0, R: 0, G: 0, Multi: 0, Colorless: 0 },
    };
  
    for (const card of deckCards) {
      const { type_line, mana_cost, cmc, colors, count } = card;
      const isLand = type_line.toLowerCase().includes('land');
      if (isLand) {
        stats.totalLands += count;
        continue;
      }
  
      stats.totalSpells += count;
  
      // Count mana symbols
      (mana_cost.match(/\{[WUBRG]\}/g) || []).forEach((sym) => {
        const symbol = sym.replace(/[{}]/g, '');
        stats.colorSymbols[symbol] += count;
      });
  
      // CMC curve
      const curveKey = Math.floor(cmc);
      stats.cmcCurve[curveKey] = (stats.cmcCurve[curveKey] || 0) + count;
  
      // Color identity
      if (colors.length === 0) {
        stats.colorCounts.Colorless += count;
      } else if (colors.length === 1) {
        stats.colorCounts[colors[0]] += count;
      } else {
        stats.colorCounts.Multi += count;
      }
    }
  
    return stats;
  }
  