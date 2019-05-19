import React from "react";

// styles
import styles from "./index.module.css";

export const Button = ({ inputs = ["button"], onSubmit }) => {
  if (inputs.length === 1) {
    // if one button, return one button
    return (
      <button
        className={styles.button}
        key={inputs[0].value || inputs[0]}
        onClick={onSubmit}
        value={inputs[0].value || inputs[0]}
      >
        {inputs[0].logo || inputs[0]}
      </button>
    );
  }

  const btns = inputs.map((v, i) => {
    // if multiple buttons, make complex button

    let logo;
    if (v.logo && typeof v.logo === "function") {
      logo = <v.logo fill="#336699" height={50} width={50} />;
    } else {
      logo = v.logo || v;
    }

    if (i === 0) {
      return (
        <button
          className={styles.buttonLeft}
          key={i}
          onClick={e => onSubmit({ ...e, value: v.value || v })}
          value={v.value || v}
        >
          {logo}
        </button>
      );
    } else if (i === inputs.length - 1) {
      return (
        <button
          className={styles.buttonRight}
          key={i}
          onClick={e => onSubmit({ ...e, value: v.value || v })}
          value={v.value || v}
        >
          {logo}
        </button>
      );
    } else {
      return (
        <button
          className={styles.button}
          key={i}
          onClick={e => onSubmit({ ...e, value: v.value || v })}
          value={v.value || v}
        >
          {logo}
        </button>
      );
    }
  });

  return <div className={styles.buttonDiv}>{btns}</div>;
};

export default Button;
