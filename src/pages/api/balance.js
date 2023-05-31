import {
  fetchUserId,
  fetchUserBalance,
  getUserBalance,
} from "../../lib/databaseHelper";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const clerkId = req.query.userId;

  if (!clerkId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  console.log(clerkId);
  const balance = await getUserBalance(clerkId);

  console.log(balance);
  if (balance === null) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the balance." });
  }

  return res.status(200).json({ balance });
}
