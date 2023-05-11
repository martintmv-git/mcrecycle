import { fetchData } from "../../lib/databaseHelper";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const data = await fetchData();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Error fetching players" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
