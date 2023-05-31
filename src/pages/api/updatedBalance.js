import { fetchUserBalance, updateBalance } from "../../lib/databaseHelper";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { userId } = req.body;
    const { balance } = req.body;

    if (!balance) {
      return res.status(400).json({ message: "Amount is required" });
    }

    if (!userId) {
      return res.status(400).json({ message: "clerkid is required" });
    }

    await updateBalance(userId, balance);
    res.status(200).json({ message: "Balance updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
