// calculates by grid distance
// takes objects with lat and lng
// returns closest objects by indices
export const Nearby = (first, others) => {
  let output = others.map((v, i) => {
    let dist;
    if (Array.isArray(first)) {
      dist = Math.sqrt(
        Math.pow(first[0] - v[0], 2) + Math.pow(first[1] - v[1], 2)
      );
    } else
      dist = Math.sqrt(
        Math.pow(first.lat - v.lat, 2) + Math.pow(first.lng - v.lng, 2)
      );
    return { index: i, value: dist };
  });

  output.sort((x, y) => (x.value > y.value ? 1 : -1));

  return output;

  return output.map(v => v.index);
};
