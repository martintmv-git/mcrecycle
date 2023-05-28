// api/clerk-webhook.js

import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  const event = req.body;
  const clerkUserId = event.data.id;
  const clerkName = event.data.name;

  if (event.type === "user.created") {
    // Check if this Clerk user ID already exists in the database
    let { data: existingUser, error } = await supabase
      .from("gameData")
      .select("id")
      .eq("clerkId", clerkUserId);

    if (error) {
      console.error("Error reading from database:", error);
      return res.status(500).json({ error: "Failed to read from database", message: error });
    }

    // If user doesn't exist, insert new record
    if (!existingUser || existingUser.length === 0) {
      const { error } = await supabase
        .from("gameData")
        .insert([{ points: 0, name: clerkName, clerkId: clerkUserId }]);
      console.log(clerkName, "created")
      console.log(event)
      console.log(event.data)
      console.log(event.data.name)
      if (error) {
        console.error("Error inserting into database:", error);
        return res
          .status(500)
          .json({ error: "Failed to insert into database", message: error });
          console.error(error);
      }
    }
  }

  return res.status(200).json({ message: "Webhook received" });
}
