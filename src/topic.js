// const themes = [
//   "anime",
//   "cartoon",
//   "illustration",
//   "vector",
//   "photo",
//   "drawing",
//   "painting",
//   "digital",
//   "art",
//   "graphic",
//   "design",
//   "line art",
//   "sketch",
// ];

const type = [
  "tree",
  "mountain",
  "nature",
  "flower",
  "landscape",
  "ocean",
  "forest",
  "desert",
  "water",
  "sky",
  "beach",
  "sun",
  "moon",
];
const theme = ["illustration", "painting", "photo", "drawing"];

export const getTopic = () => {
  // return { detail: "drawing", isPhoto: false };
  const ran = Math.round(Math.random());
  if (ran === 0) {
    const randomIndex = Math.floor(Math.random() * type.length);

    return { detail: type[randomIndex], isPhoto: true };
  } else {
    const randomIndex = Math.floor(Math.random() * theme.length);

    return { detail: theme[randomIndex], isPhoto: false };
  }
};
