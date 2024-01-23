import { Image, ImageStyle, StyleProp } from "react-native";
import { Photo } from "../model/Place";
import { useEffect, useState } from "react";
import { googlePlacesApi } from "../services/GooglePlacesAPI";
import placeholderImage from '../../assets/placeholder.jpg';

type PhotoProps = {
    photo : Photo;
    maxWidth?: number;
    style?: StyleProp<ImageStyle>; 
}

export const PhotoView = ({photo, maxWidth = 100, style} : PhotoProps) => {
    const [source, setSource] = useState("");

    useEffect(() => {
        async function fetchPhoto(name: string) {
            const url = await googlePlacesApi.getPlacePhoto(name, maxWidth);
            setSource(url);
        }

        fetchPhoto(photo.name);
    }, []);

    const imageSource = source === "" ? placeholderImage : {uri: source};
    return <Image source={imageSource} style={style}></Image>
}