import { StyleSheet, View } from "react-native"
import { CustomMap } from "../components/Map"
import { ActivityIndicator, Appbar } from "react-native-paper"
import { PlaceList } from "../components/PlaceList"
import { useEffect, useState } from "react"
import { Place, Point } from "../model/Place"
import * as Location from 'expo-location'
import { googlePlacesApi } from "../services/GooglePlacesAPI"
import { MapScreenProps } from "./types"
import { AppHeader } from "../components/AppHeader"

export const MapScreen = ({navigation}: MapScreenProps) => {

    const [places, setPlaces] = useState<Array<Place>>([]);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [currentLocation, setCurrentLocation] = useState<Point | null>(null);

    const resolveLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error("Permission to access location was denied");
            return Promise.reject();
        }

        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
    }

    useEffect(() => {
        async function fetchPlaces() {
            if (!currentLocation) {
                await resolveLocation();
            } else {
                setPlaces(await googlePlacesApi.findPlacesNear(currentLocation, 500.0, 10));
            }
        }
        fetchPlaces();
    }, [currentLocation]);

    useEffect(() => {
        console.log("Adding custom action to Map header");
        navigation.setOptions({
            header: (props) => (
                <AppHeader {...props} actions={[{icon: "crosshairs", onPress: resolveLocation}]} />
            )
        });
    })

    return (
        <View style={styles.container}>
            <View style={styles.map}>
                {(currentLocation != null) ?
                    (<CustomMap location={currentLocation} places={places} selectedPlace={selectedPlace} onPlaceSelect={(place) => setSelectedPlace(place)} onLocationChange={(coordinate) => setCurrentLocation(coordinate)} />) :
                    (<ActivityIndicator />)
                }
            </View>
            <PlaceList places={places} selectedPlace={selectedPlace} onSelected={(place) => setSelectedPlace(place)} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      height: '40%'
    }
  });
  