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

// import data
import tempDataset from "./dataset/test.json";
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

  const label = "a dinosaur! RAWR";

  // // test
  // const [wikiData, setWikiData] = useState();
  // useEffect(() => {
  //   const fetchMultiple = async list => {
  //     const r = await useMultipleWiki(list);
  //     setWikiData(r);
  //   };

  //   if (data.length !== 0) {
  //     const queries = data.map(v => v.label);
  //     console.log(queries);
  //     fetchMultiple(queries);
  //   }
  // }, [data]);

  // console.log(wikiData);

  const pt = {};

  const appState = {
    point: point,
    setPoint: setPoint,
    closestList: closestList,
    setClosestList: setClosestList,
    photo: photo,
    setPhoto: setPhoto,
    label: label,
    dataset: data
  };

  return (
    <div className={styles.app}>
      <MainContext.Provider value={appState}>
        <Map>
          <CardUI />
        </Map>
      </MainContext.Provider>
    </div>
  );
};

export default App;
