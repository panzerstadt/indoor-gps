import React, { useState, useEffect, useRef } from "react";

// styles
import styles from "./index.module.css";

const Card = ({ text, onExit, blurOnButtonOnly, hideExitButton, children }) => {
  const cardDivRef = useRef(null);

  const exitCard = e => {
    // where is the user clicking?
    // console.log("related");
    // console.log(e.relatedTarget);
    // console.log("current");
    // console.log(e.currentTarget);
    // console.log("all target");
    // console.log(e.target);

    if (e.currentTarget) {
      if (e.currentTarget.tagName === "BUTTON") {
        onExit();
      }
    }

    if (e.relatedTarget) {
      const className = e.relatedTarget.className.split(" ")[0];

      //console.log(className);
      if (className === "leaflet-container" && !blurOnButtonOnly) {
        onExit();
      }
    }
  };

  useEffect(() => {
    cardDivRef.current.focus();
  }, []);

  return (
    <div
      ref={cardDivRef}
      className={styles.card}
      tabIndex="-1"
      onBlur={exitCard}
    >
      {hideExitButton ? null : (
        <div className={styles.buttonDiv}>
          <button className={styles.exitButton} onClick={exitCard}>
            X
          </button>
        </div>
      )}

      {text}
      {children}
    </div>
  );
};

export default Card;
