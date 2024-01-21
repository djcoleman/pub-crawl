import { Place, Point } from "../model/Place";

export interface PlacesAPI {
    findPlacesNear(location: Point, radius: number, maxResults: number) : Promise<Place[]>;
    getPlacePhoto(name: string, maxWidth: number) : Promise<string>;
}