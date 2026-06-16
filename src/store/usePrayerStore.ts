import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export type PrayerEntry = {
  id: string;
  title: string;
  hours: number;
  topic: string;
  prayerPoints: string;
  scriptures: string;
  date: string; // ISO string e.g. "2024-01-15"
  timedSession: boolean;
};

export type PrayerTopic = {
  id: string;
  name: string;
  targetHours: number;
};

type Store = {
  entries: PrayerEntry[];
  topics: PrayerTopic[];
};

const STORAGE_KEY = 'prayer_journal_data';

const defaultStore: Store = {
  entries: [],
  topics: [],
};

// Save to device
export async function saveStore(data: Store) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Load from device
export async function loadStore(): Promise<Store> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultStore;
  return JSON.parse(raw);
}

// Add a new prayer entry
export async function addEntry(entry: Omit<PrayerEntry, 'id' | 'date'>) {
  const store = await loadStore();
  const newEntry: PrayerEntry = {
    ...entry,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
  };
  store.entries = [newEntry, ...store.entries];
  await saveStore(store);
  return newEntry;
}

// Add a new topic
export async function addTopic(name: string, targetHours: number) {
  const store = await loadStore();
  const newTopic: PrayerTopic = {
    id: Date.now().toString(),
    name,
    targetHours,
  };
  store.topics = [...store.topics, newTopic];
  await saveStore(store);
  return newTopic;
}

// Get total hours logged for a specific topic name
export function getTopicHours(entries: PrayerEntry[], topicName: string): number {
  return entries
    .filter(e => e.topic.toLowerCase() === topicName.toLowerCase())
    .reduce((sum, e) => sum + e.hours, 0);
}

// Hook to use in screens
export function usePrayerStore() {
  const [store, setStore] = useState<Store>(defaultStore);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const data = await loadStore();
    setStore(data);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  return { store, loading, refresh };
}
