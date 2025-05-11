import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Platform,
  TextInput
} from 'react-native';
import { theme } from '@/constants/theme';
import { X } from 'lucide-react-native';
import { saveNotificationTime } from '@/services/NotificationService';
import { getNotificationSettings } from '@/services/StorageService';
import AnimatedButton from './AnimatedButton';

interface NotificationTimePickerProps {
  onClose: () => void;
  onSave: () => void;
  initialTime?: string | null;
}

const NotificationTimePicker: React.FC<NotificationTimePickerProps> = ({ 
  onClose, 
  onSave,
  initialTime 
}) => {
  const [selectedTime, setSelectedTime] = useState<string>(initialTime || '09:00');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  useEffect(() => {
    if (initialTime) {
      setSelectedTime(initialTime);
      
      const [h, m] = initialTime.split(':');
      setHours(h);
      setMinutes(m);
    } else {
      loadDefaultTime();
    }
  }, [initialTime]);

  const loadDefaultTime = async () => {
    const settings = await getNotificationSettings();
    if (settings?.time) {
      setSelectedTime(settings.time);
      
      const [h, m] = settings.time.split(':');
      setHours(h);
      setMinutes(m);
    } else {
      // Default to 9:00 AM
      setSelectedTime('09:00');
      setHours('09');
      setMinutes('00');
    }
  };

  const handleSave = async () => {
    // Format the time correctly
    const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    
    try {
      await saveNotificationTime(formattedTime);
      onSave();
    } catch (error) {
      console.error('Error saving notification time:', error);
    }
  };

  const handleHoursChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.length <= 2) {
      const hour = parseInt(numericValue || '0');
      if (hour >= 0 && hour <= 23) {
        setHours(numericValue);
      }
    }
  };

  const handleMinutesChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.length <= 2) {
      const minute = parseInt(numericValue || '0');
      if (minute >= 0 && minute <= 59) {
        setMinutes(numericValue);
      }
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Set Notification Time</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={20} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.description}>
                Choose a time to receive your daily word notification:
              </Text>
              
              <View style={styles.timeInputContainer}>
                <View style={styles.timeInput}>
                  <TextInput
                    style={styles.input}
                    value={hours}
                    onChangeText={handleHoursChange}
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholder="09"
                  />
                  <Text style={styles.timeLabel}>Hours</Text>
                </View>
                
                <Text style={styles.timeSeparator}>:</Text>
                
                <View style={styles.timeInput}>
                  <TextInput
                    style={styles.input}
                    value={minutes}
                    onChangeText={handleMinutesChange}
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholder="00"
                  />
                  <Text style={styles.timeLabel}>Minutes</Text>
                </View>
              </View>
              
              <Text style={styles.timeHint}>24-hour format (00-23 : 00-59)</Text>

              <View style={styles.buttonContainer}>
                <AnimatedButton 
                  onPress={handleSave} 
                  style={styles.saveButton}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </AnimatedButton>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    ...theme.shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: theme.colors.text,
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 24,
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeInput: {
    alignItems: 'center',
  },
  input: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: theme.colors.text,
    textAlign: 'center',
    width: 80,
    padding: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
  },
  timeLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  timeSeparator: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: theme.colors.text,
    marginHorizontal: 12,
  },
  timeHint: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 150,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.white,
  },
});

export default NotificationTimePicker;