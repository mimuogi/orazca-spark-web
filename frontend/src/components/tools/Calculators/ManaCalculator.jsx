import React, { useState } from 'react';

function ManaCalculator() {
  const [sources, setSources] = useState({ red: 0, blue: 0, green: 0, white: 0, black: 0 });
  const [result, setResult] = useState(null);

  const calculateMana = () => {
    const total = Object.values(sources).reduce((a, b) => a + Number(b), 0);
    const distribution = Object.entries(sources).map(([color, count]) => `${color}: ${((count / total) * 100).toFixed(1)}%`);
    setResult(distribution);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Mana Distribution Calculator</h2>
      {Object.keys(sources).map((color) => (
        <div key={color} className="mb-2">
          <label className="block capitalize">{color} sources</label>
          <input
            type="number"
            className="border rounded w-full p-2"
            value={sources[color]}
            onChange={(e) => setSources({ ...sources, [color]: e.target.value })}
          />
        </div>
      ))}
      <button onClick={calculateMana} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
        Calculate
      </button>
      {result && (
        <div className="mt-4">
          <h3 className="font-semibold">Distribution:</h3>
          <ul className="list-disc list-inside">
            {result.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ManaCalculator;
