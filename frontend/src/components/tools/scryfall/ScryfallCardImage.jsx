import React, { useEffect, useState } from 'react';
import styles from './ScryfallCardImage.module.css';

const ScryfallCardImage = ({ cardName, setCode, size = 'normal', className = '' }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = setCode
          ? `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}&set=${encodeURIComponent(setCode)}`
          : `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`;

        const response = await fetch(url);
        const data = await response.json();
        if (data.image_uris && data.image_uris[size]) {
          setImageUrl(data.image_uris[size]);
        } else {
          setError('Imagen no disponible');
        }
      } catch (err) {
        setError('Error al cargar la imagen');
      }
    };

    if (cardName) {
      fetchImage();
    }
  }, [cardName, setCode, size]);

  if (error) return <div className={styles.error}>{error}</div>;
  if (!imageUrl) return <div className={styles.loading}>Cargando imagen...</div>;

  return <img src={imageUrl} alt={cardName} className={`${styles.image} ${className}`} />;
};

export default ScryfallCardImage;

