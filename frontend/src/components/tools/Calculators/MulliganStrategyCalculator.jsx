import React, {useState} from 'react';

function MulliganStrategyCalculator() {
    const [landCount, setLandCount] = useState(24);
    const [deckSize, setDeckSize] = useState(60);
    const [minLands, setMinLands] = useState(2);
    const [maxLands, setMaxLands] = useState(4);
    const [result, setResult] = useState(null);
  
    const simulate = () => {
      const handSize = 7;
      const iterations = 10000;
      let hits = 0;
  
      for (let i = 0; i < iterations; i++) {
        let lands = 0;
        for (let j = 0; j < handSize; j++) {
          if (Math.random() < landCount / deckSize) {
            lands++;
          }
        }
        if (lands >= minLands && lands <= maxLands) hits++;
      }
  
      setResult(((hits / iterations) * 100).toFixed(2));
    };
  
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Mulligan Strategy</h2>
        <input type="number" value={landCount} onChange={e => setLandCount(+e.target.value)} placeholder="Lands in deck" className="border p-2 mr-2" />
        <input type="number" value={deckSize} onChange={e => setDeckSize(+e.target.value)} placeholder="Deck size" className="border p-2 mr-2" />
        <input type="number" value={minLands} onChange={e => setMinLands(+e.target.value)} placeholder="Min lands" className="border p-2 mr-2" />
        <input type="number" value={maxLands} onChange={e => setMaxLands(+e.target.value)} placeholder="Max lands" className="border p-2 mr-2" />
        <button onClick={simulate} className="bg-blue-500 text-white px-4 py-1 rounded">Simulate</button>
        {result && <div className="mt-2 font-bold">Keepable hand rate: {result}%</div>}
      </div>
    );
}

export default MulliganStrategyCalculator;
