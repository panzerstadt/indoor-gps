import React, { useEffect, useState } from "react";
import logo from "./logo.svg";

// styles
//import "./App.css";
import "./App.fonts.css";
import "./App.global.css";
import styles from "./App.module.css";

// components
import Map from "./components/Map";
import CardUI from "./components/UI";
import IntroPage from "./components/Intro";

// import data
import { useCsvData, useWiki, useMultipleWiki } from "./components/useHooks";
import filepath from "./dataset/class_coords.csv";

// contextAPI
export const MainContext = React.createContext();

const App = props => {
  // load data
  const [data, setDataFilepath] = useCsvData(filepath);
  // customer journey
  // 1. customer detects image (eq: clicks on button)
  // 2. main location returned, with nearby locations, and description

  const [point, setPoint] = useState([972, 1982]);
  const [closestList, setClosestList] = useState({ pins: [], lbls: [] });
  const [photo, setPhoto] = useState("");
  const [search, setSearch] = useState("");

  const label = "a dinosaur! RAWR";

  const pt = {};

  const appState = {
    point: point,
    setPoint: setPoint,
    closestList: closestList,
    setClosestList: setClosestList,
    photo: photo,
    setPhoto: setPhoto,
    label: label,
    dataset: data,
    search: search,
    setSearch: setSearch
  };

  return (
    <div className={styles.app}>
      <IntroPage />
      <MainContext.Provider value={appState}>
        <Map>
          <CardUI />
        </Map>
      </MainContext.Provider>
    </div>
  );
};

export default App;
