import { updateBalance } from "../../lib/databaseHelper";
import { withApiHandler } from "@clerk/clerk-sdk-node";

const handler = async (req, res) => {
  const { clerkId, newBalance } = req.body;

  if (!clerkId || !newBalance) {
    return res
      .status(400)
      .json({ error: "clerkId and newBalance are required." });
  }

  const result = await updateBalance(clerkId, newBalance);

  if (result.error) {
    console.log(result.error);
    return res.status(500).json({ error: result.error });
  }

  return res.status(200).json({ success: true });
};

export default withApiHandler(handler);
