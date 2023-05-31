import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode.react";
import axios from "axios";
import { useRouter } from "next/router";
import itemData from "../../lib/itemData";
import { useUser } from "@clerk/clerk-react";
import Image from "next/image";
import { FaDownload } from "react-icons/fa";

const ItemPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [balance, setBalance] = useState(0); // don't forget to change to 0 for production
  const [showQR, setShowQR] = useState(false);
  let qrCodeRef = useRef(); // ref
  let canvasRef = useRef(); // additional canvas

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

  const handleLeftButtonClick = () => {
    router.push("/shop");
  };

  const handleRightButtonClick = () => {
    if (showQR) {
      const canvas = qrCodeRef.current.querySelector("canvas");
      const qrCodeData = canvas.toDataURL("image/png");

      // Draw the QR code and label on the new canvas
      const downloadCanvas = canvasRef.current;
      const ctx = downloadCanvas.getContext("2d");

      // Load the custom background image
      const bgImage = new window.Image();
      bgImage.onload = () => {
        // Draw the background image on the canvas
        ctx.drawImage(
          bgImage,
          0,
          0,
          downloadCanvas.width,
          downloadCanvas.height
        );

        // Draw the QR code on the canvas
        const image = new window.Image();
        image.onload = () => {
          const x = (downloadCanvas.width - image.width) / 2;
          const y = (downloadCanvas.height - image.height) / 2;

          ctx.drawImage(image, x, y);

          // Add the label under the QR code
          ctx.font = "20px Arial";
          ctx.fillStyle = "black";
          const textWidth = ctx.measureText(selectedItem.name).width;
          const textX = (downloadCanvas.width - textWidth) / 2;
          const textY = y + image.height + 30;

          ctx.fillText(selectedItem.name, textX, textY);

          // Save the canvas as a PNG
          const pngUrl = downloadCanvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");

          let downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = "QRCode.png";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };
        image.src = qrCodeData;
      };
      bgImage.src = "/qr-background.png";
    }
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard" style={{ overflowX: "hidden" }}>
        <div className="navbar">
          <button className="left-button" onClick={handleLeftButtonClick}>
            Back
          </button>
          <button className="left-button" onClick={handleRightButtonClick}>
            <FaDownload /> QR
          </button>
          <div className="logo">
            <Image src="/shop.png" alt="Shop logo" width={152} height={129} />
          </div>
        </div>

        <div className="balance-header">
          <div className="balance-left">Your balance</div>
          <div className="balance-right">{balance}</div>
        </div>
        <br></br>
        {!imageLoaded && <div className="loader"></div>}
        <div className="uniqueItemContainer">
          <div className="uniqueItemImageContainer">
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={350}
              height={420}
              onLoad={() => setImageLoaded(true)}
            />
            {imageLoaded && !showQR && (
              <div className="uniqueItemTextOverlay">
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <p>{item.price} points</p>
                <button
                  className="buy-button"
                  onClick={() => {
                    if (balance >= item.price) {
                      setSelectedItem(item);
                      setShowQR(true); // toggle QR code visibility
                    } else {
                      alert("You don't have enough balance");
                    }
                  }}
                >
                  Buy Item
                </button>
              </div>
            )}

            {showQR && (
              <div className="qr-code" ref={qrCodeRef}>
                <h2>QR Code for your item:</h2>
                <QRCode value={selectedItem.id.toString()} renderAs="canvas" />
                <button
                  className="back-to-game-button"
                  onClick={() => router.push("/")}
                >
                  BACK TO GAME
                </button>
                <canvas
                  ref={canvasRef}
                  style={{ display: "none" }}
                  width={300}
                  height={350}
                ></canvas>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;