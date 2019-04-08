import React, { useContext, useEffect } from "react";
import { Map, Marker, Popup, TileLayer, ImageOverlay } from "react-leaflet";
import L from "leaflet";

// styles
import "../styles/leaflet.css";

// context api
import { MainContext } from "../../../App";

// components
import { Nearby } from "../utils/Nearby";
import { MainIcon } from "../Icons/index";

// image
import PNG_MAP from "../../../assets/LeafletMap/maps/map-01-med-cropped.png";
const LRG_MAP_BOUNDS = [[0, 0], [100, 400]];
const MED_MAP_BOUNDS = [[0, 0], [2500, 2738]];

// the bug where the pins don't show
// https://github.com/PaulLeCam/react-leaflet/issues/453
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

const Markers = ({ points, labels, icons, alwaysOpenPopup }) => {
  const openPopup = marker => {
    if (marker && marker.leafletElement && alwaysOpenPopup) {
      window.setTimeout(() => {
        marker.leafletElement.openPopup();
      });
    }
  };

  if (!points || points.length === 0) return null;

  if (points[0].length !== 2) {
    throw "points are not in an array of [lat, lng], cannot create Marker!";
  }

  const pinLbls = labels
    ? labels
    : [...Array(points.length)].map(() => "label");

  if (icons) {
    return points.map((p, i) => (
      <Marker key={i} position={p} icon={icons[i]} ref={openPopup}>
        <Popup>{pinLbls[i]}</Popup>
      </Marker>
    ));
  } else {
    return points.map((p, i) => (
      <Marker key={i} position={p} ref={openPopup}>
        <Popup>{pinLbls[i]}</Popup>
      </Marker>
    ));
  }
};

const closestObjects = (point, appState, count = 3) => {
  const dataPos = appState.dataset.map(v => [v.x, v.y]);
  const closestIndices = Nearby(point, dataPos);

  const topN = closestIndices.slice(0, count);

  const closestObjects = appState.dataset.filter(
    (v, i) => topN.filter(w => w === i).length > 0
  );

  const closestPins = closestObjects.map(v => [v.x, v.y]);
  const closestLbls = closestObjects.map(v => v.label);

  const output = { pins: closestPins, lbls: closestLbls };
  return output;
};

const LeafletMap = props => {
  let nearby;
  const { height } = props;

  const appState = useContext(MainContext);

  let { point, setPoint } = appState;
  let { setClosestList } = appState;

  // markers
  // assumes one point as input
  const { pins, lbls } = closestObjects(point, appState, 5);

  // didmount
  useEffect(() => {
    setClosestList({ pins, lbls });
  }, []);

  // CNN assisted geolocation
  const handleUpdateLocation = e => {};
  // manual geolocation
  const handleMapClick = e => {
    //alert("clicked! at " + e.latlng.lat + " " + e.latlng.lng);
    setPoint([e.latlng.lat, e.latlng.lng]);

    nearby = closestObjects([e.latlng.lat, e.latlng.lng], appState, 5);
    setClosestList(nearby);
  };

  // national history museum map
  const localPosition = [972, 1982]; // north, east
  const localMapBounds = MED_MAP_BOUNDS;
  const localMap = (
    <Map
      center={localPosition}
      zoom={1}
      minZoom={-2}
      maxZoom={2}
      style={{ height: height ? height : 300, width: "100%" }}
      onClick={handleMapClick}
      crs={L.CRS.Simple}
    >
      <ImageOverlay alt="local map" url={PNG_MAP} bounds={localMapBounds} />
      <Markers
        points={[point]}
        labels={[`${Math.round(point[0])} ${Math.round(point[1])}`]}
        icons={[MainIcon("arrow", 40)]}
        alwaysOpenPopup
      />
      <Markers points={pins} labels={lbls} />
    </Map>
  );

  return localMap;
};

export default LeafletMap;
