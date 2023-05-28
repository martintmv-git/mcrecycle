import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import Image from "next/image";
import GameInfo from "../components/GameInfo";
import { FaQuestion, FaTimes } from "react-icons/fa";

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
          setBalance(response.data.balance);
        })
        .catch((error) => {
          console.error("Error fetching balance: ", error);
        });

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

  return (
    <div className="leaderboard-container">
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
            {items.map((item, index) => (
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
              items.map((item, index) => (
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