import React, { useState } from "react";

// styles
import styles from "./index.module.css";

// components
import LeafletMap from "./components/LeafletMap";

export default ({ data, children }) => {
  return (
    <div className={styles.main}>
      <div className={styles.map}>
        <LeafletMap height="100%" />
      </div>

      {<div style={{ zIndex: 2, pointerEvents: "none" }}>{children}</div>}
    </div>
  );
};
