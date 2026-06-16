import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import 'react-native-gesture-handler';

import CalendarScreen from './screens/CalendarScreen';
import HomeScreen from './screens/HomeScreen';
import TopicsScreen from './screens/TopicsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#c9a84c',
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarStyle: { backgroundColor: '#1a1a2e', borderTopColor: '#c9a84c' },
          tabBarActiveTintColor: '#c9a84c',
          tabBarInactiveTintColor: '#888',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarIcon: () => <Text style={{fontSize:20}}>🏠</Text> }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{ tabBarIcon: () => <Text style={{fontSize:20}}>📅</Text> }}
        />
        <Tab.Screen
          name="Topics"
          component={TopicsScreen}
          options={{ tabBarIcon: () => <Text style={{fontSize:20}}>📖</Text> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
