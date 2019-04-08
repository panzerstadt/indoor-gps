import { useState, useEffect, useRef } from "react";
import { csv } from "d3-fetch";
import axios from "axios";

export const useCsvData = initialFilepath => {
  const [data, setData] = useState([]);
  const loadCsv = f => {
    csv(f).then(data => {
      setData(data);
    });
  };

  useEffect(() => {
    if (initialFilepath) {
      loadCsv(initialFilepath);
    }
  }, []);

  const [filepath, setFilepath] = useState();

  useEffect(() => {
    if (filepath) {
      loadCsv(filepath);
    }
  }, [filepath]);

  return [data, setFilepath];
};

export const useWiki = (search = "dinosaur") => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(search);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const WIKI = `https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=${query}&format=json`;

    setLoading(true);
    axios
      .get(WIKI)
      .then(data => {
        setResults(data.data);
        setLoading(false);
      })
      .catch(e => console.log(e));
  }, [query]);

  return [results, setQuery];
};

export const useMultipleWiki = (list = []) => {
  const promises = list.map(async v => {
    const searchName = async v => {
      const r = await axios.get(EXTRACT(v));
      const page = r.data.query.pages;
      const pageKey = Object.keys(page)[0];
      if (pageKey !== -1) {
        return page[pageKey].extract;
      } else return false;
    };
    const EXTRACT = v =>
      `https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${v}`;
    const WIKI = `https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=${v}&format=json`;

    const result = await searchName(v);
    if (!result) return await searchName(v.split(" ")[0]);
    return result;
  });

  const results = Promise.all(promises);

  return results;
};

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
