import { useState, useEffect, useCallback } from 'react';
import { Word } from '@/types';
import { getWordOfTheDay } from '@/services/APIService';
import { 
  saveWord as saveWordToStorage, 
  getSavedWords, 
  removeWord as removeWordFromStorage,
  isWordSaved as checkIsWordSaved,
  saveWordOfTheDay as saveWordOfTheDayToStorage,
  getWordOfTheDay as getSavedWordOfTheDay 
} from '@/services/StorageService';

export const useWord = () => {
  const [wordOfTheDay, setWordOfTheDay] = useState<Word | null>(null);
  const [savedWords, setSavedWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedWordsMap, setSavedWordsMap] = useState<Record<string, boolean>>({});

  // Fetch saved words from storage
  const fetchSavedWords = useCallback(async () => {
    try {
      const words = await getSavedWords();
      setSavedWords(words);
      
      // Create a map for quick lookups
      const wordsMap: Record<string, boolean> = {};
      words.forEach(word => {
        wordsMap[word.word] = true;
      });
      setSavedWordsMap(wordsMap);
    } catch (err) {
      console.error('Error fetching saved words:', err);
    }
  }, []);

  // Check if a word is saved
  const isWordSaved = useCallback((word: string) => {
    return !!savedWordsMap[word];
  }, [savedWordsMap]);

  // Fetch today's word
  const fetchTodayWord = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if we already have today's word in storage
      const savedWord = await getSavedWordOfTheDay();
      
      if (savedWord && savedWord.isSameDay) {
        // Use the saved word if it's from today
        setWordOfTheDay(savedWord.word);
      } else {
        // Otherwise fetch a new word
        const newWord = await getWordOfTheDay();
        setWordOfTheDay(newWord);
        
        // Save the new word to storage
        await saveWordOfTheDayToStorage(newWord);
      }
    } catch (err) {
      console.error('Error fetching word of the day:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save a word to favorites
  const saveWord = useCallback(async (word: Word) => {
    try {
      await saveWordToStorage(word);
      await fetchSavedWords(); // Refresh the saved words list
    } catch (err) {
      console.error('Error saving word:', err);
    }
  }, [fetchSavedWords]);

  // Remove a word from favorites
  const removeWord = useCallback(async (word: string) => {
    try {
      await removeWordFromStorage(word);
      await fetchSavedWords(); // Refresh the saved words list
    } catch (err) {
      console.error('Error removing word:', err);
    }
  }, [fetchSavedWords]);

  // Initial load
  useEffect(() => {
    fetchSavedWords();
    fetchTodayWord();
  }, [fetchSavedWords, fetchTodayWord]);

  return {
    wordOfTheDay,
    savedWords,
    isLoading,
    error,
    fetchTodayWord,
    saveWord,
    removeWord,
    isWordSaved,
  };
};