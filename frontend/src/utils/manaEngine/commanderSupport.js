export function extractCommanderColorIdentity(cards, commanderNames) {
    const identity = new Set();
  
    for (const commander of commanderNames) {
      const match = cards.find(c => c.name.toLowerCase() === commander.toLowerCase());
      if (match) {
        for (const color of match.color_identity || []) {
          identity.add(color);
        }
      }
    }
  
    return Array.from(identity);
  }
  