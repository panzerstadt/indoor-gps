import L from "leaflet";

const size = 30;

export const MainIcon = (name = "tomato", size) => {
  let out = {
    iconAnchor: [],
    popupAnchor: []
  };

  const fruit = name === "tomato" || name === "grapes";
  const arrow = name === "arrow";

  if (fruit) {
    out.iconAnchor = [0, size];
    out.popupAnchor = [0.5 * size, -size];
  } else if (arrow) {
    out.iconAnchor = [size, size];
    out.popupAnchor = [-0.5 * size, -size];
  } else {
    out.iconAnchor = [0.5 * size, size];
    out.popupAnchor = [0, -size];
  }

  return new L.Icon({
    iconUrl: require(`../../../assets/LeafletMap/icons/${name}.svg`),
    iconSize: [size, size],
    iconAnchor: out.iconAnchor,
    popupAnchor: out.popupAnchor
  });
};
