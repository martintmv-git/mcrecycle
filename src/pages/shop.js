import { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "qrcode.react";

const Shop = () => {
  const [balance, setBalance] = useState(0);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    // You should replace this with your actual API endpoint
    axios
      .get("YOUR_API/user/balance")
      .then((response) => {
        setBalance(response.data.balance);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

    // Fetching items from your API
    axios
      .get("YOUR_API/shop/items")
      .then((response) => {
        setItems(response.data.items);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handleItemClick = (item) => {
    if (balance >= item.price) {
      setSelectedItem(item);
    } else {
      alert("You do not have enough points to buy this item.");
    }
  };

  return (
    <div>
      <h2>Your balance: {balance}</h2>
      <div>
        {items.map((item) => (
          <div key={item.id} onClick={() => handleItemClick(item)}>
            <h3>{item.name}</h3>
            <p>Price: {item.price}</p>
          </div>
        ))}
      </div>
      {selectedItem && (
        <div>
          <h2>QR Code for your item:</h2>
          <QRCode value={selectedItem.id.toString()} />
        </div>
      )}
    </div>
  );
};

export default Shop;
