export type Geometry = {
  type: string;
  coordinates: number[];
};

export type Author = {
  _id: string,
  id: string,
  username: string,
  email: string
}

export type Campground = {
  _id: string;
  title: string;
  price: number;
  description: string;
  location: string;
  geometry: Geometry;
  author: Author
  properties?: { popUpMarkup: string };
};
