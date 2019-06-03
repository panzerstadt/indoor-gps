import React, { useEffect, useState } from "react";
import posed from "react-pose";

import Lottie from "react-lottie";

import styles from "./index.module.css";

import DUMMY_ANIMATION from "../../assets/lottie/dino.json";

const options = {
  loop: true,
  autoplay: true,
  animationData: DUMMY_ANIMATION,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const Intro = posed.div({
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
});

const IntroPage = ({ onClick, isShowing }) => {
  const [showing, setShowing] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowing(false);
      isShowing && isShowing(false);
    }, 30000);
  }, []);

  return (
    <Intro className={styles.intro} pose={showing ? "visible" : "hidden"}>
      <div className={styles.introText}>
        <div className={styles.anim}>
          <Lottie options={options} isStopped={false} isPaused={false} />
        </div>

        <h1>Welcome Adventurer!</h1>
        <h4>
          Dino Map helps you discover the wonders of the many dinosaur exhibits
          in Tokyo's National Museum of Nature and Science!
        </h4>
        <h4>
          Are you ready to embark on a hunt for the amazing exhibits in the
          museum?
        </h4>
        <button
          className={styles.button}
          style={{ pointerEvents: showing ? "all" : "none" }}
          onClick={() => setShowing(false)}
        >
          I'm Ready!
        </button>
      </div>
    </Intro>
  );
};

export default IntroPage;
