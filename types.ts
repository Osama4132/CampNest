export type Geometry = {
  type: string;
  coordinates: number[];
};

export type Campground = {
  _id: string;
  title: string;
  price: number;
  description: string;
  location: string;
  geometry: Geometry;
  properties?: { popUpMarkup: string };
};
