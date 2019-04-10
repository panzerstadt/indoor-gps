// wiki

/*
A good indicator that they belong together is that
they are used one after another (e.g. setIsError,
setIsLoading). Let’s combine all three of them
with a Reducer Hook instead.
*/

// useReducer == do similar things together as a group

import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

import styles from "./index.module.css";

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

const WikiSearch = ({ search, onSuccess, ...props }) => {
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
      <p>{data && data[2]}</p>
    </div>
  );
};

const WikiImage = ({ search, onSuccess, ...props }) => {
  const WIKI_IMG_URL = query =>
    `https://en.wikipedia.org/w/api.php?action=query&titles=${query}&prop=pageimages&origin=*&format=json&pithumbsize=100`;

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
    if (search) {
      doFetch(WIKI_IMG_URL(search));
    }
  }, [search]);

  useEffect(() => {
    console.log("data in useEffect");
    console.log(data);
    console.log(performance.now());
    console.log("isUndefined: ", typeof data !== "undefined");
    console.log(data && data.query.pages);

    if (data) {
      console.log("data in useEffect's if statement");
      console.log(data);
      console.log(performance.now());
      console.log("isUndefined: ", typeof data !== "undefined");
      console.log(data.query.pages);

      const response = data.query.pages;

      console.log(data);
      const k = Object.keys(response)[0];
      console.log(k);

      const data = response[k];
      let out;
      if (!data.thumbnail) {
        out = "#";
      } else {
        out = data.thumbnail.source;
      }

      console.log(out);
    }
  }, [data]);

  return (
    <div {...props}>
      <div
        className={styles.loadingOrError}
        style={{ display: !isLoading && !error ? "none" : "block" }}
      >
        <LoadingOrEror />
      </div>
      <img src="#" height={300} alt="img" />
    </div>
  );
};

const InformationCard = ({ search, showImage = false }) => {
  const dinoSearch = search.split(" ")[0];
  const [wikiPage, setWikiPage] = useState("");

  const handleSearchSuccess = data => {
    const wikiPageTitle = data && data[1] && data[1][0];
    setWikiPage(wikiPageTitle);
  };

  return (
    <div>
      {showImage && <WikiImage search={wikiPage} />}
      <WikiSearch search={dinoSearch} onSuccess={handleSearchSuccess} />
    </div>
  );
};

export default InformationCard;
