export interface GeoQueryCircleResponse {
  center: {
    longitude: number;
    latitude: number;
  };
  radius: number;
}

export interface GeoQueryPolygonResponse {
  corners: {
    latitude: number;
    longitude: number;
  }[];
}

export type GeoQueryResponse = GeoQueryCircleResponse | GeoQueryPolygonResponse;
