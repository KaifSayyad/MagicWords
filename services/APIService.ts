import { Word } from '@/types';

// Fetch a random word from the random word API
export const fetchRandomWord = async (): Promise<string> => {
  try {
    const response = await fetch('https://random-word-api.vercel.app/api?words=1');
    if (!response.ok) {
      throw new Error('Failed to fetch random word');
    }
    const data = await response.json();
    return data[0] as string;
  } catch (error) {
    console.error('Error fetching random word:', error);
    throw new Error('Unable to fetch a random word. Please try again later.');
  }
};

// Fetch word definition from the dictionary API
export const fetchWordDefinition = async (word: string): Promise<Word> => {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`No definition found for "${word}"`);
      }
      throw new Error('Failed to fetch word definition');
    }
    
    const data = await response.json();
    if (!data || !data[0]) {
      throw new Error('Invalid response format');
    }
    
    // Format date to ISO string for consistency
    const fetchDate = new Date().toISOString();
    
    // Format the API response to match our Word type
    const wordData: Word = {
      ...data[0],
      fetchDate,
    };
    
    return wordData;
  } catch (error) {
    console.error('Error fetching word definition:', error);
    throw error;
  }
};

// Get word of the day by first fetching a random word and then its definition
export const getWordOfTheDay = async (): Promise<Word> => {
  try {
    // First get a random word
    const randomWord = await fetchRandomWord();
    
    // Then fetch its definition
    const wordDefinition = await fetchWordDefinition(randomWord);
    
    return wordDefinition;
  } catch (error) {
    console.error('Error getting word of the day:', error);
    throw error;
  }
};