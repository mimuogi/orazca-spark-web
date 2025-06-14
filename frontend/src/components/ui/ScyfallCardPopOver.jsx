// CardMention.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ScryfallCardPopOver({ cardName }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchImage() {
      const response = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`);
      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.image_uris?.normal || data.card_faces?.[0]?.image_uris?.normal || null);
      }
    }
    fetchImage();
  }, [cardName]);

  return (
    <span
      className="italic text-blue-700 hover:underline cursor-pointer relative"
      onMouseEnter={() => setShowImage(true)}
      onMouseLeave={() => setShowImage(false)}
      onClick={() => navigate(`/card/${encodeURIComponent(cardName)}`)}
    >
      {cardName}
      {showImage && imageUrl && (
        <div className="absolute z-50 bg-white border border-gray-300 p-2 rounded-2xl shadow-lg top-full left-1/2 transform -translate-x-1/2 mt-2">
          <img src={imageUrl} alt={cardName} className="max-w-xs" />
        </div>
      )}
    </span>
  );
}

export default ScryfallCardPopOver;
