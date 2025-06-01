// Factorial using loop (x!)
export function fact(x) {
    let y = x;
    while (x > 2) {
      x = x - 1;
      y = y * x;
    }
    return y === 0 ? 1 : y;
  }
  
  // x! / y! when x > y
  export function partialFact(y, x) {
    let z = 1;
    while (x > y && x > 1) {
      z *= x;
      x--;
    }
    return z === 0 ? 1 : z;
  }
  
  // Binomial coefficient C(x, y)
  export function quickChoose(x, y) {
    return partialFact(Math.max(y, x - y), x) / fact(Math.min(y, x - y));
  }
  
  // P(X = k) for hypergeometric distribution
  export function drawType(deckSize, matchCount, drawSize, targetCount) {
    return (
      (quickChoose(deckSize - matchCount, drawSize - targetCount) *
        quickChoose(matchCount, targetCount)) /
      quickChoose(deckSize, drawSize)
    );
  }
  
  // P(X ≥ k)
  export function drawTypeMin(deckSize, matchCount, drawSize, minTargetCount) {
    let sum = 0;
    for (
      let i = minTargetCount;
      i <= drawSize && i <= matchCount;
      i++
    ) {
      sum += drawType(deckSize, matchCount, drawSize, i);
    }
    return sum;
  }
  
  // P(XA ≥ a and XB ≥ b)
  export function drawTwoTypeMin(deckSize, totalA, totalB, drawSize, minA, minB) {
    let prob = 0;
    for (let i = minA; i <= drawSize && i <= totalA; i++) {
      prob += drawType(deckSize, totalA, drawSize, i) *
              drawTypeMin(deckSize - totalA, totalB, drawSize - i, minB);
    }
    return prob;
  }
  