export function parseDecklist(rawText, commanderNames = []) {
    const cleaned = rawText
      .replaceAll("&", "%26")
      .replace(/(\d+)x?/g, '$1') // normalize counts
      .replace(/\[.*\]/g, '') // remove set info
      .replace(/#.*\n/g, '\n') // remove comments
      .replace(/\*F\*/g, '') // strip flags
      .split('\n');
  
    const deck = [];
    let inSideboard = false;
  
    cleaned.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().includes('sideboard')) {
        inSideboard = true;
      } else if (trimmed && !inSideboard) {
        const match = trimmed.match(/^(\d+)\s+(.+)$/);
        if (match) {
          const count = parseInt(match[1], 10);
          const name = decodeURIComponent(match[2].replace("%26", "&")).trim();
          deck.push({ name, count });
        }
      }
      if (trimmed === '') inSideboard = false;
    });
  
    return {
      cards: deck,
      commanders: commanderNames.filter(name => !!name.trim())
    };
  }
  