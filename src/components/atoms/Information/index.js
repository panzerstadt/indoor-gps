// useReducer == do similar things together as a group

import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

import styles from "./index.module.css";

// no img dinosaur
import NoImg from "./assets/no-dino.jpg";

// grouped state
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        error: ""
      };
      break;
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        data: action.payload
      };
      break;
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
      break;
    default:
      throw new Error("dunno what to do with this condition");
  }
};

export const useFetch = (initialUrl, initialData) => {
  const [data, setData] = useState(initialData || null);
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    // dataFetchReducer is the action
    // this here is the initial state
    isLoading: false,
    error: "",
    data: initialData
  });

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });

      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (e) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE", payload: e.message });
        }
      }
    };

    if (url) {
      fetchData();
    }

    return () => {
      // if it unmounts, this returns true
      // thereby skipping FETCH_SUCCESS / FETCH_FAILURE
      didCancel = true;
    };
  }, [url]);

  const doFetch = url => {
    setUrl(url);
  };

  return { ...state, doFetch };
};

const WikiDescription = ({ search, onSuccess, ...props }) => {
  const WIKI_URL = query =>
    `https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=${query}&format=json`;

  const { data, isLoading, error, doFetch } = useFetch();

  const LoadingOrEror = () => {
    if (!isLoading && !error) {
      return null;
    } else if (isLoading && !error) {
      return <div>Loading...</div>;
    } else if (error) {
      return <div style={{ color: "red" }}>{error}</div>;
    } else {
      return null;
    }
  };

  useEffect(() => {
    doFetch(WIKI_URL(search));
  }, [search]);

  useEffect(() => {
    if (data) {
      if (onSuccess) onSuccess(data);
    }
  }, [data]);

  //console.log(data && data[1] && data[1][0]);

  return (
    <div {...props}>
      <div
        className={styles.loadingOrError}
        style={{ display: !isLoading && !error ? "none" : "block" }}
      >
        <LoadingOrEror />
      </div>
      {data && data[2]}
    </div>
  );
};

const WikiImage = ({ search, onSuccess, thumbnailSize = 300, ...props }) => {
  const WIKI_IMG_URL = query =>
    `https://en.wikipedia.org/w/api.php?action=query&titles=${query}&prop=pageimages&origin=*&format=json&pithumbsize=${thumbnailSize}`;

  const { data, isLoading, error, doFetch } = useFetch();

  const LoadingOrEror = () => {
    if (!isLoading && !error) {
      return null;
    } else if (isLoading && !error) {
      return <div>Loading...</div>;
    } else if (error) {
      return <div style={{ color: "red" }}>{error}</div>;
    } else {
      return null;
    }
  };

  // effect for fetching data
  useEffect(() => {
    if (search) {
      doFetch(WIKI_IMG_URL(search));
    }
  }, [search]);

  // effect for replacing img src
  const [src, setSrc] = useState(NoImg);
  useEffect(() => {
    if (data) {
      const response = data.query.pages;
      const k = Object.keys(response)[0];
      const d = response[k];
      let out;
      if (!d.thumbnail) {
        //out = "#";
        // replacement image?
        setSrc(NoImg);
      } else {
        setSrc(d.thumbnail.source);
        //out = data.thumbnail.source;
      }
    }
  }, [data]);

  return (
    <div {...props}>
      <div
        className={styles.loadingOrError}
        style={{
          display: !isLoading && !error ? "none" : "flex"
        }}
      >
        <LoadingOrEror />
      </div>
      <img className={styles.img} src={src} height={100} alt="img" />
    </div>
  );
};

const InformationCard = ({
  search,
  showImage = false,
  showDescription = true,
  onClick
}) => {
  const dinoSearch = search.split(" ").filter(v => v.length > 5)[0];
  const [wikiPage, setWikiPage] = useState("");
  const [url, setUrl] = useState("#");

  const handleSearchSuccess = data => {
    const wikiPageTitle = data && data[1] && data[1][0];
    setWikiPage(wikiPageTitle);
    setUrl(data && data[3][0]);
  };

  return (
    <a className={styles.infoCard} href={url} target="_blank">
      {showImage && <WikiImage search={wikiPage} />}
      <div className={styles.infoContainer}>
        <h5 className={styles.title}>{search}</h5>
        <div className={styles.gradient}> </div>
        {showDescription && (
          <WikiDescription
            className={styles.text}
            search={dinoSearch}
            onSuccess={handleSearchSuccess}
          />
        )}
      </div>
    </a>
  );
};

export default InformationCard;
