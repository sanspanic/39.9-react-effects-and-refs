import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import axios from "axios";
import { v4 as uuid } from "uuid";

const CardBoard2 = () => {
  const [cards, setCards] = useState([]);
  const deckId = useRef();
  const intervalId = useRef();
  const [shuffleCount, setShuffleCount] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    try {
      axios
        .get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then((res) => {
          deckId.current = res.data.deck_id;
        });
    } catch (e) {
      console.log(e);
    }
  }, [shuffleCount]);

  const drawCard = () => {
    try {
      const url = `https://deckofcardsapi.com/api/deck/${deckId.current}/draw/?count=1`;
      axios.get(url).then((res) => {
        if (res.data.success) {
          setCards((cards) => [...cards, res.data.cards[0]]);
        } else {
          clearInterval(intervalId.current);
          alert(res.data.error);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const startDrawing = () => {
    setIsDrawing(true);
    intervalId.current = setInterval(() => {
      drawCard();
    }, 1000);
  };

  const shuffle = () => {
    setCards([]);
    setShuffleCount((c) => c + 1);
  };

  const toggleDrawing = () => {
    if (isDrawing === false) {
      startDrawing();
    } else {
      clearInterval(intervalId.current);
      setIsDrawing(false);
    }
  };

  return (
    <>
      <button className="CardBoard-btn" onClick={toggleDrawing}>
        {isDrawing === false ? "Draw" : "Pause"}
      </button>
      <button className="CardBoard-btn" onClick={shuffle}>
        Shuffle
      </button>
      <div className="CardBoard">
        {cards.map((card) => (
          <Card src={card.image} key={uuid()} />
        ))}
      </div>
    </>
  );
};

export default CardBoard2;
