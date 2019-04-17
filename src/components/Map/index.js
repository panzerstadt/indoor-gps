import React, { useState, useContext } from "react";

// styles
import styles from "./index.module.css";

// components
import LeafletMap from "./components/LeafletMap";

// context
import { MainContext } from "../../App";

export default ({ data, children }) => {
  const appState = useContext(MainContext);
  const { cardOffsetTop } = appState;

  return (
    <div className={styles.main}>
      <div className={styles.map}>
        <LeafletMap height={cardOffsetTop + 10} />
      </div>

      {<div style={{ zIndex: 2, pointerEvents: "none" }}>{children}</div>}
    </div>
  );
};
