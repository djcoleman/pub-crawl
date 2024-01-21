import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Photo, Place } from "../model/Place";
import { Card } from "react-native-paper";
import { useEffect, useState } from "react";
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
}
export const PlaceList = ({places} : PlaceListParams) => {
    const [selectedItem, setSelectedItem] = useState(-1)

    const placeElements = places.map((place, index) => {
        <Text key={index}>{place.displayName.text}</Text>
    });

    return (
        <View style={styles.container}>
            <FlatList 
                contentContainerStyle={{gap: 8}}
                data={places}
                renderItem={({item, index}) => <PlaceListItem place={item} index={index} selected={selectedItem === index} onPress={() => setSelectedItem(index)}/>}
                keyExtractor={place => place.displayName.text}
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