// api/clerk-webhook.js

import { supabase } from "../lib/databaseHelper";

export default async function handler(req, res) {
  const event = req.body;
  const clerkUserId = event.data.id;

  if (event.type === "user.created") {
    // Check if this Clerk user ID already exists in the database
    let { data: existingUser, error } = await supabase
      .from("ids")
      .select("userId")
      .eq("clerkId", clerkUserId);

    if (error) {
      console.error("Error reading from database:", error);
      return res.status(500).json({ error: "Failed to read from database" });
    }

    // If user doesn't exist, insert new record
    if (!existingUser || existingUser.length === 0) {
      const { error } = await supabase
        .from("ids")
        .insert([{ clerkId: clerkUserId }]);

      if (error) {
        console.error("Error inserting into database:", error);
        return res
          .status(500)
          .json({ error: "Failed to insert into database" });
      }
    }
  }

  return res.status(200).json({ message: "Webhook received" });
}
