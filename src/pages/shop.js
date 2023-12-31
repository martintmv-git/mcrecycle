import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import Image from "next/image";
import GameInfo from "../components/GameInfo";
import { FaQuestion, FaTimes } from "react-icons/fa";
import Head from "next/head";

const Shop = () => {
  const [balance, setBalance] = useState(0);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setLoadingData(true);

      axios
        .get(`/api/balance?userId=${user.id}`)
        .then((response) => {
          setBalance(response.data.balance["balance"]);
        })
        .catch((error) => {
          console.error("Error fetching balance: ", error);
        });
      console.log(balance);
      axios
        .get("/api/items")
        .then((response) => {
          const updatedItems = response.data.map((item) => {
            return {
              ...item,
              imageUrl: `url-for-image-${item.id}`,
            };
          });
          setItems(updatedItems);
          setLoadingData(false);
        })
        .catch((error) => {
          console.error("Error fetching items: ", error);
          setLoadingData(false);
        });
    }
  }, [user]);

  const handleItemClick = (item) => {
    router.push(`/item/${item.id}`);
  };

  const handleLeftButtonClick = () => {
    router.push("/");
  };

  const handleOverlayToggle = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  const firstRowItems = items.slice(0, 3);
  const secondRowItems = items.slice(3, 6);

  return (
    <div className="leaderboard-container">
      <Head>
        <title>Shop</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="leaderboard" style={{ overflowX: "hidden" }}>
        <div className="navbar">
          <button className="left-button" onClick={handleLeftButtonClick}>
            Back
          </button>
          <button className="right-button" onClick={handleOverlayToggle}>
            {isOverlayOpen ? <FaTimes /> : <FaQuestion />}
          </button>
          <div className="logo">
            <Image src="/shop.png" alt="Shop logo" width={152} height={129} />
          </div>
        </div>
        {isOverlayOpen && (
          <div className="overlay" onClick={handleOverlayToggle}>
            <GameInfo />
          </div>
        )}
        <div className="balance-header">
          <div className="balance-left">Your balance</div>
          <div className="balance-right">{balance}</div>
        </div>
        <div className="items-container">
          <div className="meal-deals-header">
            <h3>Menu Deals</h3>
          </div>
          <div className="items-list">
            {firstRowItems.map((item, index) => (
              <div
                key={item.id}
                className="item"
                onClick={() => handleItemClick(item)}
                style={{ backgroundImage: `url(/item${index + 1}.jpg)` }}
              >
                <h2 className="menu-title">{item.name}</h2>
                <h3 className="menu-price">{item.price} POINTS</h3>
                <br></br>
                {index !== items.length - 1 && (
                  <div style={{ marginRight: "20px" }} />
                )}
              </div>
            ))}
          </div>
          <div className="menu-deals-header">
            <h3>Meal Items</h3>
          </div>
          <div className="items-list">
            {loadingData ? (
              <div className="loader"></div>
            ) : (
              secondRowItems.map((item, index) => (
                <div
                  key={item.id}
                  className="item"
                  onClick={() => handleItemClick(item)}
                  style={{ backgroundImage: `url(/menuitem${index + 1}.jpg)` }}
                >
                  <h2 className="menu-title">{item.name}</h2>
                  <h3 className="menu-price">{item.price} POINTS</h3>
                  <br></br>
                  {index !== items.length - 1 && (
                    <div style={{ marginRight: "20px" }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
