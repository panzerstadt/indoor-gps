import React, { useState, useEffect, useRef } from "react";
import posed from "react-pose";

// styles
import styles from "./index.module.css";

const CardDiv = posed.div({
  visible: {
    opacity: 1,
    bottom: 0,
    transition: { ease: "backOut", duration: 600 }
  },
  hidden: {
    opacity: 0,
    bottom: -300,
    transition: { ease: [0.3, 0.28, 0.34, -0.26], duration: 600 }
  }
});

const Card = ({
  text,
  onExit,
  blurOnButtonOnly,
  hideExitButton,
  children,
  onOffsetTop,
  transparent,
  overflow,
  active
}) => {
  const cardDivRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

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
      setIsVisible(false);
      //onExit();
    } else if (e.relatedTarget) {
      const className = e.relatedTarget.className.split(" ")[0];

      //console.log(className);
      if (className === "leaflet-container" && !blurOnButtonOnly) {
        console.log("exiting by clicking on map!");
        onOffsetTop && onOffsetTop(window.innerHeight);
        setIsVisible(false);
        //onExit();
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

  useEffect(() => {
    if (active) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [active]);

  return (
    <CardDiv
      ref={cardDivRef}
      className={styles.card}
      style={{
        backgroundColor: transparent ? "transparent" : "white",
        overflow: overflow ? "visible" : "scroll"
      }}
      // tabIndex="-1"
      onBlur={exitCard}
      pose={isVisible ? "visible" : "hidden"}
      onPoseComplete={() => {
        !isVisible && onExit();
      }}
    >
      <div
        className={styles.buttonDiv}
        style={{ display: hideExitButton ? "none" : "flex" }}
      >
        <button className={styles.exitButton} onClick={exitCard}>
          X
        </button>
      </div>
      {text}
      {children}
    </CardDiv>
  );
};

export default Card;
