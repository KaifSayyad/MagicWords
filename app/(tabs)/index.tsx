import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Book as BookSaved, Calendar, ExternalLink, RefreshCw } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import { useWord } from '@/hooks/useWord';
import WordCard from '@/components/WordCard';
import { format } from 'date-fns';
import { theme } from '@/constants/theme';
import NotificationTimePicker from '@/components/NotificationTimePicker';
import { getNotificationSettings } from '@/services/NotificationService';
import AnimatedButton from '@/components/AnimatedButton';

export default function HomeScreen() {
  const { wordOfTheDay, isLoading, error, fetchTodayWord, saveWord, isWordSaved } = useWord();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [hasSetTime, setHasSetTime] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTodayWord();
    checkNotificationSettings();
  }, []);

  const checkNotificationSettings = async () => {
    const settings = await getNotificationSettings();
    setHasSetTime(!!settings?.time);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTodayWord();
    setRefreshing(false);
  };

  const handleOpenDictionary = async () => {
    if (wordOfTheDay?.word) {
      await WebBrowser.openBrowserAsync(`https://en.wiktionary.org/wiki/${wordOfTheDay.word}`);
    }
  };

  const handleSaveWord = () => {
    if (wordOfTheDay) {
      saveWord(wordOfTheDay);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[theme.colors.bgLight, theme.colors.bgDark]}
        style={styles.background}
      />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.dateContainer}>
            <Calendar size={18} color={theme.colors.primary} />
            <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>
          </View>
          <Text style={styles.title}>Word of the Day</Text>
          {!hasSetTime && (
            <TouchableOpacity 
              style={styles.notificationBanner}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.notificationText}>
                Set a time to receive daily word notifications
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <AnimatedButton onPress={fetchTodayWord} style={styles.retryButton}>
              <RefreshCw size={16} color={theme.colors.white} />
              <Text style={styles.retryText}>Try Again</Text>
            </AnimatedButton>
          </View>
        ) : wordOfTheDay ? (
          <View style={styles.wordContainer}>
            <WordCard word={wordOfTheDay} />
            <View style={styles.actionButtons}>
              <AnimatedButton 
                onPress={handleOpenDictionary}
                style={styles.dictionaryButton}
              >
                <ExternalLink size={16} color={theme.colors.white} />
                <Text style={styles.buttonText}>Open in Dictionary</Text>
              </AnimatedButton>
              <AnimatedButton 
                onPress={handleSaveWord}
                style={[
                  styles.saveButton,
                  isWordSaved(wordOfTheDay.word) && styles.savedButton
                ]}
              >
                <BookSaved 
                  size={16} 
                  color={isWordSaved(wordOfTheDay.word) ? theme.colors.white : theme.colors.primary} 
                />
                <Text 
                  style={[
                    styles.saveButtonText,
                    isWordSaved(wordOfTheDay.word) && styles.savedButtonText
                  ]}
                >
                  {isWordSaved(wordOfTheDay.word) ? 'Saved' : 'Save Word'}
                </Text>
              </AnimatedButton>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No word available. Pull down to refresh.</Text>
          </View>
        )}
      </ScrollView>
      {showTimePicker && (
        <NotificationTimePicker 
          onClose={() => setShowTimePicker(false)} 
          onSave={() => {
            setShowTimePicker(false);
            setHasSetTime(true);
          }}
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
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: theme.colors.text,
    marginBottom: 16,
  },
  notificationBanner: {
    backgroundColor: 'rgba(255, 247, 237, 0.7)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 8,
  },
  notificationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.white,
    marginLeft: 8,
  },
  wordContainer: {
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  dictionaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  savedButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.white,
    marginLeft: 8,
  },
  saveButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: 8,
  },
  savedButtonText: {
    color: theme.colors.white,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
  },
});