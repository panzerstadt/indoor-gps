import React, { useState, useContext, useEffect, useRef } from "react";

import styles from "./index.module.css";

import Card from "../Card";
import Camera from "../atoms/Camera";
import Predictor from "../atoms/Predictor";
import Button from "../atoms/Button";
import Carousel from "../atoms/Carousel";

import { MainContext } from "../../App";
import { useWiki } from "../useHooks";

const ExploreCard = () => {
  const appState = useContext(MainContext);
  const carouselSettings = {
    arrows: false,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 3
  };

  const nearestLbls =
    appState.closestList.lbls.length > 0 ? appState.closestList.lbls : [];

  return (
    <div className={styles.exploreDiv}>
      <h3>Welcome to the museum!</h3>

      <h4>What's Nearby </h4>
      <small>tap on the map to see what's nearby!</small>
      <Carousel settings={carouselSettings}>
        {nearestLbls.map((v, i) => (
          <div key={i} className={styles.carouselDiv}>
            <h5>{v}</h5>
          </div>
        ))}
      </Carousel>

      <h4>Other Things to See</h4>
      <Carousel settings={carouselSettings}>
        {appState.dataset.map((v, i) => (
          <div key={i} className={styles.carouselDiv}>
            <h5>{v.label}</h5>
          </div>
        ))}
      </Carousel>

      <h4>About the museum</h4>
      <h4 style={{ margin: 0, padding: 0 }}>
        Opens 9am - 5pm
        {/* <span className="sparks dotline-extrathick" style={{ marginRight: 50 }}>
          OPENS
        </span>
        <span className="sparks dotline-extrathick">{`9am {30,60,90,60,100,50,45,20} 5pm`}</span> */}
      </h4>
      <small>
        <p>
          Established in 1877, the National Museum of Nature and Science boasts
          one of the richest histories of any museum in Japan. It is Japan's
          only nationally administered comprehensive science museum, and is a
          central institute for research in natural history and history of
          science and technology.{" "}
          <a
            href="https://artsandculture.google.com/partner/national-museum-of-nature-and-science"
            target="_blank"
            rel="noopener noreferrer"
          >
            more
          </a>
        </p>
      </small>
    </div>
  );
};

const DiscoverCard = () => {
  const [pred, setPred] = useState("");
  const [videoRef, setVideoRef] = useState();

  const onTakePhoto = dataURI => {
    console.log("ontake photo!");
    console.log(dataURI);
  };

  const onStream = mediaStream => {
    console.log("streaming!");
    console.log(mediaStream);
  };

  useEffect(() => {
    console.log(videoRef);
  }, [videoRef]);

  return (
    <div className={styles.discoverDiv}>
      <Camera onTakePhoto={onTakePhoto} onRef={setVideoRef} />

      <code>prediction: {pred}</code>
      <Predictor videoRef={videoRef} onPrediction={setPred} />
    </div>
  );
};

const Buttons = ({ inputs, onSubmit }) => {
  return (
    <div className={styles.buttonDiv}>
      <Button inputs={inputs} onSubmit={onSubmit} />
    </div>
  );
};

const UI = () => {
  const [currentPage, setCurrentPage] = useState("📷");

  const pages = ["explore 🔍", "📷"];

  if (currentPage === pages[0]) {
    return (
      <Card onExit={() => setCurrentPage("main")} blurOnButtonOnly>
        <ExploreCard />
      </Card>
    );
  } else if (currentPage === pages[1]) {
    return (
      <Card text="discover" onExit={() => setCurrentPage("main")}>
        <DiscoverCard />
      </Card>
    );
  } else {
    return (
      <Buttons inputs={pages} onSubmit={e => setCurrentPage(e.target.value)} />
    );
  }

  return;
};

const CardLayer = () => {
  return (
    <div className={styles.main}>
      <UI />
    </div>
  );
};

export default CardLayer;
