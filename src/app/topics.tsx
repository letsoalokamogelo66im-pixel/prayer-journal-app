import {
    addTopic, getTopicHours,
    loadStore,
    PrayerEntry,
    PrayerTopic
} from '@/store/usePrayerStore';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

function TopicCard({ topic, entries }: { topic: PrayerTopic; entries: PrayerEntry[] }) {
  const logged = getTopicHours(entries, topic.name);
  const percentage = Math.min(Math.round((logged / topic.targetHours) * 100), 100);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{topic.name}</Text>
        <Text style={styles.cardPercent}>{percentage}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percentage}%` as any }]} />
      </View>
      <Text style={styles.cardStats}>
        {logged.toFixed(1)} hrs / {topic.targetHours} hrs target
      </Text>
    </View>
  );
}

export default function TopicsScreen() {
  const [topics, setTopics] = useState<PrayerTopic[]>([]);
  const [entries, setEntries] = useState<PrayerEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadStore().then(data => {
        setTopics(data.topics);
        setEntries(data.entries);
      });
    }, [])
  );

  const handleAddTopic = async () => {
    if (!newName.trim()) {
      Alert.alert('Missing Name', 'Please enter a topic name.');
      return;
    }
    if (!newTarget.trim() || isNaN(parseFloat(newTarget))) {
      Alert.alert('Missing Target', 'Please enter a valid target in hours.');
      return;
    }
    await addTopic(newName.trim(), parseFloat(newTarget));
    const data = await loadStore();
    setTopics(data.topics);
    setNewName('');
    setNewTarget('');
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>

      <View style={styles.headerRow}>
        <Text style={styles.heading}>📖 Prayer Topics</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ New Topic</Text>
        </TouchableOpacity>
      </View>

      {topics.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            No topics yet.{'\n'}Tap "+ New Topic" to create one.
          </Text>
        </View>
      ) : (
        topics.map(topic => (
          <TopicCard key={topic.id} topic={topic} entries={entries} />
        ))
      )}

      {/* Add Topic Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>New Prayer Topic</Text>

            <Text style={styles.label}>Topic Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Quick Understanding"
              placeholderTextColor="#555"
              value={newName}
              onChangeText={setNewName}
            />

            <Text style={styles.label}>Target Hours</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 100"
              placeholderTextColor="#555"
              keyboardType="numeric"
              value={newTarget}
              onChangeText={setNewTarget}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleAddTopic}>
              <Text style={styles.saveBtnText}>Create Topic</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 16 },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20, marginTop: 8,
  },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#c9a84c' },
  addBtn: {
    backgroundColor: '#c9a84c', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  addBtnText: { color: '#0f0f1a', fontWeight: 'bold', fontSize: 13 },
  card: {
    backgroundColor: '#1a1a2e', borderRadius: 14, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: '#2a2a4a',
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', flex: 1 },
  cardPercent: { fontSize: 18, fontWeight: 'bold', color: '#c9a84c' },
  progressTrack: {
    height: 8, backgroundColor: '#2a2a4a',
    borderRadius: 4, overflow: 'hidden', marginBottom: 8,
  },
  progressFill: { height: '100%', backgroundColor: '#c9a84c', borderRadius: 4 },
  cardStats: { fontSize: 12, color: '#888' },
  emptyBox: {
    backgroundColor: '#1a1a2e', borderRadius: 12, padding: 32,
    alignItems: 'center', borderWidth: 1, borderColor: '#2a2a4a',
  },
  emptyText: { color: '#888', textAlign: 'center', lineHeight: 22 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#1a1a2e', borderTopLeftRadius: 20,
    borderTopRightRadius: 20, padding: 24,
    borderTopWidth: 1, borderColor: '#2a2a4a',
  },
  modalTitle: {
    fontSize: 18, fontWeight: 'bold',
    color: '#c9a84c', marginBottom: 16,
  },
  label: { fontSize: 14, fontWeight: '600', color: '#c9a84c', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#0f0f1a', borderRadius: 10,
    borderWidth: 1, borderColor: '#2a2a4a',
    color: '#fff', padding: 12, fontSize: 15,
  },
  saveBtn: {
    backgroundColor: '#c9a84c', borderRadius: 12,
    padding: 14, alignItems: 'center', marginTop: 20,
  },
  saveBtnText: { fontSize: 15, fontWeight: 'bold', color: '#0f0f1a' },
  cancelBtn: { padding: 14, alignItems: 'center' },
  cancelBtnText: { color: '#888', fontSize: 14 },
});
