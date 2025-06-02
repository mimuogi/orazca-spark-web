import React, {useState} from 'react';

function ComboDrawCalculator() {
    const [deckSize, setDeckSize] = useState(60);
    const [pieces, setPieces] = useState([
      { name: 'A', count: 4 },
      { name: 'B', count: 4 },
      { name: 'C', count: 4 },
    ]);
    const [turns, setTurns] = useState(3);
    const [iterations, setIterations] = useState(10000);
    const [probability, setProbability] = useState(null);
  
    const simulate = () => {
      let hits = 0;
  
      for (let i = 0; i < iterations; i++) {
        const deck = Array(deckSize).fill('X');
        let index = 0;
        for (let p of pieces) {
          for (let j = 0; j < p.count; j++) {
            deck[index++] = p.name;
          }
        }
  
        for (let j = deck.length - 1; j > 0; j--) {
          const r = Math.floor(Math.random() * (j + 1));
          [deck[j], deck[r]] = [deck[r], deck[j]];
        }
  
        const hand = deck.slice(0, 7 + turns);
        const foundAll = pieces.every(p => hand.includes(p.name));
        if (foundAll) hits++;
      }
  
      setProbability(((hits / iterations) * 100).toFixed(2));
    };
  
    const updatePiece = (index, field, value) => {
      const newPieces = [...pieces];
      newPieces[index][field] = field === 'count' ? +value : value;
      setPieces(newPieces);
    };
  
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Combo Draw Odds Calculator</h2>
        <div className="space-y-2">
          <input type="number" value={deckSize} onChange={e => setDeckSize(+e.target.value)} placeholder="Deck size" className="border p-2 w-full" />
          <input type="number" value={turns} onChange={e => setTurns(+e.target.value)} placeholder="Turns to draw" className="border p-2 w-full" />
          <input type="number" value={iterations} onChange={e => setIterations(+e.target.value)} placeholder="Simulations" className="border p-2 w-full" />
          {pieces.map((p, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={p.name} onChange={e => updatePiece(i, 'name', e.target.value)} placeholder="Name" className="border p-1" />
              <input type="number" value={p.count} onChange={e => updatePiece(i, 'count', e.target.value)} placeholder="Count" className="border p-1" />
            </div>
          ))}
        </div>
        <button onClick={simulate} className="bg-green-600 text-white px-4 py-1 mt-3 rounded">Simulate</button>
        {probability && <div className="mt-2 font-bold">Chance to draw all pieces: {probability}%</div>}
      </div>
    );
}

export default ComboDrawCalculator;