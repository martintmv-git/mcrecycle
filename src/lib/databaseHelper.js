import { supabase } from "./supabaseClient";

export async function fetchData() {
  const { data, error } = await supabase.from("gameData").select("*");
  if (error) {
    console.error(error);
  } else {
    console.log(data);
	return data;
  }
}

export async function insertData(points) {
	const { error } = await supabase.from("gameData").insert({points})
	if (error) {
		console.error(error)
	} else {
		console.log("inserted")
	}
}


export async function updateData(id, points) {
	const { error } = await supabase.from("gameData").update({points: points}).eq("id", id)
	if (error) {
		console.error(error)
	} else {
		console.log("updated")
	}
}

export async function deleteData(id) {
	const { error } = await supabase.from("gameData").delete().eq("id", id)
	if (error) {
		console.error(error)
	} else {
		console.log("deleted")
	}
}