import React from 'react';
import styles from './ManaAnalysisResult.module.css';

const ManaAnalysisResult = ({ result }) => {
  const { stats } = result;

  return (
    <div className={styles.wrapper}>
      <h2>🔍 Manabase Analysis</h2>

      {stats.colorViolations?.length > 0 && (
        <section className={styles.section}>
          <h3>❗ Color Identity Violations</h3>
          <ul>
            {stats.colorViolations.map(name => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.section}>
        <h3>Deck Composition</h3>
        <ul>
          <li><strong>Total Lands:</strong> {stats.totalLands || stats.landCount}</li>
          <li><strong>Total Spells:</strong> {stats.totalSpells || stats.pipCosts?.reduce((a, b) => a + b.count, 0)}</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h3>Mana Symbols</h3>
        <ul>
          {Object.entries(stats.colorSymbols || {}).map(([color, count]) => (
            <li key={color}><strong>{color}:</strong> {count}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
  <h3>Castability by Turn</h3>
  <p className={styles.tooltip}>
    Hover over values to see chance of casting each spell by that turn.
  </p>
  <table className={styles.table}>
    <thead>
      <tr>
        <th>Card</th>
        <th>CMC</th>
        {Array.from({ length: 8 }).map((_, i) => (
          <th key={i}>T{i}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {stats.castability
        ?.sort((a, b) => a.cmc - b.cmc || a.name.localeCompare(b.name))
        .map(card => (
          <tr key={card.name}>
            <td>{card.name}</td>
            <td>{card.cmc}</td>
            {card.castChances.slice(0, 8).map((chance, i) => {
              const pct = (chance * 100).toFixed(0);
              let className = '';
              if (pct < 50) className = styles.low;
              else if (pct < 75) className = styles.medium;
              else className = styles.high;

              return (
                <td key={i} className={className} title={`Turn ${i}: ${pct}%`}>
                  {pct}%
                </td>
              );
            })}
          </tr>
        ))}
    </tbody>
  </table>
</section>

{stats.pipNeeds?.length > 0 && (
  <section className={styles.section}>
    <h3>🔶 Pip Difficulty</h3>
    <p className={styles.tooltip}>
      Estimated sources needed to cast each spell by turn 3 with ≥80% probability.
    </p>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Card</th>
          <th>Cost</th>
          <th>Needed</th>
          <th>Available</th>
          <th>Prob</th>
        </tr>
      </thead>
      <tbody>
        {stats.pipNeeds
          .sort((a, b) => (b.neededSources || 0) - (a.neededSources || 0))
          .map((entry) => (
            <tr key={entry.name}>
              <td>{entry.name}</td>
              <td>{entry.pipGroups.map(p => `${p[1]} ${p[0]}`).join(' + ')}</td>
              <td className={entry.warning ? styles.low : styles.high}>
                {entry.neededSources ?? '—'}
              </td>
              <td>{entry.availableSources}</td>
              <td>{(entry.prob * 100).toFixed(0)}%</td>
            </tr>
          ))}
      </tbody>
    </table>
  </section>
)}

    </div>
  );
};

export default ManaAnalysisResult;
