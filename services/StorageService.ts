import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word, NotificationSettings } from '@/types';

// Keys for AsyncStorage
const SAVED_WORDS_KEY = '@wordOfTheDay:savedWords';
const NOTIFICATION_SETTINGS_KEY = '@wordOfTheDay:notificationSettings';
const WORD_OF_THE_DAY_KEY = '@wordOfTheDay:current';

// Save a word to the saved words list
export const saveWord = async (word: Word): Promise<void> => {
  try {
    // Get existing saved words
    const savedWordsJSON = await AsyncStorage.getItem(SAVED_WORDS_KEY);
    const savedWords: Word[] = savedWordsJSON ? JSON.parse(savedWordsJSON) : [];
    
    // Check if the word is already saved
    const wordExists = savedWords.some(saved => saved.word === word.word);
    
    if (!wordExists) {
      // Add the new word to the saved words array
      savedWords.push(word);
      
      // Save the updated array
      await AsyncStorage.setItem(SAVED_WORDS_KEY, JSON.stringify(savedWords));
    }
  } catch (error) {
    console.error('Error saving word:', error);
    throw new Error('Failed to save word');
  }
};

// Get all saved words
export const getSavedWords = async (): Promise<Word[]> => {
  try {
    const savedWordsJSON = await AsyncStorage.getItem(SAVED_WORDS_KEY);
    return savedWordsJSON ? JSON.parse(savedWordsJSON) : [];
  } catch (error) {
    console.error('Error getting saved words:', error);
    return [];
  }
};

// Remove a word from saved words
export const removeWord = async (wordToRemove: string): Promise<void> => {
  try {
    // Get existing saved words
    const savedWordsJSON = await AsyncStorage.getItem(SAVED_WORDS_KEY);
    const savedWords: Word[] = savedWordsJSON ? JSON.parse(savedWordsJSON) : [];
    
    // Filter out the word to remove
    const updatedSavedWords = savedWords.filter(word => word.word !== wordToRemove);
    
    // Save the updated array
    await AsyncStorage.setItem(SAVED_WORDS_KEY, JSON.stringify(updatedSavedWords));
  } catch (error) {
    console.error('Error removing word:', error);
    throw new Error('Failed to remove word');
  }
};

// Check if a word is saved
export const isWordSaved = async (word: string): Promise<boolean> => {
  try {
    const savedWords = await getSavedWords();
    return savedWords.some(saved => saved.word === word);
  } catch (error) {
    console.error('Error checking if word is saved:', error);
    return false;
  }
};

// Save notification settings
export const saveNotificationSettings = async (settings: NotificationSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving notification settings:', error);
    throw new Error('Failed to save notification settings');
  }
};

// Get notification settings
export const getNotificationSettings = async (): Promise<NotificationSettings | null> => {
  try {
    const settingsJSON = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    return settingsJSON ? JSON.parse(settingsJSON) : null;
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return null;
  }
};

// Save the current word of the day
export const saveWordOfTheDay = async (word: Word): Promise<void> => {
  try {
    await AsyncStorage.setItem(WORD_OF_THE_DAY_KEY, JSON.stringify({
      ...word,
      date: new Date().toISOString().split('T')[0] // Store the current date (YYYY-MM-DD)
    }));
  } catch (error) {
    console.error('Error saving word of the day:', error);
    throw new Error('Failed to save word of the day');
  }
};

// Get the saved word of the day
export const getWordOfTheDay = async (): Promise<{ word: Word, isSameDay: boolean } | null> => {
  try {
    const wordJSON = await AsyncStorage.getItem(WORD_OF_THE_DAY_KEY);
    if (!wordJSON) return null;
    
    const storedWord = JSON.parse(wordJSON);
    const today = new Date().toISOString().split('T')[0];
    const isSameDay = storedWord.date === today;
    
    return { word: storedWord, isSameDay };
  } catch (error) {
    console.error('Error getting word of the day:', error);
    return null;
  }
};