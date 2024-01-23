import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { MapScreen } from './src/screens/MapScreen';
import { DetailsScreen } from './src/screens/DetailsScreen';
import { RootStackParamList } from './src/screens/types';
import { AppHeader } from './src/components/AppHeader';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider>
        <NavigationContainer>
          <RootStack.Navigator initialRouteName='Home' screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
            <RootStack.Screen name='Home' component={MapScreen} options={{ title: "Pub Crawl" }} />
            <RootStack.Screen name='Details' component={DetailsScreen} />
          </RootStack.Navigator>
        </NavigationContainer>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
