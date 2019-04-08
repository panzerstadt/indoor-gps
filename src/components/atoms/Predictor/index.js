import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

import { useInterval } from "../../useHooks";
import Information from "../Information";

const SCALE = 1;
const RGB_SCALE = 0.02;
const MODEL = "assets/models/indoor-gps/model.json";
const CLASSES = "assets/models/indoor-gps/class_names.txt";

const loadModel = async () => {
  // in public folder
  console.log(
    "INFO: model has to be places in public folder to be accessible."
  );
  return await tf.loadLayersModel(MODEL);
};

const preprocess = imgData => {
  return tf.tidy(() => {
    // convert img to tensor
    let tensor = tf.browser.fromPixels(imgData); // second input is optional number of channels

    // resize to 28 x 28
    const resized = tf.image.resizeBilinear(tensor, [299, 299]).toFloat();

    // normalize
    const offset = tf.scalar(255.0);
    // sub == subtract
    // normalized 0 to 1
    const normalized = resized.div(offset); // resized divided by offset
    const normalized2 = normalized.sub(tf.scalar(0.5));
    const normalized3 = normalized2.mul(tf.scalar(2.0));
    // we add a dimension to get a batch shape (??)
    const batched = normalized3.expandDims(0);

    return batched;
  });
};

const Predictor = ({ videoRef, onPrediction }) => {
  const [predictor, setPredictor] = useState();
  const [classes, setClasses] = useState();
  useEffect(() => {
    const load = async () => {
      const model = await loadModel();
      const classes = await fetch(CLASSES)
        .then(r => r.text())
        .then(s => {
          const allLines = s.split(/\r\n|\n/);
          return allLines.filter(v => v.length > 1);
        });

      setPredictor(model);
      setClasses(classes);
    };

    load();
  }, []);

  // the thing that runs stuff along on video stream
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionDelay, setDetectionDelay] = useState(500);
  useInterval(
    () => {
      detect();
    },
    isDetecting ? detectionDelay : null
  );

  const [guesses, setGuesses] = useState([]);
  const [search, setSearch] = useState("");
  const detect = async () => {
    if (videoRef) {
      let context;
      const video = videoRef.current.video;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth * SCALE;
      canvas.height = video.videoHeight * SCALE;

      context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const processed = preprocess(canvas);
      const pred = predictor.predict(processed).dataSync();

      let predictions = Object.values(pred).map((v, i) => {
        return { index: i, value: v };
      });

      predictions = predictions.sort((x, y) =>
        x.value > y.value ? 1 : x.value === y.value ? 0 : -1
      );

      //console.log("sorted predictions");
      //console.log(predictions.slice(0, 10));

      predictions = predictions.reverse();

      //console.log("reverse sorted predictions");
      //console.log(predictions.slice(0, 10));

      let classes = predictions.map(
        v => getClassNames([v.index])[0] + ` (${v.index + 1})`
      );

      let dinos = predictions.map(v => getClassNames([v.index])[0]);

      //console.log("top 5");
      //console.log(classes.slice(0, 5));
      //console.log("top 1");
      //console.log(classes[0]);
      console.log(predictions.slice(0, 5));

      setGuesses([dinos.slice(0, 5)]);
      setSearch(dinos[0]);
      if (onPrediction) onPrediction(dinos[0]);
    }
  };

  const getClassNames = indices => {
    var outp = [];
    for (var i = 0; i < indices.length; i++) outp[i] = classes[indices[i]];
    return outp;
  };

  return (
    <div style={{ width: "100%" }}>
      <button
        style={{ backgroundColor: isDetecting ? "red" : "lightgrey" }}
        onClick={() => setIsDetecting(!isDetecting)}
      >
        toggle detection
      </button>
      <br />
      {/* {guesses} */}
      <div style={{ height: 100, overflowY: "scroll" }}>
        <Information search={search} />
      </div>
    </div>
  );
};

export default Predictor;
