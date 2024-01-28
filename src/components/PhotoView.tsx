import { Image, ImageStyle, StyleProp } from "react-native";
import { Photo } from "../model/Place";
import { useEffect, useState } from "react";
import { googlePlacesApi } from "../services/GooglePlacesAPI";
import placeholderImage from '../../assets/placeholder.jpg';
import { ActivityIndicator } from "react-native-paper";

type PhotoProps = {
    photo? : Photo;
    maxWidth?: number;
    style?: StyleProp<ImageStyle>; 
}

export const PhotoView = ({photo, maxWidth = 100, style} : PhotoProps) => {
    const [source, setSource] = useState("");
    const [isLoading, setIsLoading] = useState(photo !== null);

    useEffect(() => {
        async function fetchPhoto(name: string) {
            const url = await googlePlacesApi.getPlacePhoto(name, maxWidth);
            setSource(url);
            setIsLoading(false);
        }
        if (photo) {
            fetchPhoto(photo.name);
        }
    }, []);

    const imageSource = source === "" ? placeholderImage : {uri: source};
    const display = isLoading ? <ActivityIndicator/> : <Image source={imageSource} style={style} />
    return display;
}