// Determine if a card is a land
export function isLand(card) {
    return card.type_line.toLowerCase().includes('land');
  }
  
  // Encode a land's mana source as a 5-bit integer
  // W=1, U=2, B=4, R=8, G=16
  export function findLandIndex(colors = []) {
    let index = 0;
    if (colors.includes('W')) index += 1;
    if (colors.includes('U')) index += 2;
    if (colors.includes('B')) index += 4;
    if (colors.includes('R')) index += 8;
    if (colors.includes('G')) index += 16;
    return index;
  }
  
  // Detect if a land has basic land types
  export function extractBasicTypes(card) {
    const basics = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'];
    const types = {};
  
    basics.forEach((basic) => {
      if (card.type_line.includes(basic)) {
        types[basic.toLowerCase()] = true;
      }
    });
  
    return types;
  }
  
  // Estimate a card’s mana-producing ability
  export function classifyManaSource(card) {
    const produces = new Set(card.produced_mana || []);
    const fetchesBasics = !!card.oracle_text?.match(/search.*basic/i);
    const fetchesNonbasics = !!card.oracle_text?.match(/fetchland/i); // heuristic
  
    return {
      index: findLandIndex([...produces]),
      basicTypes: extractBasicTypes(card),
      fetch: fetchesBasics ? 'b' : fetchesNonbasics ? 'nb' : null,
      produces: [...produces]
    };
  }
  