import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function CardDetails() {
  const { name } = useParams();
  const [card, setCard] = useState(null);

  useEffect(() => {
    async function fetchCard() {
      const res = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`);
      if (res.ok) {
        const data = await res.json();
        setCard(data);
      }
    }
    fetchCard();
  }, [name]);

  if (!card) return <p className="text-center mt-10">Cargando carta...</p>;

  const renderImages = () => {
    if (card.image_uris) {
      return <img src={card.image_uris.normal} alt={card.name} className="mb-4 rounded-2xl shadow-lg" />;
    } else if (card.card_faces) {
      return (
        <div className="flex gap-4 mb-4">
          {card.card_faces.map((face, i) => (
            <img
              key={i}
              src={face.image_uris?.normal}
              alt={face.name}
              className="rounded-2xl shadow-lg"
            />
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{card.name}</h1>
      {renderImages()}
      <div className="space-y-2">
        {card.mana_cost && <p><strong>Costo de maná:</strong> {card.mana_cost}</p>}
        {card.type_line && <p><strong>Tipo:</strong> {card.type_line}</p>}
        {card.oracle_text && <p><strong>Texto de reglas:</strong> <span className="whitespace-pre-line">{card.oracle_text}</span></p>}
        {card.power && <p><strong>Poder:</strong> {card.power}</p>}
        {card.toughness && <p><strong>Resistencia:</strong> {card.toughness}</p>}
        {card.loyalty && <p><strong>Lealtad:</strong> {card.loyalty}</p>}
        {card.set_name && <p><strong>Expansión:</strong> {card.set_name}</p>}
        {card.rarity && <p><strong>Rareza:</strong> {card.rarity}</p>}
        {card.artist && <p><strong>Artista:</strong> {card.artist}</p>}
        {card.flavor_text && <p><strong>Texto de ambientación:</strong> <em className="text-gray-600">{card.flavor_text}</em></p>}
        {card.prices?.usd && <p><strong>Precio USD:</strong> ${card.prices.usd}</p>}
        {card.related_uris?.gatherer && (
          <p>
            <strong>Gatherer:</strong> <a className="text-blue-600 underline" href={card.related_uris.gatherer} target="_blank" rel="noopener noreferrer">ver más</a>
          </p>
        )}
      </div>
    </div>
  );
}

export default CardDetails;