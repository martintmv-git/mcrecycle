import { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "qrcode.react";
import { useUser } from "@clerk/clerk-react"; // import useUser hook

const Shop = () => {
  const [balance, setBalance] = useState(0);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const { user } = useUser();

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

      axios
        .get("/api/items")
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          console.error("Error fetching items: ", error);
        });
    }
  }, [user]); // add user to dependency array

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
