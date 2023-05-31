import { fetchUserBalance, updateBalance } from "../../lib/databaseHelper";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { clerkId, amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    if (!clerkId) {
      return res.status(400).json({ message: "clerkid is required" });
    }

    console.log("clerkId", clerkId);
    const balance = await fetchUserBalance(clerkId);
    console.log("balance", balance);
    const newUserBalance = balance + amount;
    await updateBalance(clerkId, newUserBalance);

    res.status(200).json({ message: "Balance updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
