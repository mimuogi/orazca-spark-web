import { useState } from 'react';
import { parseDecklist } from '../utils/deckParser';
import { fetchDeckCards } from '../utils/fetchCardData';
import { analyzeDeckMana } from '../utils/manaEngine/manaAnalysis';

const useManaTool = () => {
  const [deckText, setDeckText] = useState('');
  const [commanderNames, setCommanderNames] = useState(['', '', '']);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ step: '', percent: 0 });
  const [error, setError] = useState(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    setProgress({ step: 'Parsing deck...', percent: 10 });
  
    try {
      const parsed = parseDecklist(deckText, commanderNames);
      setProgress({ step: 'Fetching card data...', percent: 30 });
  
      const detailedCards = await fetchDeckCards(parsed.cards, (index, total) => {
        setProgress({ step: `Fetched ${index + 1} / ${total} cards`, percent: 30 + (index + 1) / total * 30 });
      });
  
      setProgress({ step: 'Analyzing mana...', percent: 70 });
      const manaStats = analyzeDeckMana(detailedCards, parsed.commanders);
      setProgress({ step: 'Estimating castability...', percent: 90 });
  
      setAnalysisResult({
        commanders: parsed.commanders,
        cards: detailedCards,
        stats: manaStats,
      });
  
      setProgress({ step: 'Done!', percent: 100 });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch card data from Scryfall.');
    } finally {
      setLoading(false);
    }
  };
  
  return {
    deckText,
    commanderNames,
    setDeckText,
    setCommanderNames,
    runAnalysis,
    analysisResult,
    loading,
    progress,
    error,
  };
};

export default useManaTool;
