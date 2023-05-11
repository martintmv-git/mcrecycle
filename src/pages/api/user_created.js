// pages/api/user_created.js
import { insertData } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user } = req.body;

    try {
      await insertData(user.first_name);
      res.status(200).json({ message: "User created successfully." });
    } catch (error) {
      res.status(500).json({ error: "Error creating user." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
