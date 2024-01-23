import { Image, StyleSheet, Text, View, useWindowDimensions } from "react-native"
import { DetailsScreenProps } from "./types";
import { useEffect } from "react";
import { PhotoView } from "../components/PhotoView";
import { Rating } from "../components/Rating";

type OpeningHoursProps = {
    descriptions: string[];
}
const OpeningHours = ({descriptions}: OpeningHoursProps) => {
    const now = new Date();
    const dayOfWeek = now.getDay();

    return (
        <View>
            {descriptions.map((hours, index) => <Text key={index} style={index === (dayOfWeek - 1 % 6) ? {fontWeight: 'bold'} : {}}>{hours}</Text>)}
        </View>
    );
}
export const DetailsScreen = ({route, navigation}: DetailsScreenProps) => {
    const { place } = route.params;
    const { width: screenWidth } = useWindowDimensions();

    useEffect(() => {
        navigation.setOptions({
            title: place.displayName.text
        });
    })

    return (
        <View style={style.container}>
            <PhotoView photo={place.photos[0]} maxWidth={screenWidth} style={style.photo} />
            <View style={style.details}>
                <Text style={style.heading}>{place.displayName.text}</Text>
                <Rating style={style.rating} rating={place.rating} showNumber={true} />
                {place.editorialSummary && (<Text style={style.description}>{place.editorialSummary.text}</Text>)}
                <Text style={style.subHeading}>Opening Hours</Text>
                <OpeningHours descriptions={place.currentOpeningHours.weekdayDescriptions} />
            </View>
        </View>
    );
} 

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    photo: {
        height: '30%',
        width: '100%'
    },
    details: {
        padding: 8
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
    },
    subHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 8
    },
    rating: {
        fontSize: 14
    },
    description: {
        marginTop: 8,
        fontSize: 16
    }
});