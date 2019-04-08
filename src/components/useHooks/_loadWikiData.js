const axios = require("axios");
const fs = require("fs");
const papa = require("papaparse");

if (typeof fetch !== "function") {
  global.fetch = require("node-fetch-polyfill");
}
const csv = require("d3-fetch").csv;
const parse = require("d3-dsv").csvParse;

const CSV = "../../dataset/class_coords.csv";

const loadFromCsv = () => {
  let data;
  // encoding needs to be explicit
  return fs.readFileSync(CSV, { encoding: "utf8" }, (err, data) => {
    const d = parse(data);
    //console.log(d);

    return d;
  });
  console.log(r);
};

const saveToJson = json => {
  const data = JSON.stringify(json);
  fs.writeFile("temp.json", data, e => console.log(e));
};

const loadWiki = (list = []) => {
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

    const result = await searchName(v);
    if (!result) return await searchName(v.split(" ")[0]);
    return result;
  });

  const results = Promise.all(promises);

  saveToJson(results);

  return results;
};

const test = async () => {
  const r = await loadFromCsv();

  console.log(r);
};

test();
//oadWiki();
