import { addEntry } from '@/store/usePrayerStore';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type Mode = 'manual' | 'timer';
type TimerState = 'idle' | 'running' | 'paused';

export default function LogPrayerScreen() {
  const router = useRouter();

  // Mode toggle
  const [mode, setMode] = useState<Mode>('manual');

  // Manual form fields
  const [title, setTitle] = useState('');
  const [hours, setHours] = useState('');
  const [topic, setTopic] = useState('');
  const [prayerPoints, setPrayerPoints] = useState('');
  const [scriptures, setScriptures] = useState('');

  // Timer fields
  const [timerTitle, setTimerTitle] = useState('');
  const [timerTopic, setTimerTopic] = useState('');
  const [timerPrayerPoints, setTimerPrayerPoints] = useState('');
  const [timerScriptures, setTimerScriptures] = useState('');
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [elapsed, setElapsed] = useState(0); // in seconds
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer logic
  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleStart = () => setTimerState('running');
  const handlePause = () => setTimerState('paused');
  const handleResume = () => setTimerState('running');

  const handleFinish = async () => {
    setTimerState('idle');
    const hoursLogged = parseFloat((elapsed / 3600).toFixed(2));
    await addEntry({
      title: timerTitle || 'Timer Prayer',
      hours: hoursLogged,
      topic: timerTopic,
      prayerPoints: timerPrayerPoints,
      scriptures: timerScriptures,
      timedSession: true,
    });
    Alert.alert(
      '🙏 Prayer Saved!',
      `"${timerTopic || timerTitle || 'Prayer'}" — ${formatTime(elapsed)} logged (${hoursLogged} hrs)`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleManualSave = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a prayer title.');
      return;
    }
    if (!hours.trim()) {
      Alert.alert('Missing Hours', 'Please enter the hours spent.');
      return;
    }
    await addEntry({
      title,
      hours: parseFloat(hours),
      topic,
      prayerPoints,
      scriptures,
      timedSession: false,
    });
    Alert.alert(
      '🙏 Prayer Saved!',
      `"${title}" — ${hours} hrs logged`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

      <Text style={styles.heading}>🙏 Log a Prayer</Text>

      {/* Mode Toggle */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'manual' && styles.modeBtnActive]}
          onPress={() => setMode('manual')}
        >
          <Text style={[styles.modeBtnText, mode === 'manual' && styles.modeBtnTextActive]}>
            ✍️ Manual Entry
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'timer' && styles.modeBtnActive]}
          onPress={() => setMode('timer')}
        >
          <Text style={[styles.modeBtnText, mode === 'timer' && styles.modeBtnTextActive]}>
            ⏱️ Use Timer
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── MANUAL MODE ── */}
      {mode === 'manual' && (
        <View>
          <Text style={styles.label}>Prayer Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Morning intercession"
            placeholderTextColor="#555"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Hours Spent *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 1.5"
            placeholderTextColor="#555"
            keyboardType="numeric"
            value={hours}
            onChangeText={setHours}
          />

          <Text style={styles.label}>Topic (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Quick Understanding, Family..."
            placeholderTextColor="#555"
            value={topic}
            onChangeText={setTopic}
          />

          <Text style={styles.label}>Prayer Points</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Write your prayer points here..."
            placeholderTextColor="#555"
            multiline
            numberOfLines={5}
            value={prayerPoints}
            onChangeText={setPrayerPoints}
          />

          <Text style={styles.label}>Scriptures</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="e.g. Philippians 4:6, Psalm 91..."
            placeholderTextColor="#555"
            multiline
            numberOfLines={3}
            value={scriptures}
            onChangeText={setScriptures}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleManualSave}>
            <Text style={styles.saveButtonText}>Save Prayer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── TIMER MODE ── */}
      {mode === 'timer' && (
        <View>

          {/* Timer Display */}
          <View style={styles.timerBox}>
            <Text style={styles.timerClock}>{formatTime(elapsed)}</Text>
            <Text style={styles.timerStatus}>
              {timerState === 'idle' && elapsed === 0 && 'Ready to start'}
              {timerState === 'idle' && elapsed > 0 && 'Finished'}
              {timerState === 'running' && '● Recording...'}
              {timerState === 'paused' && '⏸ Paused'}
            </Text>
          </View>

          {/* Timer Controls */}
          <View style={styles.timerControls}>
            {timerState === 'idle' && elapsed === 0 && (
              <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
                <Text style={styles.timerBtnText}>▶ Start</Text>
              </TouchableOpacity>
            )}
            {timerState === 'running' && (
              <>
                <TouchableOpacity style={styles.pauseBtn} onPress={handlePause}>
                  <Text style={styles.timerBtnText}>⏸ Pause</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
                  <Text style={styles.timerBtnText}>✓ Finish</Text>
                </TouchableOpacity>
              </>
            )}
            {timerState === 'paused' && (
              <>
                <TouchableOpacity style={styles.startBtn} onPress={handleResume}>
                  <Text style={styles.timerBtnText}>▶ Resume</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
                  <Text style={styles.timerBtnText}>✓ Finish</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Timer Form Fields */}
          <Text style={styles.label}>Prayer Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Morning intercession"
            placeholderTextColor="#555"
            value={timerTitle}
            onChangeText={setTimerTitle}
          />

          <Text style={styles.label}>Topic</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Quick Understanding, Family..."
            placeholderTextColor="#555"
            value={timerTopic}
            onChangeText={setTimerTopic}
          />

          <Text style={styles.label}>Prayer Points</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Write your prayer points here..."
            placeholderTextColor="#555"
            multiline
            numberOfLines={5}
            value={timerPrayerPoints}
            onChangeText={setTimerPrayerPoints}
          />

          <Text style={styles.label}>Scriptures</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="e.g. Philippians 4:6, Psalm 91..."
            placeholderTextColor="#555"
            multiline
            numberOfLines={3}
            value={timerScriptures}
            onChangeText={setTimerScriptures}
          />

          {timerState !== 'idle' || elapsed > 0 ? (
            <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
              <Text style={styles.timerBtnText}>✓ Finish & Save</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

        </View>
      )}

      <View style={{ height: 60 }} />
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
    marginBottom: 20,
    marginTop: 8,
  },

  // Mode Toggle
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: '#c9a84c',
  },
  modeBtnText: {
    color: '#888',
    fontWeight: '600',
    fontSize: 14,
  },
  modeBtnTextActive: {
    color: '#0f0f1a',
  },

  // Form
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c9a84c',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    color: '#fff',
    padding: 12,
    fontSize: 15,
  },
  multiline: {
    height: 120,
    textAlignVertical: 'top',
  },

  // Timer
  timerBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
    marginBottom: 16,
  },
  timerClock: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#c9a84c',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  timerStatus: {
    marginTop: 8,
    color: '#888',
    fontSize: 14,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  startBtn: {
    flex: 1,
    backgroundColor: '#2e7d32',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  pauseBtn: {
    flex: 1,
    backgroundColor: '#b8860b',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  finishBtn: {
    flex: 1,
    backgroundColor: '#c9a84c',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 28,
  },
  timerBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  // Bottom buttons
  saveButton: {
    backgroundColor: '#c9a84c',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f0f1a',
  },
  cancelButton: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  cancelButtonText: {
    fontSize: 15,
    color: '#888',
  },
});

