import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/DeckTools.module.css';

const DeckTools = () => {
  return (
    <div className={styles.container}>
      <h1>Deck Tools</h1>
      
      <section className={styles.toolSection}>
        <h2>📊 Deck Calculators</h2>
        <p>Analyze diferent calculations from your or any deck</p>
        <Link to="/tools/calculators"> Calculators </Link>
      </section>

      <Link to="/tools/manabase"> Manabase Analyzer </Link>
      <section className={styles.toolSection}>
        <h2>📊 Deck Stats Analysis</h2>
        <p>Analyze your deck's mana curve, color distribution, and card types.</p>
        {/* Placeholder for DeckStats component */}
      </section>

      <section className={styles.toolSection}>
        <h2>🎯 Hypergeometric Calculator</h2>
        <p>Calculate probabilities of drawing key cards or combinations.</p>
        {/* Placeholder for HypergeometricCalculator component */}
      </section>

      <section className={styles.toolSection}>
        <h2>💧 Manabase Tool</h2>
        <p>Estimate optimal land counts and color sources for your deck.</p>
        <Link to="/tools/manabase"> Manabase Analyzer </Link>
      </section>
    </div>
  );
};

export default DeckTools;
