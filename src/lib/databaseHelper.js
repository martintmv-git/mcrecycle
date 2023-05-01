import { supabase } from "./supabaseClient";

async function fetchData() {
  const { data, error } = await supabase.from("gameData").select("*");
  if (error) {
    console.error(error);
  } else {
    console.log(data);
	return data;
  }
}

async function insertData(points) {
	const { error } = await supabase.from("gameData").insert({points})
	if (error) {
		console.error(error)
	} else {
		console.log("inserted")
	}
}


async function updateData(id, points) {
	const { error } = await supabase.from("gameData").update({points: points}).eq("id", id)
	if (error) {
		console.error(error)
	} else {
		console.log("updated")
	}
}

async function deleteData(id) {
	const { error } = await supabase.from("gameData").delete().eq("id", id)
	if (error) {
		console.error(error)
	} else {
		console.log("deleted")
	}
}