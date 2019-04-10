import React, { useState, useContext, useEffect, useRef } from "react";

import styles from "./index.module.css";

import Card from "../Card";
import Camera from "../atoms/Camera";
import Predictor from "../atoms/Predictor";
import Button from "../atoms/Button";
import Carousel from "../atoms/Carousel";
import Information, { useFetch } from "../atoms/Information";

import { MainContext } from "../../App";
import { useWiki } from "../useHooks";

const GREEN = "#3AB795";
const YELLOW = "#FFC532";
const GREY = "#BECEC6";

const ExploreCard = () => {
  const appState = useContext(MainContext);
  const carouselSettings = {
    arrows: false,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 3
  };

  const { closestList } = appState;
  const nearestLbls = closestList.lbls.length > 0 ? closestList.lbls : [];

  const [infoCards, setInfoCards] = useState([]);
  const handleClick = e => {
    console.log(e);
  };

  return (
    <div className={styles.exploreDiv}>
      <h3>Welcome to the museum!</h3>

      <h4>What's Nearby </h4>
      <p
        style={{
          display: nearestLbls.length > 0 ? "none" : "block"
        }}
      >
        tap on the map to see what's nearby!
      </p>
      <Carousel settings={carouselSettings} className={styles.carouselMain}>
        {nearestLbls.map((v, i) => (
          <div key={i} className={styles.carouselDiv}>
            <div onClick={handleClick} className={styles.carouselContainer}>
              <h5 className={styles.carouselTitle}>{v}</h5>
              <div className={styles.carouselDesc}>
                <div className={styles.descGradient}> </div>
                <Information search={v} showImage={true} />
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      <h4>Other Things to See</h4>
      <Carousel settings={carouselSettings}>
        {appState.dataset.map((v, i) => (
          <div
            key={i}
            className={styles.carouselDiv}
            className={styles.carouselMain}
          >
            <div className={styles.carouselContainer}>
              <img src="#" alt="dino" height={100} />
              <h5 className={styles.carouselTitle}>{v.label}</h5>
            </div>
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
  const [ready, setReady] = useState(false);
  const [triggerPrediction, setTriggerPrediction] = useState(false);

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

  console.log(ready);

  const AnimatedLogo = () => {
    return (
      <img className={styles.animatedLogo} src="#" height={50} alt="find" />
    );
  };

  const animatedBorder = (px = 10) => {
    if (ready && !triggerPrediction) return `${px}px solid ${GREEN}`;
    else if (ready && triggerPrediction) return `${px}px solid ${YELLOW}`;
    else return `${px}px solid ${GREY}`;
  };

  return (
    <div className={styles.discoverDiv}>
      <div
        onClick={() => setTriggerPrediction(true)}
        className={styles.cameraContainer}
        style={{ border: animatedBorder() }}
      >
        <Camera onTakePhoto={onTakePhoto} onRef={setVideoRef} />
      </div>
      {/* <AnimatedLogo /> */}

      <code>prediction: {pred}</code>
      <Predictor
        videoRef={videoRef}
        onTrigger={triggerPrediction}
        onSuccess={p => {
          setPred(p);
          setTriggerPrediction(false);
        }}
        onLoaded={setReady}
      />
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
  const pages = ["explore 🔍", "📷"];
  const appState = useContext(MainContext);
  const [currentPage, setCurrentPage] = useState(pages[0]);

  const handlePageTransition = () => {
    // TODO: smooth slide out/in/fade transition
  };

  useEffect(() => {
    setCurrentPage(pages[0]);
  }, [appState.search]);

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
