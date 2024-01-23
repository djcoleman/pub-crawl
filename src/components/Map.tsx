import { useEffect, useRef, useState } from "react"
import MapView, { Marker, Region } from "react-native-maps";
import { StyleSheet } from "react-native";
import { Place, Point } from "../model/Place";

export type MapProps = {
    location?: Point;
    places: Place[];
    selectedPlace: Place | null;
    onPlaceSelect: (place: Place) => void;
    onLocationChange: (point: Point) => void;
}

export const CustomMap = ({location, places, selectedPlace, onPlaceSelect, onLocationChange} : MapProps) => {
    const mapRef = useRef<MapView | null>(null);
    const markerRefs = useRef({});
    const [initialRegion, setInitialRegion] = useState<Region| null>(null);
    const [currentRegion, setCurrentRegion] = useState<Region | null>(null);

    useEffect(() => {
        const setLocation = async () => {

            const region = {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }
            setInitialRegion(region);
            setCurrentRegion(region);
            mapRef.current.animateToRegion(region);
        }

        setLocation();

    }, [location]);

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
        <MapView style={styles.map} initialRegion={initialRegion} ref={mapRef} onRegionChangeComplete={handleRegionChangeComplete} onLongPress={(event) => onLocationChange(event.nativeEvent.coordinate)}>
            <Marker key="currentLocation" coordinate={location} pinColor="gold" title="You are here" />
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