import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";

import styles from "./index.module.css";

import Clip from "../Loading";

const WebcamComponent = ({ onRef }) => {
  const webcamRef = useRef();
  const [cameraReady, setCameraReady] = useState(false);
  const setupCamera = async () => {
    // MDN: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const e1 =
        "Browser API navigator.mediaDevices.getUserMedia not available";
      this.setState({ error_messages: e1 });
      throw e1;
    }

    const video = webcamRef.current.video;
    video.onloadedmetadata = () => {
      setCameraReady(true);
    };
  };

  useEffect(() => {
    setupCamera();

    if (cameraReady) {
      onRef && onRef(webcamRef);
    }
  }, [webcamRef, onRef, cameraReady]);

  return (
    <div className={styles.cameraDiv}>
      <Clip />
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
    </div>
  );
};

export default WebcamComponent;
