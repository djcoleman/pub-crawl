import { FlatList, StyleSheet, Text, View } from "react-native";
import { Place } from "../model/Place";
import { Card } from "react-native-paper";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { DetailsScreenProps } from "../screens/types";
import { PhotoView } from "./PhotoView";
import { Rating } from "./Rating";
import { TapGestureHandler, State, Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

type PlaceListItemProps = {
    place: Place;
    selected: boolean;
    onPress: () => void;
    onDoublePress: () => void;
}
const PlaceListItem = ({ place, selected, onPress, onDoublePress }: PlaceListItemProps) => {

    const singleTap = Gesture.Tap().maxDuration(250).onStart(onPress);
    const doubleTap = Gesture.Tap().maxDuration(250).numberOfTaps(2).onStart(onDoublePress);

    return (
        <GestureDetector gesture={Gesture.Exclusive(doubleTap, singleTap)}>
            <Card style={selected ? styles.placeSelected : {}} >
                <Card.Content>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <PhotoView photo={place.photos?.length > 0 ? place.photos[0] : null} maxWidth={100} style={styles.thumbnail} />
                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={1} style={styles.placeTitle}>{place.displayName.text}</Text>
                            <Rating rating={place.rating} />
                        </View>
                    </View>
                    <Text numberOfLines={1} style={styles.placeSubtitle}>{place.formattedAddress}</Text>
                </Card.Content>
            </Card>
        </GestureDetector>    
    )
}

export type PlaceListParams = {
    places: Place[];
    selectedPlace: Place | null;
    onSelected: (place: Place) => void;
}
export const PlaceList = ({places, selectedPlace, onSelected } : PlaceListParams) => {
    const listRef = useRef<FlatList | null>(null);
    const navigation = useNavigation<DetailsScreenProps['navigation']>();

    useEffect(() => {
        if (listRef.current && selectedPlace) {
            listRef.current.scrollToIndex({ animated: true, index: places.findIndex(item => item.id === selectedPlace.id)})
        }
    }, [selectedPlace]);

    const renderItem = (item: Place) => (
        <PlaceListItem 
            place={item} 
            selected={selectedPlace && selectedPlace.id === item.id} 
            onPress={() => onSelected(item)}
            onDoublePress={() => navigation.navigate('Details', { place: item })}/>

    );
    
    return (
        <GestureHandlerRootView style={styles.container}>
            <FlatList
                contentContainerStyle={{ gap: 8 }}
                data={places}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={place => place.id}
                ref={listRef}
            />
        </GestureHandlerRootView>
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
    },
    thumbnail: {
        width: 50,
        height: 'auto',
        borderRadius: 8
    }
})