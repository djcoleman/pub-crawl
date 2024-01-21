import { Point, Place } from "../model/Place";
import { PlacesAPI } from "./PlacesAPI";
import dummyData from  '../data/places.json';

export class DummyPlacesAPI implements PlacesAPI {
    getPlacePhoto(name: string, maxWidth: number): Promise<string> {
        const parts = name.split("/");
        console.log(`Fetching: assets/${parts[1]}/${parts[3]}.jpg`);
        return Promise.resolve(`assets/${parts[1]}/${parts[3]}.jpg`);
    }

    findPlacesNear(location: Point, radius: number, maxResults: number): Promise<Place[]> {
        return Promise.resolve(dummyData.places);
    }
}

export const dummyPlacesAPI = new DummyPlacesAPI();