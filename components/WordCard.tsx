import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Word } from '@/types';
import { theme } from '@/constants/theme';
import { Volume2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';

interface WordCardProps {
  word: Word;
  isCompact?: boolean;
}

const WordCard: React.FC<WordCardProps> = ({ word, isCompact = false }) => {
  // Function to play pronunciation audio
  const playAudio = () => {
    if (Platform.OS === 'web') {
      const audio = word.phonetics?.find(p => p.audio)?.audio;
      if (audio) {
        // Clean the URL if it starts with //
        const audioUrl = audio.startsWith('//') ? `https:${audio}` : audio;
        const sound = new Audio(audioUrl);
        sound.play().catch(err => console.error('Error playing audio:', err));
      }
    }
  };

  // Check if we have audio available
  const hasAudio = word.phonetics?.some(p => p.audio) && Platform.OS === 'web';

  // Get the main phonetic text
  const phoneticText = word.phonetic || word.phonetics?.find(p => p.text)?.text || '';

  // Get up to 2 meanings for compact view, all for full view
  const displayMeanings = isCompact 
    ? word.meanings.slice(0, 1) 
    : word.meanings;

  return (
    <View style={[styles.container, isCompact && styles.compactContainer]}>
      <LinearGradient
        colors={['rgba(255, 237, 213, 0.6)', 'rgba(255, 247, 237, 0.3)']}
        style={styles.cardBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.header}>
        <View style={styles.wordContainer}>
          <Text style={styles.word}>{word.word}</Text>
          {phoneticText && (
            <Text style={styles.phonetic}>{phoneticText}</Text>
          )}
        </View>
        
        {hasAudio && (
          <TouchableOpacity onPress={playAudio} style={styles.audioButton}>
            <Volume2 size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      
      {displayMeanings.map((meaning, index) => (
        <View key={index} style={styles.meaningContainer}>
          <Text style={styles.partOfSpeech}>{meaning.partOfSpeech}</Text>
          
          {meaning.definitions.slice(0, isCompact ? 1 : 2).map((definition, defIndex) => (
            <View key={defIndex} style={styles.definitionContainer}>
              <Text style={styles.definition}>{definition.definition}</Text>
              
              {definition.example && (
                <Text style={styles.example}>"{definition.example}"</Text>
              )}
            </View>
          ))}
          
          {meaning.definitions.length > (isCompact ? 1 : 2) && !isCompact && (
            <Text style={styles.more}>
              + {meaning.definitions.length - 2} more definitions
            </Text>
          )}
        </View>
      ))}
      
      {word.meanings.length > displayMeanings.length && (
        <Text style={styles.more}>
          + {word.meanings.length - displayMeanings.length} more meanings
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 20,
    position: 'relative',
  },
  compactContainer: {
    padding: 16,
  },
  cardBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(254, 215, 170, 0.5)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  wordContainer: {
    flex: 1,
  },
  word: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 4,
  },
  phonetic: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.textLight,
  },
  audioButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 237, 213, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  meaningContainer: {
    marginBottom: 16,
  },
  partOfSpeech: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  definitionContainer: {
    marginBottom: 12,
  },
  definition: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  example: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
  more: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 4,
  },
});

export default WordCard;