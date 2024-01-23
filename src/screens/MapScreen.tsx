import { Alert, Pressable, StyleSheet, Text, View } from "react-native"
import { CustomMap } from "../components/Map"
import { ActivityIndicator, Appbar, Button } from "react-native-paper"
import { PlaceList } from "../components/PlaceList"
import { useEffect, useState } from "react"
import { Place, Point } from "../model/Place"
import * as Location from 'expo-location'
import { NetworkError, googlePlacesApi } from "../services/GooglePlacesAPI"
import { MapScreenProps } from "./types"
import { AppHeader } from "../components/AppHeader"

export const MapScreen = ({navigation}: MapScreenProps) => {

    const [places, setPlaces] = useState<Array<Place>>([]);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [currentLocation, setCurrentLocation] = useState<Point | null>(null);
    const [error, setError] = useState<NetworkError | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const resolveLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error("Permission to access location was denied");
            return Promise.reject();
        }

        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
    }

    const fetchPlaces = async () => {
        try {
            const nearbyPlaces = await googlePlacesApi.findPlacesNear(currentLocation, 500.0, 10);
            setPlaces(nearbyPlaces);
            setError(null);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        async function updatePlaces() {
            if (!currentLocation) {
                await resolveLocation();
            } else {
                await fetchPlaces();
            }
        }
        updatePlaces();
    }, [currentLocation]);

    useEffect(() => {
        navigation.setOptions({
            header: (props) => (
                <AppHeader {...props} actions={[{icon: "crosshairs", onPress: resolveLocation}]} />
            )
        });
    })

    const emptyPlaceList = () => {
        if (isLoading) {
            return (
                <View style={styles.emptyList}>
                    <ActivityIndicator />
                </View>
            );
        }
        else if (error) {
            return (
                <View style={styles.emptyList}>
                    <Text style={styles.heading}>Network Error</Text>
                    <Text style={styles.subHeading}>{error.message}</Text>
                    <Button icon="refresh" mode="outlined" onPress={fetchPlaces}>Refresh</Button>
                </View>
            );
        } else {
            return (
                <View style={styles.emptyList}>
                    <Text style={styles.heading}>No pubs found nearby!</Text>
                    <Text style={styles.subHeading}>Try moving somewhere more exciting.</Text>
                </View>
            );
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.map}>
                {(currentLocation != null) ?
                    (<CustomMap location={currentLocation} places={places} selectedPlace={selectedPlace} onPlaceSelect={(place) => setSelectedPlace(place)} onLocationChange={(coordinate) => setCurrentLocation(coordinate)} />) :
                    (<ActivityIndicator />)
                }
            </View>
            { places.length === 0 ? emptyPlaceList() : <PlaceList places={places} selectedPlace={selectedPlace} onSelected={(place) => setSelectedPlace(place)} /> }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      height: '40%'
    },
    emptyList: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8
    },
    subHeading: {
        fontSize: 16,
        color: '#444',
        marginBottom: 16
    }
  });
  