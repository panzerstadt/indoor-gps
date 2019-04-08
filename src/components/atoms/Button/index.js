import React from "react";

// styles
import styles from "./index.module.css";

export const Button = ({ inputs = ["button"], onSubmit }) => {
  if (inputs.length === 1) {
    // if one button, return one button
    return (
      <button
        className={styles.button}
        key={inputs[0]}
        onClick={onSubmit}
        value={inputs[0]}
      >
        {inputs[0]}
      </button>
    );
  }

  const btns = inputs.map((v, i) => {
    // if multiple buttons, make complex button

    if (i === 0) {
      return (
        <button
          className={styles.buttonLeft}
          key={i}
          onClick={onSubmit}
          value={v}
        >
          {v}
        </button>
      );
    } else if (i === inputs.length - 1) {
      return (
        <button
          className={styles.buttonRight}
          key={i}
          onClick={onSubmit}
          value={v}
        >
          {v}
        </button>
      );
    } else {
      return (
        <button className={styles.button} key={i} onClick={onSubmit} value={v}>
          {v}
        </button>
      );
    }
  });

  return <div className={styles.buttonDiv}>{btns}</div>;
};

export default Button;
