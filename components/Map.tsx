import { useEffect, useRef, useState } from "react"
import * as Location from 'expo-location'
import MapView, { Marker, Region } from "react-native-maps";
import { StyleSheet } from "react-native";
import { Place, Point } from "../model/Place";

export type MapProps = {
    location?: Point;
    places: Place[];
    selectedPlace: Place | null;
    onPlaceSelect: (place: Place) => void;
}

export const CustomMap = ({location, places, selectedPlace, onPlaceSelect} : MapProps) => {
    const mapRef = useRef<MapView | null>(null);
    const markerRefs = useRef({});
    const [initialRegion, setInitialRegion] = useState<Region| null>(null);
    const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
    const [currentLocation, setCurrentLocation] = useState<Point | null>(location);

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

            const region = {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }
            setInitialRegion(region);
            setCurrentRegion(region);
        }

        setLocation();

    }, []);

    useEffect(() => {
        if (selectedPlace !== null && markerRefs.current[selectedPlace.id]) {

            const markerRef = markerRefs.current[selectedPlace.id]
            markerRef.showCallout();
            const region : Region = { 
                latitude: selectedPlace.location.latitude,
                longitude: selectedPlace.location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            };
            mapRef.current.animateToRegion(region);

        }
    }, [selectedPlace])

    const handleRegionChangeComplete = (region : Region) => {
        setCurrentRegion(region);
    }

    const placeMarkers = places.map((place, index) => (
        <Marker key={index} 
            coordinate={place.location} 
            title={place.displayName.text} 
            identifier={place.id} 
            onPress={() => onPlaceSelect(place)}
            ref={(ref) => {
                if (ref) {
                    markerRefs.current[place.id] = ref;
                }
            }}
        />)
    );

    return (
        <MapView style={styles.map} initialRegion={initialRegion} ref={mapRef} onRegionChangeComplete={handleRegionChangeComplete}>
            <Marker key="currentLocation" coordinate={currentLocation} pinColor="gold" title="You are here" />
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