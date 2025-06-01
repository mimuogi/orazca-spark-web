// Parse a Scryfall mana cost string like "{1}{U}{U}" or "{R/W}" into color cost object
export function getColorCost(manaCostString) {
    const pip = (sym) => manaCostString.split(sym).length - 1;
  
    const cost = {
      w: pip("{W}"),
      u: pip("{U}"),
      b: pip("{B}"),
      r: pip("{R}"),
      g: pip("{G}"),
      wu: pip("{W/U}"),
      wb: pip("{W/B}"),
      wr: pip("{R/W}"),
      wg: pip("{G/W}"),
      ub: pip("{U/B}"),
      ur: pip("{U/R}"),
      ug: pip("{G/U}"),
      br: pip("{B/R}"),
      bg: pip("{B/G}"),
      rg: pip("{R/G}"),
      x: pip("{X}"),
      c: 0, // numeric cost
      t: 0  // total cost (converted mana cost)
    };
  
    // Match {number} as colorless numeric values
    const genericMatches = manaCostString.match(/\{(\d+)\}/g);
    if (genericMatches) {
      cost.c = genericMatches.reduce((acc, match) => acc + parseInt(match.replace(/[{}]/g, '')), 0);
    }
  
    const xValue = cost.x === 1 ? 3 : cost.x === 2 ? 2 : cost.x > 2 ? 1 : 0;
  
    cost.t =
      cost.w + cost.u + cost.b + cost.r + cost.g +
      cost.wu + cost.wb + cost.wr + cost.wg +
      cost.ub + cost.ur + cost.ug +
      cost.br + cost.bg + cost.rg +
      cost.c + cost.x * xValue;
  
    return cost;
  }
  