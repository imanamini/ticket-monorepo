export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
  circle: {
    center: {
      lat: number;
      lng: number;
    };
    radius: number;
  };
}
