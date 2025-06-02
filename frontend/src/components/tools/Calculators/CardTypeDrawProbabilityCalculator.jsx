import React, {useState} from 'react';

function CardTypeDrawProbabilityCalculator() {
    const [copies, setCopies] = useState(4);
    const [draws, setDraws] = useState(7);
    const [deckSize, setDeckSize] = useState(60);
    const [probability, setProbability] = useState(null);
  
    const calculateProbability = () => {
      const comb = (n, k) => {
        if (k === 0 || k === n) return 1;
        if (k > n) return 0;
        let res = 1;
        for (let i = 1; i <= k; i++) {
          res *= (n - i + 1) / i;
        }
        return res;
      };
  
      let prob = 0;
      for (let i = 1; i <= Math.min(copies, draws); i++) {
        prob += (comb(copies, i) * comb(deckSize - copies, draws - i)) / comb(deckSize, draws);
      }
  
      setProbability((prob * 100).toFixed(2));
    };
  
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Card Type Draw Probability</h2>
        <input type="number" value={copies} onChange={e => setCopies(+e.target.value)} placeholder="Copies in deck" className="border p-2 mr-2" />
        <input type="number" value={draws} onChange={e => setDraws(+e.target.value)} placeholder="Cards drawn" className="border p-2 mr-2" />
        <input type="number" value={deckSize} onChange={e => setDeckSize(+e.target.value)} placeholder="Deck size" className="border p-2 mr-2" />
        <button onClick={calculateProbability} className="bg-blue-500 text-white px-4 py-1 rounded">Calculate</button>
        {probability && <div className="mt-2 font-bold">Probability: {probability}%</div>}
      </div>
    );
  
}

export default CardTypeDrawProbabilityCalculator;
