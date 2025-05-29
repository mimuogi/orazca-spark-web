import { useState } from 'react';
import API from '../api/axios';

function CreateDeck({ onCreated }) {
  const [deck, setDeck] = useState({
    title: '',
    description: '',
    format: '',
    mainboard: '',
    sideboard: '',
    maybeboard: ''
  });
  const [message, setMessage] = useState('');

  const parseCards = input =>
    input.split(',').map(str => {
      const [name, qty = '1'] = str.trim().split(' x');
      return { name: name.trim(), quantity: parseInt(qty.trim()) };
    });

  const handleChange = e => setDeck({ ...deck, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/decks', {
        title: deck.title,
        description: deck.description,
        format: deck.format,
        mainboard: parseCards(deck.mainboard),
        sideboard: parseCards(deck.sideboard),
        maybeboard: parseCards(deck.maybeboard)
      });
      setMessage(`Deck creado: ${res.data.title}`);
      if (onCreated) onCreated(); // 🔁 actualiza lista
    } catch (err) {
      setMessage('Error al crear mazo');
    }
  };

  return (
    <div>
      <h2>Create Deck</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} /><br />
        <input name="description" placeholder="Description" onChange={handleChange} /><br />
        <input name="format" placeholder="Format" onChange={handleChange} /><br />
        <textarea name="mainboard" placeholder="Mainboard (Card xQty, ...)" onChange={handleChange} /><br />
        <textarea name="sideboard" placeholder="Sideboard (Card xQty, ...)" onChange={handleChange} /><br />
        <textarea name="maybeboard" placeholder="Maybeboard (Card xQty, ...)" onChange={handleChange} /><br />
        <button type="submit">Create</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateDeck;
