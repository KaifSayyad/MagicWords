import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Clock, Info } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import NotificationTimePicker from '@/components/NotificationTimePicker';
import { getNotificationSettings, requestPermissions } from '@/services/NotificationService';
import { format } from 'date-fns';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await getNotificationSettings();
    setNotificationsEnabled(!!settings?.enabled);
    if (settings?.time) {
      setNotificationTime(settings.time);
    }
    
    if (Platform.OS !== 'web') {
      const status = await requestPermissions(false);
      setPermissionStatus(status);
    }
  };

  const handleOpenSettings = () => {
    if (Platform.OS !== 'web') {
      Linking.openSettings();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[theme.colors.bgLight, theme.colors.bgDark]}
        style={styles.background}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.setting}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={theme.colors.text} />
              <Text style={styles.settingText}>Daily Word Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={async (value) => {
                if (value && permissionStatus !== 'granted') {
                  const status = await requestPermissions(true);
                  setPermissionStatus(status);
                  setNotificationsEnabled(status === 'granted');
                  if (status !== 'granted') {
                    return;
                  }
                } else {
                  setNotificationsEnabled(value);
                }
              }}
              trackColor={{ false: '#d1d5db', true: theme.colors.primaryLight }}
              thumbColor={notificationsEnabled ? theme.colors.primary : '#f4f4f5'}
            />
          </View>
          
          {permissionStatus === 'denied' && Platform.OS !== 'web' && (
            <TouchableOpacity 
              style={styles.permissionWarning}
              onPress={handleOpenSettings}
            >
              <Info size={16} color={theme.colors.warning} />
              <Text style={styles.permissionText}>
                Notifications are disabled. Tap here to open settings and enable them.
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              styles.setting, 
              !notificationsEnabled && styles.settingDisabled
            ]}
            onPress={() => {
              if (notificationsEnabled) {
                setShowTimePicker(true);
              }
            }}
            disabled={!notificationsEnabled}
          >
            <View style={styles.settingLeft}>
              <Clock size={20} color={notificationsEnabled ? theme.colors.text : theme.colors.muted} />
              <Text style={[
                styles.settingText,
                !notificationsEnabled && styles.settingTextDisabled
              ]}>
                Notification Time
              </Text>
            </View>
            <Text style={[
              styles.timeText,
              !notificationsEnabled && styles.settingTextDisabled
            ]}>
              {notificationTime ? format(new Date(`2000-01-01T${notificationTime}`), 'h:mm a') : 'Not set'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutContainer}>
            <Text style={styles.appName}>Word of the Day</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              Expand your vocabulary with a new word every day.
            </Text>
          </View>
        </View>
      </View>
      
      {showTimePicker && (
        <NotificationTimePicker 
          onClose={() => setShowTimePicker(false)} 
          onSave={() => {
            setShowTimePicker(false);
            loadSettings(); // Refresh the time display
          }}
          initialTime={notificationTime}
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
  content: {
    padding: 16,
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingDisabled: {
    opacity: 0.6,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 12,
  },
  settingTextDisabled: {
    color: theme.colors.muted,
  },
  timeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.primary,
  },
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(254, 240, 138, 0.3)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  permissionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.warning,
    marginLeft: 8,
    flex: 1,
  },
  aboutContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: theme.colors.text,
  },
  appVersion: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 16,
  },
  appDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});