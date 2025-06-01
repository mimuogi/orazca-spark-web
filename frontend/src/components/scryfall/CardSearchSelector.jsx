import React, { useState, useEffect, useRef } from 'react';
import styles from './CardSearchSelector.module.css';

const CardSearchSelector = ({ onSelect }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [previews, setPreviews] = useState({});
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef(null);

  useEffect(() => {
    if (activeIndex >= 0 && results[activeIndex]) {
      const name = results[activeIndex];
      if (!previews[name]) {
        fetchPreview(name);
      }
    }
  }, [activeIndex, results]);

  const fetchPreview = async (name) => {
    try {
      const res = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`);
      const card = await res.json();
      setPreviews(prev => ({
        ...prev,
        [name]: {
          mana_cost: card.mana_cost || '—',
          image: card.image_uris?.small || null,
          set: card.set || null,
        }
      }));
    } catch {}
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    setActiveIndex(-1);
    if (value.length < 2) return;
    try {
      const res = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      const names = data.data || [];
      setResults(names);
      names.forEach(name => fetchPreview(name));
    } catch (error) {
      console.error('Error buscando cartas:', error);
    }
  };

  const handleSelect = (cardName) => {
    const card = previews[cardName];
    if (card?.set) {
      onSelect({ name: cardName, set: card.set });
    }
    setSearch('');
    setResults([]);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          className={styles.input}
          placeholder="Card Name..."
        />
        {results.length > 0 && (
          <ul ref={listRef} className={styles.results} style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {results.map((name, index) => (
              <li
                key={name}
                className={`${styles.resultItem} ${index === activeIndex ? styles.active : ''}`}
                onClick={() => handleSelect(name)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {previews[name]?.image && (
                  <img src={previews[name].image} alt={name} className="w-12 h-auto rounded inline-block mr-2" />
                )}
                <span className={styles.cardName}>{name}</span>
                <span className={styles.manaCost}> {previews[name]?.mana_cost || '—'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CardSearchSelector;
