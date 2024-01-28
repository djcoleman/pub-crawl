import { Point, Place } from "../model/Place";
import { PlacesAPI } from "./PlacesAPI";
import Axios, { AxiosInstance } from 'axios';


type SearchNearbyResponse = {
    places: Place[];
};

type GetMediaResponse = {
    name: string;
    photoUri:  string;
}

export type NetworkError = {
    message: string;
    status?: number;
    isTransient: boolean;
}

export class GooglePlacesAPI implements PlacesAPI {
    private client: AxiosInstance;
    private key: string;

    constructor() {
         this.client = Axios.create({
            baseURL: 'https://places.googleapis.com'
        });

         this.key = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
    }

    async getPlacePhoto(name: string, maxWidth: number): Promise<string> {
        const response = await this.client.get<GetMediaResponse>(`/v1/${name}/media`, {
            params: {
                key: this.key,
                maxWidthPx: maxWidth,
                skipHttpRedirect: true
            }
        });
        return response.data.photoUri;
    }

    async findPlacesNear(location: Point, radius: number, maxResults: number): Promise<Place[]> {
        if (location == null) {
            console.error("Error finding places - location isn't set.");
            return [];
        }
        const response = await this.client.post<SearchNearbyResponse>('/v1/places:searchNearby', {
            includedTypes: [ "bar" ],
            maxResultCount: maxResults,
            locationRestriction: {
                circle: {
                    center: {
                        latitude: location.latitude,
                        longitude: location.longitude
                    },
                    radius: radius
                }
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': this.key,
                'X-Goog-FieldMask': "places.id,places.displayName,places.formattedAddress,places.currentOpeningHours,places.rating,places.location,places.editorialSummary,places.photos"
            }
        }).catch((error) => {
            const networkError : NetworkError = { 
                message: "Error retrieving nearby pubs", 
                status: error.response?.status || undefined, 
                isTransient: error.response?.status >= 500 
            };
            throw networkError;
        });

        return response.data.places || [];
    }
}

export const googlePlacesApi = new GooglePlacesAPI(); 