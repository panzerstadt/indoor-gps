import React, { useState, useEffect, useContext } from "react";
import * as tf from "@tensorflow/tfjs";

import { useInterval } from "../../useHooks";
import Information from "../Information";

// context api
import { MainContext } from "../../../App";

const SCALE = 1;
const RGB_SCALE = 0.02;
const MODEL = "./assets/models/indoor-gps/model.json";
const CLASSES = "./assets/models/indoor-gps/class_names.txt";

const loadModel = async ({ onProgress }) => {
  // check for model in localstorage
  try {
    const savedModel = await tf.loadLayersModel(
      "indexeddb://indoor-gps-model",
      { onProgress: onProgress }
    );
    onProgress && onProgress(1);
    return savedModel;
  } catch (e) {
    console.log(e);
    console.log(
      "INFO: model has to be places in public folder to be accessible."
    );
    const model = await tf.loadLayersModel(MODEL, { onProgress: onProgress });
    await model.save("indexeddb://indoor-gps-model");
    return model;
  }

  // in public folder
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

const Predictor = ({
  videoRef,
  onProgress,
  onLoaded,
  onSuccess,
  onTrigger
}) => {
  const [predictor, setPredictor] = useState();
  const [classes, setClasses] = useState();
  const [progress, setProgress] = useState(0);
  const handleProgress = v => {
    console.log(v);
    setProgress(v);
    if (onProgress) onProgress(v);
  };
  useEffect(() => {
    const load = async () => {
      const model = await loadModel({ onProgress: handleProgress });
      //console.log("model: ", model);
      const classes = await fetch(CLASSES)
        .then(r => r.text())
        .then(s => {
          const allLines = s.split(/\r\n|\n/);
          return allLines.filter(v => v.length > 1);
        });
      //console.log("classes: ", classes);

      setPredictor(model);
      setClasses(classes);
      if (onLoaded) onLoaded(true);
    };

    load();
  }, []);

  // the thing that runs stuff along on video stream
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionDelay, setDetectionDelay] = useState(300);
  useInterval(
    () => {
      detect();
    },
    isDetecting ? detectionDelay : null
  );

  const [guesses, setGuesses] = useState([]);
  const [topGuess, setTopGuess] = useState("");
  const appState = useContext(MainContext);
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

      predictions = predictions.reverse();

      let dinos = predictions.map(v => ({
        label: getClassNames([v.index])[0],
        score: v.value
      }));

      const s = dinos[0].score;

      if (s > 0.5) {
        const top5 = dinos.slice(0, 5).map(v => v.label);
        const top = dinos[0].label;

        // setstate
        setGuesses([top5]);
        setTopGuess(top);

        // send to parent
        if (onSuccess) onSuccess(top);

        // send to context
        setTimeout(() => {
          appState.setSearch(top);
        }, 1000);

        // end detection loop
        setIsDetecting(false);
      }

      // debug
      //console.log("sorted predictions");
      //console.log(predictions.slice(0, 10));
      //console.log("reverse sorted predictions");
      //console.log(predictions.slice(0, 10));

      // let classes = predictions.map(
      //   v => getClassNames([v.index])[0] + ` (${v.index + 1})`
      // );
      //console.log("top 5");
      //console.log(classes.slice(0, 5));
      //console.log("top 1");
      //console.log(classes[0]);
      console.log(dinos.slice(0, 5));
    }
  };
  useEffect(() => {
    if (onTrigger) {
      setIsDetecting(true);
    }
  }, [onTrigger]);

  const getClassNames = indices => {
    var outp = [];
    for (var i = 0; i < indices.length; i++) outp[i] = classes[indices[i]];
    return outp;
  };

  const readyStateClr = () => {
    if (progress === 1 && isDetecting) return "red";
    else if (progress === 1 && !isDetecting) return "#efefef";
    else return "grey";
  };

  return (
    <div style={{ width: "100%" }}>
      {/* <button
        style={{ backgroundColor: readyStateClr(), textAlign: "center" }}
        onClick={() => (progress === 1 ? setIsDetecting(!isDetecting) : null)}
      >
        toggle detection
      </button>
      <br /> */}
      {progress === 1 ? "" : `model loading: ${(progress * 100).toFixed(2)}%`}
    </div>
  );
};

export default Predictor;
