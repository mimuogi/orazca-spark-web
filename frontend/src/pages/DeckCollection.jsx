import { useEffect, useState } from 'react';
import CreateDeck from '../components/CreateDeck';
import API from '../api/axios';

function DeckCollection() {
  const [decks, setDecks] = useState([]);
  const [editDeckId, setEditDeckId] = useState(null);
  const [editFields, setEditFields] = useState({});

  const fetchDecks = () => {
    API.get('/decks').then(res => setDecks(res.data)).catch(() => setDecks([]));
  };

  useEffect(fetchDecks, []);

  const handleEditChange = (e) =>
    setEditFields({ ...editFields, [e.target.name]: e.target.value });

  const saveEdit = async (id) => {
    try {
      await API.put(`/decks/${id}`, editFields);
      setEditDeckId(null);
      fetchDecks();
    } catch (err) {
      console.error('Error al editar mazo');
    }
  };

  const deleteDeck = async (id) => {
    if (!window.confirm('¿Eliminar mazo?')) return;
    await API.delete(`/decks/${id}`);
    fetchDecks();
  };

  return (
    <div>
      <h1>Your Deck Collection</h1>
      <CreateDeck onCreated={fetchDecks} />
      <hr />
      <h2>Deck List</h2>
      <ul>
        {decks.map(deck =>
          <li key={deck._id}>
            {editDeckId === deck._id ? (
              <>
                <input name="title" defaultValue={deck.title} onChange={handleEditChange} />
                <input name="description" defaultValue={deck.description} onChange={handleEditChange} />
                <button onClick={() => saveEdit(deck._id)}>💾 Guardar</button>
                <button onClick={() => setEditDeckId(null)}>✖ Cancelar</button>
              </>
            ) : (
              <>
                <strong>{deck.title}</strong> – {deck.format}
                <button onClick={() => {
                  setEditDeckId(deck._id);
                  setEditFields({ title: deck.title, description: deck.description });
                }}>✏️ Editar</button>
                <button onClick={() => deleteDeck(deck._id)}>🗑️ Eliminar</button>
              </>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}

export default DeckCollection;
