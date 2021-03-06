import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import axios from "axios";
import { v4 as uuid } from "uuid";

const CardBoard = () => {
  const [cards, setCards] = useState([]);
  const deckId = useRef();

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
  }, []);

  const drawCard = () => {
    try {
      const url = `https://deckofcardsapi.com/api/deck/${deckId.current}/draw/?count=10`;
      axios.get(url).then((res) => {
        if (res.data.success) {
          setCards((cards) => [...cards, res.data.cards[0]]);
        } else {
          alert(res.data.error);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <button className="CardBoard-btn" onClick={drawCard}>
        Draw
      </button>
      <div className="CardBoard">
        {cards.map((card) => (
          <Card src={card.image} key={uuid()} />
        ))}
      </div>
    </>
  );
};

export default CardBoard;
