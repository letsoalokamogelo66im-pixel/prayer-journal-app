import { loadStore, PrayerEntry } from '@/store/usePrayerStore';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<PrayerEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Reload when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadStore().then((data: Awaited<ReturnType<typeof loadStore>>) => setEntries(data.entries));
    }, [])
  );

  // Build marked dates from entries
  const markedDates = entries.reduce((acc, entry) => {
    acc[entry.date] = {
      marked: true,
      dotColor: '#c9a84c',
      ...(entry.date === selectedDate && {
        selected: true,
        selectedColor: '#c9a84c',
      }),
    };
    return acc;
  }, {} as Record<string, any>);

  // Also mark selected date even if no entries
  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: '#c9a84c',
    };
  }

  // Get entries for selected day
  const selectedEntries = entries.filter(e => e.date === selectedDate);

  // Total hours for selected day
  const selectedHours = selectedEntries.reduce((sum, e) => sum + e.hours, 0);

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.heading}>📅 Prayer Calendar</Text>

      {/* Calendar */}
      <Calendar
        onDayPress={(day: any) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#0f0f1a',
          calendarBackground: '#1a1a2e',
          textSectionTitleColor: '#c9a84c',
          selectedDayBackgroundColor: '#c9a84c',
          selectedDayTextColor: '#0f0f1a',
          todayTextColor: '#c9a84c',
          dayTextColor: '#ffffff',
          textDisabledColor: '#444',
          dotColor: '#c9a84c',
          selectedDotColor: '#0f0f1a',
          arrowColor: '#c9a84c',
          monthTextColor: '#c9a84c',
          indicatorColor: '#c9a84c',
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 13,
        }}
        style={styles.calendar}
      />

      {/* Selected Day Panel */}
      {selectedDate ? (
        <View style={styles.dayPanel}>

          <View style={styles.dayPanelHeader}>
            <View>
              <Text style={styles.dayPanelDate}>
                {new Date(selectedDate + 'T00:00:00').toDateString()}
              </Text>
              {selectedEntries.length > 0 && (
                <Text style={styles.dayPanelHours}>
                  {selectedHours.toFixed(1)} hrs prayed
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => router.push('/log-prayer')}
            >
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {/* Entries for selected day */}
          {selectedEntries.length === 0 ? (
            <View style={styles.emptyDay}>
              <Text style={styles.emptyDayText}>
                No prayers logged for this day.{'\n'}
                Tap "+ Add" to log one.
              </Text>
            </View>
          ) : (
            selectedEntries.map(entry => (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                  <Text style={styles.entryHours}>{entry.hours}h</Text>
                </View>
                {entry.topic ? (
                  <Text style={styles.entryTopic}>📖 {entry.topic}</Text>
                ) : null}
                {entry.prayerPoints ? (
                  <Text style={styles.entryPoints} numberOfLines={2}>
                    🙏 {entry.prayerPoints}
                  </Text>
                ) : null}
                {entry.scriptures ? (
                  <Text style={styles.entryScripture} numberOfLines={1}>
                    📜 {entry.scriptures}
                  </Text>
                ) : null}
                <Text style={styles.entryBadge}>
                  {entry.timedSession ? '⏱ Timer session' : '✍️ Manual entry'}
                </Text>
              </View>
            ))
          )}
        </View>
      ) : (
        <View style={styles.noSelectionBox}>
          <Text style={styles.noSelectionText}>
            Tap a day on the calendar to see{'\n'}or add prayers for that day.
          </Text>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c9a84c',
    marginBottom: 16,
    marginTop: 8,
  },
  calendar: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
  },

  // Day Panel
  dayPanel: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  dayPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  dayPanelDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  dayPanelHours: {
    fontSize: 12,
    color: '#c9a84c',
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: '#c9a84c',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addBtnText: {
    color: '#0f0f1a',
    fontWeight: 'bold',
    fontSize: 13,
  },

  // Empty day
  emptyDay: {
    padding: 24,
    alignItems: 'center',
  },
  emptyDayText: {
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Entry cards
  entryCard: {
    backgroundColor: '#0f0f1a',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  entryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  entryHours: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#c9a84c',
  },
  entryTopic: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  entryPoints: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
    lineHeight: 18,
  },
  entryScripture: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
    fontStyle: 'italic',
  },
  entryBadge: {
    fontSize: 11,
    color: '#555',
    marginTop: 6,
  },

  // No selection
  noSelectionBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  noSelectionText: {
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
});
