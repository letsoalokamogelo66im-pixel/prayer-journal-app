import { loadStore, PrayerEntry } from '@/store/usePrayerStore';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<PrayerEntry[]>([]);

  // Reload every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadStore().then(data => setEntries(data.entries));
    }, [])
  );

  const today = new Date().toISOString().split('T')[0];
  const todayEntries = entries.filter(e => e.date === today);
  const todayPrayers = todayEntries.length;
  const weekHours = entries
    .filter(e => {
      const diff = (Date.now() - new Date(e.date).getTime()) / 86400000;
      return diff <= 7;
    })
    .reduce((sum, e) => sum + e.hours, 0);

  return (
    <ScrollView style={styles.container}>

      <View style={styles.greetingBox}>
        <Text style={styles.greetingText}>🙏 Good Morning</Text>
        <Text style={styles.dateText}>{new Date().toDateString()}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{todayPrayers}</Text>
          <Text style={styles.statLabel}>Prayers{'\n'}Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{weekHours.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Hours{'\n'}This Week</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{entries.length}</Text>
          <Text style={styles.statLabel}>Total{'\n'}Entries</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logButton}
        onPress={() => router.push('/log-prayer')}
      >
        <Text style={styles.logButtonText}>+ Log a Prayer</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recent Prayers</Text>

      {entries.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            No prayers logged yet.{'\n'}Tap "Log a Prayer" above to get started.
          </Text>
        </View>
      ) : (
        entries.slice(0, 5).map(entry => (
          <View key={entry.id} style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryTitle}>{entry.title}</Text>
              <Text style={styles.entryHours}>{entry.hours}h</Text>
            </View>
            {entry.topic ? (
              <Text style={styles.entryTopic}>📖 {entry.topic}</Text>
            ) : null}
            <Text style={styles.entryDate}>{entry.date}</Text>
          </View>
        ))
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 16 },
  greetingBox: { marginBottom: 24, marginTop: 12 },
  greetingText: { fontSize: 26, fontWeight: 'bold', color: '#c9a84c' },
  dateText: { fontSize: 14, color: '#888', marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: '#1a1a2e', borderRadius: 12,
    padding: 16, marginHorizontal: 4, alignItems: 'center',
    borderWidth: 1, borderColor: '#2a2a4a',
  },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#c9a84c' },
  statLabel: { fontSize: 11, color: '#888', textAlign: 'center', marginTop: 4 },
  logButton: {
    backgroundColor: '#c9a84c', borderRadius: 12,
    padding: 16, alignItems: 'center', marginBottom: 28,
  },
  logButtonText: { fontSize: 16, fontWeight: 'bold', color: '#0f0f1a' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#c9a84c', marginBottom: 12 },
  emptyBox: {
    backgroundColor: '#1a1a2e', borderRadius: 12, padding: 32,
    alignItems: 'center', borderWidth: 1, borderColor: '#2a2a4a',
  },
  emptyText: { color: '#888', textAlign: 'center', lineHeight: 22 },
  entryCard: {
    backgroundColor: '#1a1a2e', borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#2a2a4a',
  },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  entryTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff', flex: 1 },
  entryHours: { fontSize: 15, fontWeight: 'bold', color: '#c9a84c' },
  entryTopic: { fontSize: 12, color: '#888', marginTop: 4 },
  entryDate: { fontSize: 11, color: '#555', marginTop: 4 },
});
