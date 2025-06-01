import React from 'react';
import DeckInput from '../components/ManaTool/DeckInput';
import ManaAnalysisResult from '../components/ManaTool/ManaAnalysisResults';
import useManaTool from '../hooks/useManaTool';
import styles from './styles/ManaTool.module.css';

const ManaTool = () => {
  const {
    deckText,
    commanderNames,
    setCommanderNames,
    setDeckText,
    runAnalysis,
    analysisResult,
    loading,
    error,
    progress
  } = useManaTool();

  return (
    <div className={styles.container}>
      <h1>💧 Mana Base Analyzer</h1>

      <DeckInput
        onDeckChange={setDeckText}
        commanderNames={commanderNames}
        onCommanderChange={setCommanderNames}
        onAnalyze={runAnalysis}
        loading={loading}
      />

      {loading && (
        <div className={styles.progressBox}>
          <p>{progress.step}</p>
          <div className={styles.progressBar}>
            <div style={{ width: `${progress.percent}%` }} className={styles.barFill}></div>
          </div>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}
      {analysisResult && <ManaAnalysisResult result={analysisResult} />}
    </div>
  );
};

export default ManaTool;

