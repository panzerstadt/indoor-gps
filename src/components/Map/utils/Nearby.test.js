import { Nearby } from "./Nearby";
import { map } from "rsvp";

it("calculates the right nearby locations", () => {
  expect(Nearby(input, comparisons).map(v => v.index)).toEqual([3, 2, 0, 1]);
  expect(Nearby(inputList, comparisonList).map(v => v.index)).toEqual([
    3,
    1,
    0,
    2
  ]);
});

const input = {
  label: "input",
  lat: 51.013,
  lng: 255.366
};

const comparisons = [
  {
    label: 1,
    lat: 61.354,
    lng: 240.161
  },
  {
    label: 2,
    lat: 60.88,
    lng: 235.766
  },
  {
    label: 3,
    lat: 57.657,
    lng: 245.063
  },
  {
    label: 4,
    lat: 51.011,
    lng: 256.0
  }
];

// test 2
const inputList = [51.013, 255.366];

const comparisonList = [
  [61.354, 240.161],
  [57.657, 245.063],
  [60.88, 235.766],
  [51.011, 256.0]
];
