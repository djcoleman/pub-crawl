import { useEffect, useState } from "react"
import * as Location from 'expo-location'
import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import { Place, Point } from "../model/Place";

export type MapProps = {
    location?: Point;
    places: Place[];
}

export const Map = ({location, places} : MapProps) => {
    const [currentLocation, setCurrentLocation] = useState<Point | null>(location);
    const [initialRegion, setInitialRegion] = useState(null);

    const resolveLocation = async () : Promise<Point | null> => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error("Permission to access location was denied");
            return Promise.reject();
        }

        const gpsLocation = await Location.getCurrentPositionAsync({});
        return gpsLocation.coords;
    } 

    useEffect(() => {
        const setLocation = async () => {
            if (!location) {
                location = await resolveLocation();
                setCurrentLocation(location);
            }

            setInitialRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            });
        }

        setLocation();
    }, []);

    const placeMarkers = places.map((place, index) => <Marker key={index} coordinate={place.location} title={place.displayName.text} />)
    return (
        <MapView style={styles.map} initialRegion={initialRegion}>
            <Marker key="currentLocation" coordinate={currentLocation} pinColor="gold" title="You are here"/>
            {placeMarkers}
        </MapView>
    )
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%'
    }
})