import React, { useEffect, useState } from "react";

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

const IntroPage = ({ onClick, isShowing }) => {
  const [showing, setShowing] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowing(false);
    }, 30000);
  }, []);

  return (
    <div className={styles.intro} style={{ opacity: showing ? 1 : 0 }}>
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
    </div>
  );
};

export default IntroPage;
