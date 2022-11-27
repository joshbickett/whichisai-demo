import robot from "./assets/robot.png";

import "./App.css";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { getAIImage, getNormalImages } from "./api";
import { getTopic } from "./topic";

const App = () => {
  const gradient = useMemo(
    () => [
      "#000000",
      "#0a0a0a",
      "#141414",
      "#1f1f1f",
      "#292929",
      "#333333",
      "#3d3d3d",
      "#474747",
      "#515151",
      "#5b5b5b",
      "#666666",
      "#707070",
      "#7a7a7a",
      "#848484",
      "#8e8e8e",
      "#999999",
    ],
    []
  );

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("");
  const [resultMessage, setResultMessage] = useState(null);
  const [realImgOpacity, setRealImgOpacity] = useState(0);
  const [aiImgOpacity, setAiImgOpacity] = useState(0);
  const [scoreBackgroundColor, setScoreBackgroundColor] = useState("#76A5BE");
  const [scoreScale, setScoreScale] = useState("1.0");

  const play = async () => {
    setShowButton(false);
    setLoading(true);
    setImages([]);
    setRealImgOpacity(0);
    setAiImgOpacity(0);
    const topic = getTopic();

    let normalImgs = await getNormalImages(topic);
    let aiImages = await getAIImage(topic);

    const imgs = createImgArray(normalImgs, aiImages);

    setTheme(topic.detail);

    setImages(imgs);

    setTimeout(() => {
      setLoading(false);
      setRealImgOpacity(1);
      setAiImgOpacity(1);
    }, 200);
  };

  const createImgArray = (normalImages, aiImages) => {
    let randomIndex = Math.floor(Math.random() * aiImages.length);
    let randomAIImage = aiImages[randomIndex];

    // add 10 of the random normal images into an array and don't allow duplicates
    let normalImgs = [];
    for (let i = 0; i < 5; i++) {
      let randomIndex = Math.floor(Math.random() * normalImages.length);
      let randomNormalImage = normalImages[randomIndex];

      if (!normalImgs.includes(randomNormalImage)) {
        normalImgs.push(randomNormalImage);
      }
    }

    let imgArr = normalImgs.map((img) => {
      return {
        url: img.urls.small,
        isAI: false,
      };
    });

    const imageSmall = randomAIImage.srcSmall;
    const lexica = randomAIImage.gallary;
    const imageLarge = randomAIImage.src;

    imgArr.push({
      url: imageSmall,
      isAI: true,
      lexica: lexica,
      originalSrc: imageLarge,
    });
    imgArr = imgArr.sort(() => Math.random() - 0.5);

    return imgArr;
  };

  const [showFooter, setShowFooter] = useState(false);

  const [showButton, setShowButton] = useState(true);
  const [score, setScore] = useState(0);
  const showButtonRef = useRef(showButton);
  showButtonRef.current = showButton;

  const directionRef = useRef("up");

  const updateButtonColor = useCallback(
    (index) => {
      if (!showButtonRef.current) return;
      const newColor = gradient[index];

      document.getElementById("play-button").style.backgroundColor = newColor;

      if (index === gradient.length - 1) directionRef.current = "down";
      else if (index === 0) directionRef.current = "up";

      setTimeout(() => {
        if (directionRef.current === "up") updateButtonColor(index + 1);
        else updateButtonColor(index - 1);
      }, 50);
    },
    [gradient]
  );

  useEffect(() => {
    updateButtonColor(0);
  }, [updateButtonColor]);

  const scored = () => {
    const scoreMessage = ["You got it!", "Correct!", "Nice!", "Good job!"];
    // select a message at random
    const randomIndex = Math.floor(Math.random() * scoreMessage.length);
    const message = scoreMessage[randomIndex];
    setResultMessage(message);
    setScore(score + 1);
    setScoreScale("1.1");
    setTimeout(() => {
      setScoreScale("1.0");
    }, 500);
  };
  const disappearingScoreScale = (i) => {
    const scales = [
      "1.0",
      "0.9",
      "0.8",
      "0.7",
      "0.6",
      "0.5",
      "0.4",
      "0.3",
      "0.2",
      "0.1",
      "0.0",
      "1.0",
    ];
    const scale = scales[i];
    setScoreScale(scale);
    if (i < scales.length - 1) {
      setTimeout(() => {
        disappearingScoreScale(i + 1);
      }, 50);
    }
  };

  const lose = () => {
    const loseMessage = ["Wrong!", "Nope!", "Incorrect!"];
    // select a message at random
    const randomIndex = Math.floor(Math.random() * loseMessage.length);
    let message = loseMessage[randomIndex];
    message += " start over!!";
    setResultMessage(message);
    setScore(0);
    disappearingScoreScale(0);
    setScoreBackgroundColor("red");
    setScoreScale("0.9");
    setTimeout(() => {
      setScoreBackgroundColor("#76A5BE");
    }, 600);
  };

  return (
    <div>
      {showButton && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "30px 10px",
          }}
        >
          <img
            src={robot}
            alt="logo"
            style={{
              width: "75px",
              borderRadius: "35px",
              margin: "20px 0",
            }}
          />

          <h1 style={{ margin: 0, padding: 0 }}>Which Is AI</h1>
          <h3 style={{ margin: "15px", padding: 0 }}>The game</h3>

          <p style={{ margin: "5px 0", padding: 0, textAlign: "center" }}>
            Find the AI-generated image out of the images displayed
          </p>

          <button
            style={{
              fontSize: "50px",
              margin: "50px 0",
              padding: "25px",
              backgroundColor: gradient[0],
              color: "white",
              borderRadius: "10px",
              cursor: "pointer",
            }}
            onMouseEnter={() => {
              const button = document.getElementById("play-button");
              button.style.scale = "1.1";
            }}
            onMouseLeave={() => {
              const button = document.getElementById("play-button");
              button.style.scale = "1";
            }}
            id="play-button"
            onClick={() => play()}
          >
            PLAY
          </button>
        </div>
      )}
      {theme && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            Theme
            <div
              style={{
                backgroundColor: "#181D20",
                color: "white",
                padding: "10px 20px",
                borderRadius: "10px",
                margin: "5px",
              }}
            >
              {theme}
            </div>
          </div>
          <img
            src={robot}
            alt="logo"
            style={{ width: "75px", borderRadius: "35px", margin: "20px 0" }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: scoreBackgroundColor,
                color: "white",
                padding: "10px 20px",
                borderRadius: "10px",
                margin: "5px",
                scale: scoreScale,
              }}
            >
              {score}
            </div>
            Score
          </div>
        </div>
      )}

      {!showButton && !resultMessage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
          className="images-container"
        >
          {loading && (
            <img
              src={robot}
              alt="loading"
              className="App-logo"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                margin: "50px",
              }}
            />
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              flexDirection: "row",
            }}
          >
            {images.map((image, index) => (
              <img
                src={image.url}
                key={index}
                alt="logo"
                style={{
                  margin: "10px",
                  cursor: "pointer",
                  width: "250px",
                  opacity: image.isAI ? aiImgOpacity : realImgOpacity,
                }}
                onMouseEnter={() => {
                  const img = document.getElementById(`img-${index}`);
                  img.style.scale = "1.1";
                }}
                onMouseLeave={() => {
                  const img = document.getElementById(`img-${index}`);
                  img.style.scale = "1";
                }}
                id={`img-${index}`}
                onClick={() => {
                  console.log("clicked");
                  console.log("image", image);
                  setRealImgOpacity(0);

                  setTimeout(() => {
                    if (image.isAI) scored();
                    else lose();
                  }, 1000);
                }}
              />
            ))}
          </div>
        </div>
      )}
      {resultMessage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>{resultMessage}</h3>

          {images
            .filter((image) => image.isAI)
            .map((image, index) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                key={index}
              >
                <p style={{ fontSize: "10px" }}>
                  See <a href={image.originalSrc}>AI image</a> on{" "}
                  <a href="https://lexica.art/">Lexica.art</a>
                </p>

                <img
                  src={image.url}
                  key={index}
                  alt="winner"
                  style={{ width: "250px", margin: "10px" }}
                />
              </div>
            ))}

          <div
            onClick={() => {
              setResultMessage(null);
              play();
            }}
            // add a nice blue  background
            style={{
              borderRadius: "10px",
              cursor: "pointer",
              padding: "10px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            {score > 0 ? "Next" : "Play again"}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
