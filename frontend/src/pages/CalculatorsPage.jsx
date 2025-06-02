import React, { useState } from 'react';
import CardTypeDrawProbabilityCalculator from '../components/tools/Calculators/CardTypeDrawProbabilityCalculator';
import MulliganStrategyCalculator from '../components/tools/Calculators/MulliganStrategyCalculator';
import LandDropMissCalculator from '../components/tools/Calculators/LandDropMissCalculator';
import MultiTypeMulliganCalculator from '../components/tools/Calculators/MultiTypeMulliganCalculator';
import OpeningHandCalculator from '../components/tools/Calculators/OpeningHandCalculator';
import ComboDrawCalculator from '../components/tools/Calculators/ComboDrawCalculator';

const sections = [
  { title: "Card Type Draw Probability", Component: CardTypeDrawProbabilityCalculator },
  { title: "Mulligan Strategy", Component: MulliganStrategyCalculator },
  { title: "Land Drop Miss", Component: LandDropMissCalculator },
  { title: "Multi-Type Mulligan", Component: MultiTypeMulliganCalculator },
  { title: "Opening Hand Land Count", Component: OpeningHandCalculator },
  { title: "Combo Draw Odds", Component: ComboDrawCalculator }
];

function CalculatorsPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Advanced MTG Calculators</h1>
      {sections.map(({ title, Component }, index) => (
        <div key={title} className="mb-4 border rounded">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full text-left px-4 py-3 bg-gray-200 hover:bg-gray-300 font-semibold"
          >
            {title}
          </button>
          {openIndex === index && (
            <div className="p-4 border-t">
              <Component />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CalculatorsPage;