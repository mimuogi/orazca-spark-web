import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DeckDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [deck, setDeck] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/decks/${id}`)
        .then(res => res.json())
        .then(data => setDeck(data));
    }
  }, [id]);

  if (!deck) return <p className="text-center mt-10">Cargando mazo...</p>;

  const commanderIndex = deck.cards.findIndex(c => c.trim() === '' || c.trim().startsWith('1 '));
  const commander = deck.cards.slice(commanderIndex + 1).filter(Boolean);
  const mainDeck = deck.cards.slice(0, commanderIndex).filter(Boolean);

  const handleCopy = async () => {
    const exportText = `${mainDeck.join('\n')}\n\n${commander.join('\n')}`;
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <Card>
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-bold">{deck.name}</h1>
          <p className="text-sm text-gray-500">Formato: {deck.format}</p>
          <Button onClick={handleCopy}>{copied ? 'Copiado!' : 'Copiar como texto'}</Button>
          <div>
            <h2 className="text-lg font-semibold mt-6 mb-2">Comandante</h2>
            <ul className="list-disc list-inside">
              {commander.map((line, i) => <li key={`commander-${i}`}>{line}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mt-6 mb-2">Mazo Principal</h2>
            <ul className="list-disc list-inside">
              {mainDeck.map((line, i) => <li key={`main-${i}`}>{line}</li>)}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeckDetail;
