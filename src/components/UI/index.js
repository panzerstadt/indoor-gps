import React, {
  useState,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef
} from "react";

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
  const [width, setWidth] = useState(0);
  const handleResize = e => {
    requestAnimationFrame(() => setWidth(window.innerWidth));
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const carouselSettings = {
    arrows: false,
    infinite: false,
    slidesToShow: width > 600 ? 3 : 2,
    slidesToScroll: width > 600 ? 3 : 2
  };

  const [nearestLbls, setNearestLbls] = useState([]);
  useEffect(() => {
    if (appState.closestList.lbls.length > 0) {
      setNearestLbls(appState.closestList.lbls);
      console.log(appState.closestList.lbls);
    }
  }, [appState.closestList]);

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
            <div className={styles.carouselContainer}>
              <Information search={v} showImage={true} />
            </div>
          </div>
        ))}
      </Carousel>

      <h4>Try looking for these dinosaurs!</h4>
      <Carousel settings={carouselSettings}>
        {appState.dataset.map((v, i) => (
          <div
            key={i}
            className={styles.carouselDiv}
            className={styles.carouselMain}
          >
            <div className={styles.carouselContainer}>
              <img
                className={styles.carouselImg}
                src={v.img}
                alt="dino"
                height={100}
              />
              <div className={styles.infoContainer}>
                <h5 className={styles.carouselTitle}>{v.label}</h5>
              </div>
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

      <br />
      <p>
        <strong>credits</strong>
      </p>
      <p className={styles.credits}>
        <p>
          dancing dino animation courtesy of Alex Bradt from{" "}
          <a
            href="https://lottiefiles.com/"
            target="_blank"
            rel="nooponer nofererer"
          >
            lottiefiles.com
          </a>
        </p>

        <p>
          other dinosaur icons and explorer icon courtesy of Freepik from{" "}
          <a
            href="https://www.flaticon.com/"
            target="_blank"
            rel="nooponer nofererer"
          >
            www.flaticon.com
          </a>
        </p>

        <p>
          We are not affiliated, associated, authorized, endorsed by, or in any
          way officially connected with the National Museum of Nature and
          Science, or any of its subsidiaries or its affiliates. The official
          Isabella Stewart Gardner Museum website can be found at{" "}
          <a
            href="https://www.kahaku.go.jp/english/index.php"
            target="_blank"
            rel="nooponer nofererer"
          >
            www.kahaku.go.jp
          </a>
          . The names National Museum of Nature and Science as well as related
          names, marks, emblems and images are registered trademarks of their
          respective owners.
        </p>
      </p>
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
    //console.log(videoRef);
  }, [videoRef]);

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
