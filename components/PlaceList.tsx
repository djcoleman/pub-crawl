import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Photo, Place } from "../model/Place";
import { Card } from "react-native-paper";
import { useEffect, useRef, useState } from "react";
import { googlePlacesApi } from "../services/GooglePlacesAPI";

type RatingProps = {
    rating : number;
}
const Rating = ({ rating } : RatingProps) => {
    const roundedRating = Math.round(rating);
    const stars = "⭐".repeat(roundedRating);

    return <Text style={styles.rating}>{stars}</Text>;
}

type PhotoProps = {
    photo : Photo;
}

const placeholderImage = require('../assets/location-placeholder.jpeg');

const PhotoView = ({photo} : PhotoProps) => {
    const [source, setSource] = useState("");

    useEffect(() => {
        async function fetchPhoto(name: string) {
            const url = await googlePlacesApi.getPlacePhoto(name, 100);
            setSource(url);
        }

        fetchPhoto(photo.name);
    }, []);

    const imageSource = source === "" ? placeholderImage : {uri: source};
    return <Image source={imageSource} style={{ width: 50, height: 'auto', borderRadius: 8}}></Image>
}

type PlaceListItemProps = {
    place: Place;
    index: number;
    selected: boolean;
    onPress: () => void;
}
const PlaceListItem = ({ place, index, selected, onPress }: PlaceListItemProps) => {
    return (
        <Card onPress={onPress} style={selected ? styles.placeSelected : {}} >
            <Card.Content>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <PhotoView photo={place.photos[0]} />
                    <View style={{flex: 1}}>
                        <Text numberOfLines={1} style={styles.placeTitle}>{place.displayName.text}</Text>
                        <Rating rating={place.rating} />
                    </View>
                </View>
                <Text numberOfLines={1} style={styles.placeSubtitle}>{place.formattedAddress}</Text>
            </Card.Content>
        </Card>
    )
}

export type PlaceListParams = {
    places: Place[];
    selectedPlace: Place | null;
    onSelected: (place: Place) => void;
}
export const PlaceList = ({places, selectedPlace, onSelected } : PlaceListParams) => {
    const listRef = useRef<FlatList | null>(null);

    useEffect(() => {
        if (listRef.current && selectedPlace) {
            listRef.current.scrollToIndex({ animated: true, index: places.findIndex(item => item.id === selectedPlace.id)})
        }
    }, [selectedPlace]);

    const placeElements = places.map((place, index) => {
        <Text key={index}>{place.displayName.text}</Text>
    });

    const renderItem = (item: Place, index: number) => (
        <PlaceListItem place={item} index={index} selected={selectedPlace && selectedPlace.id === item.id} onPress={() => {
            onSelected(item);
        }}/>
    );
    
    return (
        <View style={styles.container}>
            <FlatList 
                contentContainerStyle={{gap: 8}}
                data={places}
                renderItem={({item, index}) => renderItem(item, index)}
                keyExtractor={place => place.id}
                ref={listRef}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8
    },
    placeSelected: {
        backgroundColor: "rgb(233, 223, 235)"
    },
    placeTitle: {
        fontSize: 18,
        fontWeight: 'bold',

    },
    placeSubtitle: {
        fontSize: 14,
        color: '#444',
        marginTop: 8
    },
    rating: {
        fontSize: 12,
    }
})