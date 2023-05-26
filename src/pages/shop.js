import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "qrcode.react";
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
          setItems(response.data);
          setLoadingData(false); 
        })
        .catch((error) => {
          console.error("Error fetching items: ", error);
          setLoadingData(false); 
        });
    }
  }, [user]);

  const handleItemClick = (item) => {
    if (balance >= item.price) {
      setSelectedItem(item);
    } else {
      alert("You do not have enough points to buy this item.");
    }
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
            <h3>Meal Deals</h3>
          </div>
          <div className="items-list">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="item"
                onClick={() => handleItemClick(item)}
              >
                <h3>{item.name}</h3>
                <p>Price: {item.price}</p>
                {index !== items.length - 1 && (
                  <div style={{ marginRight: "20px" }} />
                )}
              </div>
            ))}
          </div>
          <div className="meal-deals-header">
            <h3>MenuItems</h3>
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
      >
        <h3>{item.name}</h3>
        <p>Price: {item.price}</p>
        {index !== items.length - 1 && (
          <div style={{ marginRight: "20px" }} />
        )}
      </div>
    ))
  )}
</div>
        </div>
        {selectedItem && (
          <div className="qr-code">
            <h2>QR Code for your item:</h2>
            <QRCode value={selectedItem.id.toString()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;