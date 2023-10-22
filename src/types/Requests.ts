export interface SearchDriversRequestDTO {
    locationName?: string;
    keyword?: string;
}

export interface NearbyDriversRequestDTO {
    coordinates: number[];
    radius: number;
    timePeriod: {
        start: number;
        end: number;
    };
}

export interface DeleteLocationsRequestDTO {
    startTimestamp?: number;
    endTimestamp?: number;
}