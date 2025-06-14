import React, {useState} from 'react';

function MultiTypeMulliganCalculator() {
    const [deckSize, setDeckSize] = useState(60);
    const [types, setTypes] = useState([{ name: "Type 1", count: 10 }]);
    const [handSize, setHandSize] = useState(7);
    const [iterations, setIterations] = useState(10000);
    const [chance, setChance] = useState(null);
  
    const simulate = () => {
      let hits = 0;
      for (let i = 0; i < iterations; i++) {
        let hand = Array(handSize).fill(0).map(() => Math.floor(Math.random() * deckSize));
        const satisfied = types.every(t => {
          let found = 0;
          for (let j = 0; j < handSize; j++) {
            if (hand[j] < t.count) {
              found++;
              hand[j] = deckSize; // Remove this card from hand pool
            }
          }
          return found > 0;
        });
        if (satisfied) hits++;
      }
      setChance(((hits / iterations) * 100).toFixed(2));
    };
  
    const updateType = (index, value) => {
      const newTypes = [...types];
      newTypes[index].count = +value;
      setTypes(newTypes);
    };
  
    const addType = () => {
      if (types.length < 7) {
        setTypes([...types, { name: `Type ${types.length + 1}`, count: 0 }]);
      }
    };
  
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Multi-Type Mulligan Calculator</h2>
        <div className="space-y-2">
          <input type="number" value={deckSize} onChange={e => setDeckSize(+e.target.value)} placeholder="Deck size" className="border p-2 w-full" />
          <input type="number" value={handSize} onChange={e => setHandSize(+e.target.value)} placeholder="Hand size" className="border p-2 w-full" />
          <input type="number" value={iterations} onChange={e => setIterations(+e.target.value)} placeholder="Simulations" className="border p-2 w-full" />
          {types.map((t, i) => (
            <div key={i}>
              <label>{t.name} Count:</label>
              <input type="number" value={t.count} onChange={e => updateType(i, e.target.value)} className="border p-1 ml-2" />
            </div>
          ))}
          <button onClick={addType} className="bg-gray-600 text-white px-3 py-1 rounded">Add Type</button>
        </div>
        <button onClick={simulate} className="bg-green-600 text-white px-4 py-1 mt-3 rounded">Simulate</button>
        {chance && <div className="mt-2 font-bold">Chance to meet all conditions: {chance}%</div>}
      </div>
    );
}

export default MultiTypeMulliganCalculator;