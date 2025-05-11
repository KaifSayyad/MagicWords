import { Tabs } from 'expo-router';
import { Chrome as Home, Book as BookSaved, Settings } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          position: 'absolute',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarBackground: () => (
          <View style={styles.tabBarBackground}>
            <LinearGradient
              colors={['rgba(255, 247, 237, 0.95)', 'rgba(254, 215, 170, 0.95)']}
              style={styles.gradient}
            />
          </View>
        ),
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size }) => <BookSaved size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  gradient: {
    height: '100%',
    width: '100%',
  },
});