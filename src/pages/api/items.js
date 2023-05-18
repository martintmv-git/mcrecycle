import { fetchShopItems } from "../../lib/databaseHelper";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { items, error } = await fetchShopItems();

  if (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the items." });
  }

  return res.status(200).json(items);
}
