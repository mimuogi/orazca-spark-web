import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import CardContent from '@/components/ui/CardContent';

const DeckList = () => {
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/decks')
      .then(res => res.json())
      .then(data => setDecks(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Mazos</h1>
      {decks.map(deck => (
        <Card key={deck._id} className="cursor-pointer" onClick={() => navigate(`/decks/${deck._id}`)}>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">{deck.name}</h2>
            <p className="text-sm text-gray-500">Formato: {deck.format}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DeckList;
