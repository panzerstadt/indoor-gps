import React, { useState, useEffect, useRef } from "react";

// styles
import styles from "./index.module.css";
import { update } from "@tensorflow/tfjs-layers/dist/variables";

const Card = ({
  text,
  onExit,
  blurOnButtonOnly,
  hideExitButton,
  children,
  onOffsetTop
}) => {
  const cardDivRef = useRef(null);

  const exitCard = e => {
    // where is the user clicking?
    // console.log("related");
    // console.log(e.relatedTarget);
    // console.log("current");
    // console.log(e.currentTarget);
    // console.log("all target");
    // console.log(e.target);

    if (e.currentTarget && e.currentTarget.tagName === "BUTTON") {
      console.log("exited through button!");
      onOffsetTop && onOffsetTop(window.innerHeight);
      onExit();
    } else if (e.relatedTarget) {
      const className = e.relatedTarget.className.split(" ")[0];

      //console.log(className);
      if (className === "leaflet-container" && !blurOnButtonOnly) {
        console.log("exiting by clicking on map!");
        onOffsetTop && onOffsetTop(window.innerHeight);
        onExit();
      }
    } else {
      console.log("somethings wrong with the card exit logic. event:", e);
    }
  };

  const updateOffsetTop = () => {
    if (onOffsetTop && cardDivRef && cardDivRef.current) {
      onOffsetTop(cardDivRef.current.offsetTop);
    }
  };

  useEffect(() => {
    cardDivRef.current.focus();
    updateOffsetTop();
    window.addEventListener("touchend", updateOffsetTop);

    // return () => window.removeEventListener("touchend", updateOffsetTop);
  }, []);

  useEffect(() => {
    cardDivRef &&
      cardDivRef.current.addEventListener("scroll", updateOffsetTop);

    return () =>
      cardDivRef &&
      cardDivRef.current.removeEventListener("scroll", updateOffsetTop);
  }, [cardDivRef]);

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
