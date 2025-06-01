export async function fetchCardInfo(name) {
    const url = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Card not found: ${name}`);
    return res.json();
  }
  
  export async function fetchDeckCards(deck, onProgress) {
    const results = [];
    for (let i = 0; i < deck.length; i++) {
      const { name, count } = deck[i];
      try {
        const card = await fetchCardInfo(name);
        results.push({
          name,
          count,
          mana_cost: card.mana_cost || '',
          type_line: card.type_line || '',
          cmc: card.cmc || 0,
          colors: card.colors || [],
          color_identity: card.color_identity || [],
          oracle_text: card.oracle_text || '',
          produced_mana: card.produced_mana || []
        });
      } catch (err) {
        console.warn(`Skipping ${name}: ${err.message}`);
      }
      if (onProgress) onProgress(i, deck.length);
    }
    return results;
  }
  