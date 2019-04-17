import { useState, useEffect, useRef } from "react";
import { csv } from "d3-fetch";
import axios from "axios";

// image assets folder path
const dinoImgs = importAll(
  require.context("../../assets/images", true, /.*\.jpg$/)
);

export function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
    return null;
  });
  //console.log(images);
  return images;
}

export const useCsvData = initialFilepath => {
  // loading logic
  const [filepath, setFilepath] = useState(initialFilepath);
  useEffect(() => {
    if (filepath) {
      loadCsv(filepath);
      loadImgs();
    }
  }, [filepath]);

  const [data, setData] = useState([]);
  const loadCsv = f => {
    csv(f).then(data => {
      setData(data);
    });
  };
  const [imgs, setImgs] = useState([]);
  const loadImgs = f => {
    const keys = Object.keys(dinoImgs);
    const sortedKeys = keys.sort((prev, next) => {
      const n = parseInt(next.replace("_", ""));
      const p = parseInt(prev.replace("_", ""));
      return p - n; // earliest first
    });
    setImgs(sortedKeys.map(k => dinoImgs[k]));
  };

  // combine both data
  const [output, setOutput] = useState([]);
  useEffect(() => {
    if (data.length > 0 && imgs.length > 0) {
      if (data.length !== imgs.length) {
        throw "number of dinosaur data don't match number of dinosaur images!";
      }
      const out = data.map((v, i) => ({ ...v, img: imgs[i] }));
      setOutput(out);
    }
  }, [data, imgs]);

  return [output, setFilepath];
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

export const useDebounce = (value, delay) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
};
