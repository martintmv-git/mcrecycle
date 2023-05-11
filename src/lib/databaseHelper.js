import { supabase } from "./supabaseClient";

export async function fetchData(userId) {
  const { data, error } = await supabase.from('gameData').select('*').order('points', { ascending: false });

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


export async function insertData(name, points) {
  const { error } = await supabase.from("gameData").insert({ name, points });
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
