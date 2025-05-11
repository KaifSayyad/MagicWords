export interface Word {
  word: string;
  phonetic?: string;
  phonetics?: Phonetic[];
  origin?: string;
  meanings: Meaning[];
  fetchDate?: string; // Date when the word was fetched
}

interface Phonetic {
  text?: string;
  audio?: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface NotificationSettings {
  enabled: boolean;
  time: string | null; // Format: "HH:MM" (24-hour)
}