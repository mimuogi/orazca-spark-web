import React from 'react';
import styles from './DeckInput.module.css';

const DeckInput = ({ onDeckChange, commanderNames, onCommanderChange, onAnalyze, loading }) => {
  return (
    <div className={styles.wrapper}>
      <textarea
        placeholder="Paste your decklist here"
        onChange={(e) => onDeckChange(e.target.value)}
        className={styles.textarea}
      />
      <div className={styles.commanders}>
        {['1', '2', '3'].map((n) => (
          <input
            key={n}
            type="text"
            placeholder={`Commander ${n}`}
            value={commanderNames[n - 1] || ''}
            onChange={(e) => {
              const updated = [...commanderNames];
              updated[n - 1] = e.target.value;
              onCommanderChange(updated);
            }}
            className={styles.input}
          />
        ))}
      </div>
      <button onClick={onAnalyze} disabled={loading} className={styles.button}>
        {loading ? 'Analyzing...' : 'Run Analysis'}
      </button>
    </div>
  );
};

export default DeckInput;
