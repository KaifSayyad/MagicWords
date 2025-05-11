import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getNotificationSettings, saveNotificationSettings } from './StorageService';
import { NotificationSettings } from '@/types';

// Configure notification behavior
const configureNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

// Initialize notifications
export function initNotifications() {
  if (Platform.OS !== 'web') {
    configureNotifications();
    scheduleDailyNotification();
  }
}

// Request notification permissions
export async function requestPermissions(showPrompt = true): Promise<string> {
  if (Platform.OS === 'web') {
    return 'granted'; // Web doesn't need explicit permissions
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Only ask if permissions have not been determined or if we're explicitly showing the prompt
  if (existingStatus !== 'granted' && showPrompt) {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Update notification settings based on permission status
  const settings = await getNotificationSettings() || { enabled: false, time: null };
  if (finalStatus !== 'granted' && settings.enabled) {
    // If permissions were revoked, disable notifications in settings
    await saveNotificationSettings({ ...settings, enabled: false });
  }

  return finalStatus;
}

// Schedule the daily notification
export async function scheduleDailyNotification(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    // Check if we have permission to send notifications
    const permissionStatus = await requestPermissions(false);
    if (permissionStatus !== 'granted') {
      return;
    }

    // Get notification settings
    const settings = await getNotificationSettings();
    if (!settings || !settings.enabled || !settings.time) {
      return;
    }

    // Cancel any existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Parse the time
    const [hours, minutes] = settings.time.split(':').map(Number);

    // Calculate the trigger time for the notification
    const now = new Date();
    const triggerDate = new Date(now);
    triggerDate.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (triggerDate <= now) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    // Schedule the notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Word of the Day',
        body: 'Tap to learn a new word today!',
        data: { type: 'wordOfDay' },
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}

// Save notification time settings and schedule notifications
export async function saveNotificationTime(time: string): Promise<void> {
  try {
    // Get current settings
    const currentSettings = await getNotificationSettings() || { enabled: true, time: null };
    
    // Update settings
    const newSettings: NotificationSettings = {
      ...currentSettings,
      enabled: true,
      time,
    };
    
    // Save to storage
    await saveNotificationSettings(newSettings);
    
    // Schedule notification with new time
    await scheduleDailyNotification();
  } catch (error) {
    console.error('Error saving notification time:', error);
    throw new Error('Failed to save notification time');
  }
}

// Toggle notification enabled state
export async function toggleNotifications(enabled: boolean): Promise<void> {
  try {
    // If enabling, ensure we have permissions
    if (enabled) {
      const status = await requestPermissions(true);
      if (status !== 'granted') {
        throw new Error('Notification permissions not granted');
      }
    }
    
    // Get current settings
    const currentSettings = await getNotificationSettings() || { enabled: false, time: null };
    
    // Update settings
    const newSettings: NotificationSettings = {
      ...currentSettings,
      enabled,
    };
    
    // Save to storage
    await saveNotificationSettings(newSettings);
    
    if (enabled) {
      // Schedule notification if enabling
      await scheduleDailyNotification();
    } else {
      // Cancel all notifications if disabling
      if (Platform.OS !== 'web') {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    }
  } catch (error) {
    console.error('Error toggling notifications:', error);
    throw error;
  }
}