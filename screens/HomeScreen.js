import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>

      {/* Greeting */}
      <View style={styles.greetingBox}>
        <Text style={styles.greetingText}>🙏 Good Morning</Text>
        <Text style={styles.dateText}>
          {new Date().toDateString()}
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Prayers{'\n'}Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Hours{'\n'}This Week</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Active{'\n'}Topics</Text>
        </View>
      </View>

      {/* Log Prayer Button */}
      <TouchableOpacity
        style={styles.logButton}
        onPress={() => navigation.navigate('Topics')}
      >
        <Text style={styles.logButtonText}>+ Log a Prayer</Text>
      </TouchableOpacity>

      {/* Recent Entries placeholder */}
      <Text style={styles.sectionTitle}>Recent Prayers</Text>
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>No prayers logged yet.{'\n'}Start by tapping "Log a Prayer" above.</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    padding: 16,
  },
  greetingBox: {
    marginBottom: 24,
    marginTop: 8,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#c9a84c',
  },
  dateText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c9a84c',
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
  },
  logButton: {
    backgroundColor: '#c9a84c',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 28,
  },
  logButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f0f1a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c9a84c',
    marginBottom: 12,
  },
  emptyBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
});
