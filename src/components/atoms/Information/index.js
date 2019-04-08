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

const WIKI_URL = query =>
  `https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=${query}&format=json`;

// grouped state
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        error: ""
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    default:
      throw new Error("dunno what to do with this condition");
  }
};

const useFetch = (initialUrl, initialData) => {
  const INIT = { hits: [] };
  const [data, setData] = useState(initialData || INIT);
  const [url, setUrl] = useState(
    initialUrl || "http://hn.algolia.com/api/v1/search?query=redux"
  );

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

    fetchData();

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

const FetchAndDisplay = ({ search }) => {
  const [query, setQuery] = useState("redux");
  const { data, isLoading, error, doFetch } = useFetch(
    "https://hn.algolia.com/api/v1/search?query=redux",
    { hits: [] }
  );

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
    // TODO: currently simplifying search
    doFetch(WIKI_URL(search.split(" ")[0]));
  }, [search]);

  return (
    <>
      <div className={styles.loadingOrError}>
        <LoadingOrEror />
      </div>

      <p>{data[2]}</p>

      {/* <ul>{JSON.stringify(data)}</ul> */}
    </>
  );

  return (
    <>
      <form
        style={{ width: "100%" }}
        onSubmit={e => {
          e.preventDefault();
          doFetch(WIKI_URL(query));
        }}
      >
        <input
          className={styles.input}
          type="text"
          value={search || query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className={styles.submit} type="Submit">
          Search
        </button>
      </form>

      <div className={styles.loadingOrError}>
        <LoadingOrEror />
      </div>

      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default FetchAndDisplay;
