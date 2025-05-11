import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Trash2 } from 'lucide-react-native';
import { useWord } from '@/hooks/useWord';
import { theme } from '@/constants/theme';
import WordCard from '@/components/WordCard';
import AnimatedButton from '@/components/AnimatedButton';

export default function SavedScreen() {
  const { savedWords, removeWord } = useWord();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[theme.colors.bgLight, theme.colors.bgDark]}
        style={styles.background}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Saved Words</Text>
      </View>
      
      {savedWords.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You haven't saved any words yet.
          </Text>
          <Text style={styles.emptySubtext}>
            Words you save will appear here for future reference.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedWords}
          keyExtractor={(item) => item.word}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.wordContainer}>
              <WordCard word={item} isCompact />
              <AnimatedButton 
                onPress={() => removeWord(item.word)}
                style={styles.removeButton}
              >
                <Trash2 size={16} color={theme.colors.error} />
                <Text style={styles.removeText}>Remove</Text>
              </AnimatedButton>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: theme.colors.text,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  wordContainer: {
    marginBottom: 16,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(254, 226, 226, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  removeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.error,
    marginLeft: 8,
  },
  separator: {
    height: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});