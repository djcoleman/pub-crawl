import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Place } from "../model/Place";

export type RootStackParamList = {
    Home: undefined;
    Details: { place: Place };
}

export type MapScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;
