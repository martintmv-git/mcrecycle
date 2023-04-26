import { supabase } from "./supabaseClient";

async function fetchData() {
  const { data, error } = await supabase.from("your_table").select("*");
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
}

console.log("test")