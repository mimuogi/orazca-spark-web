import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/CardContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const DeckManager = () => {
  const [decks, setDecks] = useState([]);
  const [editingDeck, setEditingDeck] = useState(null);
  const [name, setName] = useState('');
  const [format, setFormat] = useState('');
  const [cards, setCards] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    const res = await fetch('/api/decks');
    const data = await res.json();
    setDecks(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingDeck ? 'PUT' : 'POST';
    const url = editingDeck ? `/api/decks/${editingDeck._id}` : '/api/decks';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, format, cards: cards.split('\n') })
    });

    if (res.ok) {
      setMessage(editingDeck ? 'Mazo actualizado' : 'Mazo creado');
      setName('');
      setFormat('');
      setCards('');
      setEditingDeck(null);
      fetchDecks();
    } else {
      setMessage('Error al guardar el mazo');
    }
  };

  const handleEdit = (deck) => {
    setEditingDeck(deck);
    setName(deck.name);
    setFormat(deck.format);
    setCards(deck.cards.join('\n'));
  };

  const handleDelete = async (id) => {
    await fetch(`/api/decks/${id}`, { method: 'DELETE' });
    fetchDecks();
  };

  const handleView = (id) => {
    router.push(`/decks/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <Card className="mb-6">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">{editingDeck ? 'Editar Mazo' : 'Crear nuevo Mazo'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Nombre del mazo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Formato (ej. Commander, Moderno)"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              required
            />
            <Textarea
              placeholder="Cartas (una por línea)"
              rows={10}
              value={cards}
              onChange={(e) => setCards(e.target.value)}
              required
            />
            <Button type="submit">{editingDeck ? 'Actualizar' : 'Crear'}</Button>
          </form>
          {message && <p className="mt-4 text-sm text-center">{message}</p>}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {decks.map(deck => (
          <Card key={deck._id} className="p-4">
            <CardContent>
              <h3 className="text-lg font-semibold cursor-pointer" onClick={() => handleView(deck._id)}>{deck.name}</h3>
              <p className="text-sm text-gray-500">Formato: {deck.format}</p>
              <div className="mt-2 space-x-2">
                <Button onClick={() => handleEdit(deck)}>Editar</Button>
                <Button variant="destructive" onClick={() => handleDelete(deck._id)}>Eliminar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DeckManager;
