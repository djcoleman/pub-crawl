export type Point = {
    latitude: number;
    longitude: number;
}

export type Date = {
    year: number;
    month: number;
    day: number;
}

export type OpeningPoint = {
    day: number;
    hour: number;
    minute: number;
    date: Date;
}

export type OpeningPeriod = {
    open: OpeningPoint;
    close: OpeningPoint;
}

export type OpeningHours = {
    openNow: boolean;
    periods: OpeningPeriod[];
    weekdayDescriptions: string[];
}

export type LocalizedText = {
    text: string;
    languageCode: string;
}

export type Photo = {
    name: string;
    widthPx: number;
    heightPx: number;
}

export type Place = {
    id: string;
    formattedAddress: string;
    location: Point;
    rating: number;
    currentOpeningHours: OpeningHours;
    displayName: LocalizedText;
    editorialSummary?: LocalizedText;
    photos: Photo[];
}