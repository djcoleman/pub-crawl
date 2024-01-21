import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import { Appbar, PaperProvider } from 'react-native-paper';
import { Map } from './components/Map';
import { useEffect, useState } from 'react';
import { Place, Point } from './model/Place';
import { PlaceList } from './components/PlaceList';
import { googlePlacesApi } from './services/GooglePlacesAPI';

export default function App() {
  const [places, setPlaces] = useState<Array<Place>>([]);
  const location : Point = { latitude: 54.97404, longitude: -1.59210 };

  useEffect(() => {
    async function fetchPlaces() {
      setPlaces(await googlePlacesApi.findPlacesNear(location, 500.0, 10));
    }
    fetchPlaces();
  }, []);
  
  return (
    <PaperProvider>
        <Appbar.Header>
          <Appbar.Content title={process.env.EXPO_PUBLIC_APP_TITLE} />
        </Appbar.Header>
        <View style={styles.container}>
          <View style={styles.map}>
            <Map location={location} places={places}/>
          </View>
          <PlaceList places={places} />
        </View>
        <StatusBar style="auto" />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: '40%'
  }
});
