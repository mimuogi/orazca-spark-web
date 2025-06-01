import React, { useState } from 'react';
import ScryfallCardImage from '../components/scryfall/ScryfallCardImage';
import CardSearchSelector from '../components/scryfall/CardSearchSelector';

function Home() {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Bienvenido a Orazca Spark</h1>
      <CardSearchSelector onSelect={setSelectedCard} />
      {selectedCard && (
        <ScryfallCardImage
          cardName={selectedCard.name}
          setCode={selectedCard.set}
          size="large"
          className="mx-auto"
        />
      )}
    </div>
  );
}

export default Home;