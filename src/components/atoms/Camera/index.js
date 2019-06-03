import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";

import styles from "./index.module.css";

import ClipPath, { Clip4Outline } from "../CameraClipPath";

const VIDEO_CONSTRAINTS = { facingMode: "environment" };

const WebcamComponent = ({ onRef, strokeClr, ...props }) => {
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
    <div className={styles.cameraDiv} {...props}>
      <Clip4Outline
        className={styles.cameraOutline}
        height={50}
        width={50}
        stroke={strokeClr}
      />
      <div className={styles.camera}>
        <ClipPath />

        <Webcam
          audio={false}
          ref={webcamRef}
          videoConstraints={VIDEO_CONSTRAINTS}
          screenshotFormat="image/jpeg"
        />
      </div>
    </div>
  );
};

export default WebcamComponent;
