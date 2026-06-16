import { StyleSheet, Text, View } from 'react-native';

export default function TopicsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>📖 Topics coming in next step</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', justifyContent: 'center', alignItems: 'center' },
  placeholder: { color: '#c9a84c', fontSize: 18 },
});
