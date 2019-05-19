import React, { useContext, useEffect, useState, useRef } from "react";
import { Map, Marker, Popup, TileLayer, ImageOverlay } from "react-leaflet";
import L from "leaflet";

// styles
import "../styles/leaflet.css";

// context api
import { MainContext } from "../../../App";

// components
import { Nearby } from "../utils/Nearby";
import { MainIcon } from "../Icons/index";
import { useDebounce } from "../../useHooks";

// image
import MAP from "../../../assets/LeafletMap/maps/map-01-med-cropped-4x.jpg";
const LRG_MAP_BOUNDS = [[0, 0], [100, 400]];
const MED_MAP_BOUNDS = [[0, 0], [2500, 2738]]; // as long as proportions match, img can be scaled up

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
  const closest = Nearby(point, dataPos);
  const closestIndices = closest.map(v => v.index);
  const topN = closestIndices.slice(0, count);

  // TODO: holy shit i shall leave this here
  // to remind mysel of how stupidly convoluted
  // i write this previously
  // -----------------------------------------
  // const closestObjs = appState.dataset.filter(
  //   (v, i) => topN.filter(w => w === i).length > 0
  // );

  const closestObjs = topN.map(index => appState.dataset[index]);
  const closestPins = closestObjs.map(v => [v.x, v.y]);
  const closestLbls = closestObjs.map(v => v.label);

  const output = { pins: closestPins, lbls: closestLbls };

  return output;
};

const findLocationFromObject = (name, appState) => {
  const output = appState.dataset.filter(v => v.label === name)[0];
  return { lat: output.x, lng: output.y };
};

const findObjectFromLocation = (loc, appState) => {
  console.log(loc);
  console.log(appState.dataset);
  const locs = appState.dataset.map(v => [parseInt(v.x), parseInt(v.y)]);
  const t = Nearby(loc, locs);
  console.log(t);
};

const LeafletMap = props => {
  let nearby;
  const { height } = props;

  const appState = useContext(MainContext);

  const { point, setPoint } = appState;
  const { setClosestList } = appState;

  // markers
  // assumes one point as input
  const [pins, setPins] = useState([]);
  const [lbls, setLbls] = useState([]);
  useEffect(() => {
    const { pins, lbls } = closestObjects(point, appState, 5);
    setPins(pins);
    setLbls(lbls);
  }, [point]);

  // closest pins
  useEffect(() => {
    setClosestList({ pins, lbls });
  }, [pins, lbls]);

  // CNN assisted geolocation
  const [mainLbl, setMainLbl] = useState("tap anywhere!");
  useEffect(() => {
    const handleUpdateLocation = () => {
      const updatedLabel = appState.search;

      const { lat, lng } = findLocationFromObject(updatedLabel, appState);
      setPoint([lat, lng]);

      nearby = closestObjects([lat, lng], appState, 5);
      setClosestList(nearby);

      setMainLbl(updatedLabel);
    };

    if (appState.search !== "") {
      handleUpdateLocation();
    }
  }, [appState.search]);

  // manual geolocation
  const handleMapClick = e => {
    //alert("clicked! at " + e.latlng.lat + " " + e.latlng.lng);
    const pt = [e.latlng.lat, e.latlng.lng];
    setPoint(pt);

    nearby = closestObjects([e.latlng.lat, e.latlng.lng], appState, 5);
    setClosestList(nearby);

    setMainLbl("see what's nearby!");
  };

  const mapRef = useRef();
  useEffect(() => {
    const map = mapRef.current.leafletElement;

    // resize map with centering
    setTimeout(() => {
      const paddedBounds = new L.LatLngBounds([point, ...pins]);
      map.fitBounds(paddedBounds, { padding: [50, 50] });
      map.invalidateSize({ animate: true });
    }, 300);
  }, [height, point]);

  // national history museum map
  const localMapBounds = MED_MAP_BOUNDS;
  return (
    <Map
      ref={mapRef}
      animate={true}
      center={point}
      //zoom={1}
      minZoom={-2}
      maxZoom={2}
      style={{ height: height ? height : 300, width: "100%" }}
      onClick={handleMapClick}
      crs={L.CRS.Simple}
    >
      <ImageOverlay alt="local map" url={MAP} bounds={localMapBounds} />

      {/* main marker */}
      <Markers
        points={[point]}
        labels={[mainLbl]}
        //labels={[`${Math.round(point[0])} ${Math.round(point[1])}`]}
        icons={[MainIcon("backpacker", 40)]}
        alwaysOpenPopup
      />

      {/* nearby markers */}
      <Markers
        points={pins}
        labels={lbls}
        icons={pins.map(_ => MainIcon("customdino", 40))}
      />
    </Map>
  );
};

export default LeafletMap;
