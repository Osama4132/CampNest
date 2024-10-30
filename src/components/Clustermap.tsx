import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/maps.css";
import { Campground } from "../../types.ts";

type IFeatureEnum = "Feature";
type IPointEnum = "Point";

const defaultStyle = "mapbox://styles/mapbox/streets-v12";

const ClusterMap = ({
  campgrounds,
  mapboxStyle = defaultStyle,
}: {
  campgrounds: Campground[];
  mapboxStyle?: string;
}) => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map>();

  useEffect(() => {
    if (mapContainerRef.current) {
      const campgroundGeometry = campgrounds.map((campground) => ({
        geometry: {
          coordinates: campground.geometry.coordinates,
          type: campground.geometry.type as IPointEnum,
        },
        type: "Feature" as IFeatureEnum,
        properties: campground.properties ?? {},
      }));
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapboxStyle,
        center: [-103.5917, 40.6699],
        zoom: 1,
      });
      mapRef.current.addControl(new mapboxgl.NavigationControl());

      mapRef.current.on("load", () => {
        if (mapRef.current) {
          mapRef.current.addSource("campgrounds", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: campgroundGeometry,
            },
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50,
          });

          mapRef.current.addLayer({
            id: "clusters",
            type: "circle",
            source: "campgrounds",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#00BCD4",
                10,
                "#2196F3",
                30,
                "#3F51B5",
              ],
              "circle-radius": [
                "step",
                ["get", "point_count"],
                15,
                10,
                20,
                30,
                25,
              ],
            },
          });

          mapRef.current.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "campgrounds",
            filter: ["has", "point_count"],
            layout: {
              "text-field": ["get", "point_count_abbreviated"],
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 12,
            },
          });
          mapRef.current.addLayer({
            id: "unclustered-point",
            type: "circle",
            source: "campgrounds",
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-color": "#11b4da",
              "circle-radius": 7,
              "circle-stroke-width": 1,
              "circle-stroke-color": "#fff",
            },
          });

          mapRef.current.on("click", "clusters", (e) => {
            if (mapRef.current) {
              const features = mapRef.current.queryRenderedFeatures(e.point, {
                layers: ["clusters"],
              });
              const clusterId = features?.[0].properties?.cluster_id;
              const source = mapRef.current?.getSource(
                "campgrounds"
              ) as mapboxgl.GeoJSONSource;
              source.getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err) return;

                mapRef.current?.easeTo({
                  center: features[0].geometry.coordinates,
                  zoom: zoom ?? undefined,
                });
              });
            }
          });
        }
        if (mapRef.current) {
          mapRef.current.on("click", "unclustered-point", (e) => {
            const text = e.features?.[0].properties?.popUpMarkup;

            const coordinates = e.features?.[0]?.geometry.coordinates.slice();

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            if (mapRef.current) {
              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(text)
                .addTo(mapRef.current);
            }

            const popupArticle = document.querySelector("#navigate-link") as
              | HTMLElement
              | undefined;
            const id = popupArticle?.dataset.id;
            popupArticle?.addEventListener("click", () => {
              navigate(`/campground/${id}`);
            });
          });
        }

        mapRef.current?.on("mouseenter", "clusters", () => {
          if (mapRef.current)
            mapRef.current.getCanvas().style.cursor = "pointer";
        });
        mapRef.current?.on("mouseleave", "clusters", () => {
          if (mapRef.current) mapRef.current.getCanvas().style.cursor = "";
        });
      });

      return () => mapRef.current?.remove();
    }
  }, [campgrounds, navigate, mapboxStyle]);

  return (
    <div id="cluster-map" ref={mapContainerRef} className="rounded mt-4"></div>
  );
};

export default ClusterMap;
