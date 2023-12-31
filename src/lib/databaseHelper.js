import { supabase } from "./supabaseClient";

export async function getUserBalance(userId) {
  const { data, error } = await supabase
    .from("gameData")
    .select("points")
    .eq("clerkId", userId);

  if (error) {
    console.error(error);
    return { error };
  }

  if (!data || data.length === 0) {
    return { error: "User not found." };
  }

  return { balance: data[0].points };
}

export async function updateBalance(clerkId, newBalance) {
  const { error } = await supabase
    .from("gameData")
    .update({ points: newBalance })
    .eq("clerkId", clerkId);

  if (error) {
    console.error(error);
    return { error };
  }

  return { success: true };
}

export async function getUserRankings(userId) {
  const { data, error } = await supabase
    .from("gameData")
    .select("clerkId, points")
    .order("points", { ascending: false });

  if (error) {
    console.error(error);
    return { error };
  }

  const userScore =
    data.find((element) => element.clerkId === userId)?.points || 0;
  const userRank =
    data.findIndex((element) => element.clerkId === userId) + 1 || 0;

  console.log(userScore, userRank);

  return { userScore, userRank };
}

export async function fetchUserBalance(userId) {
  const { data, error } = await supabase
    .from("gameData")
    .select("points")
    .eq("clerkId", userId);
  if (error) {
    console.error(error);
    return { error };
  }

  return { balance: data[0].points };
}

export async function fetchShopItems() {
  const { data, error } = await supabase
    .from("shopItems")
    .select("*")
    .order("price", { ascending: false });

  if (error) {
    console.error(error);
    return { error };
  }

  return { items: data };
}

export async function fetchUserId(clerkId) {
  const { data, error } = await supabase
    .from("gameData")
    .select("id")
    .eq("clerkId", clerkId);

  if (error) {
    console.error(error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return data[0].user_id;
}

export async function fetchData(userId) {
  const { data, error } = await supabase
    .from("gameData")
    .select("*")
    .order("points", { ascending: false });

  if (error) {
    console.error(error);
  } else {
    if (userId) {
      const userRank = data.findIndex((player) => player.id === userId) + 1;
      return { data, userRank };
    }
    return data;
  }
}

export async function fetchItemData() {
  const { data, error } = await supabase
    .from("shopItems")
    .select("*")
    .order("price", { ascending: false });

  if (error) {
    console.error(error);
  }
  return data;
}

export async function fetchSingleItemData(itemId) {
  const { data, error } = await supabase
    .from("shopItems")
    .select("*")
    .eq("id", itemId);

  if (error) {
    console.error(error);
    return null;
  }

  return data ? data[0] : null;
}

export async function insertData(name) {
  const { error } = await supabase.from("gameData").insert({ name });
  if (error) {
    console.error(error);
  } else {
    console.log("inserted");
  }
}

export async function updateData(id, points) {
  const { error } = await supabase
    .from("gameData")
    .update({ points: points })
    .eq("id", id);
  if (error) {
    console.error(error);
  } else {
    console.log("updated");
  }
}

export async function deleteData(id) {
  const { error } = await supabase.from("gameData").delete().eq("id", id);
  if (error) {
    console.error(error);
  } else {
    console.log("deleted");
  }
}
