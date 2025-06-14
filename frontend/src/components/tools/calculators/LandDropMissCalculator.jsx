import React, {useState} from 'react';

function LandDropMissCalculator() {
    const [landCount, setLandCount] = useState(24);
    const [deckSize, setDeckSize] = useState(60);
    const [turns, setTurns] = useState(3);
    const [iterations, setIterations] = useState(10000);
    const [missRate, setMissRate] = useState(null);
  
    const simulate = () => {
      let misses = 0;
  
      for (let i = 0; i < iterations; i++) {
        let landsSeen = 0;
        for (let j = 0; j < 7 + turns; j++) {
          if (Math.random() < landCount / deckSize) landsSeen++;
        }
        if (landsSeen < turns) misses++;
      }
  
      setMissRate(((misses / iterations) * 100).toFixed(2));
    };
  
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Land Drop Miss Probability</h2>
        <input type="number" value={landCount} onChange={e => setLandCount(+e.target.value)} placeholder="Land count" className="border p-2 mr-2" />
        <input type="number" value={deckSize} onChange={e => setDeckSize(+e.target.value)} placeholder="Deck size" className="border p-2 mr-2" />
        <input type="number" value={turns} onChange={e => setTurns(+e.target.value)} placeholder="Turns" className="border p-2 mr-2" />
        <input type="number" value={iterations} onChange={e => setIterations(+e.target.value)} placeholder="Simulations" className="border p-2 mr-2" />
        <button onClick={simulate} className="bg-blue-500 text-white px-4 py-1 rounded">Simulate</button>
        {missRate && <div className="mt-2 font-bold">Miss rate: {missRate}%</div>}
      </div>
    );
}

export default LandDropMissCalculator;
