import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import axios from "axios";
import { useRouter } from 'next/router'
import itemData from "../itemData";
import { useUser } from "@clerk/clerk-react";
import Image from "next/image";
import GameInfo from "../../components/GameInfo";
import { FaQuestion, FaTimes } from "react-icons/fa";

const ItemPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [balance, setBalance] = useState(0);

  // Find the item with the matching id
  const item = itemData.find((item) => item.id === id);

  useEffect(() => {
    if (user) {
      axios
        .get(`/api/balance?userId=${user.id}`)
        .then((response) => {
          setBalance(response.data.balance);
        })
        .catch((error) => {
          console.error("Error fetching balance: ", error);
        });
    }
  }, [user]);

  if (!item) {
    return <div>Loading...</div>;
  }

  const handleLeftButtonClick = () => {
    router.push("/shop");
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
        <br></br>
        <div className="uniqueItemContainer">
          <div className="uniqueItemImageContainer">
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={350}
              height={420}
            />
            <div className="uniqueItemTextOverlay">
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <p>{item.price} points</p>
              <button
                className="buy-button"
                onClick={() => {
                  if (balance >= item.price) {
                    setSelectedItem(item);
                  } else {
                    alert("You don't have enough balance");
                  }
                }}
              >
                Buy Item
              </button>
            </div>
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

export default ItemPage;