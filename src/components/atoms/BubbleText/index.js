import React from "react";

import styles from "./index.module.css";

import { ReactComponent as SpeechBubble } from "./assets/bubble.svg";

const Bubble = ({ text, ...props }) => {
  return (
    <div
      className={styles.container}
      {...props}
      style={{ pointerEvents: "none" }}
    >
      <div style={{ position: "relative" }}>
        <SpeechBubble className={styles.bubble} />
        <div className={styles.textContainer}>
          <span className={styles.text}>{text}</span>
        </div>
      </div>
    </div>
  );
};

export default Bubble;
