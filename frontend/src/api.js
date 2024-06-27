// api.js
const BASE_URL = "http://localhost:3030/items";

export const fetchAllItems = async () => {
  const res = await fetch(BASE_URL);
  return await res.json();
};

// export const postNewItem = async (item) => {
//   const res = await fetch(BASE_URL, {
//     method: "POST",
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ newItem: item }) // Wrap item in an object with the key newItem
//   });
//   if (!res.ok) {
//     const errorText = await res.text();
//     throw new Error(`Network response was not ok: ${errorText}`);
//   }
//   const updatedItems = await res.json(); // Get the updated items array
//   return updatedItems[updatedItems.length - 1]; // Return only the newly added item
// };

export const postNewItem = async (item) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newItem: item })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Network response was not ok: ${errorText}`);
  }

  return await res.json(); // Ensure the function returns the created item
};

export const updateItem = async (id, updatedItem) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item: updatedItem })
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Network response was not ok: ${errorText}`);
  }
  return await res.json(); 
}

export const deleteItem = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Network response was not ok: ${errorText}`);
  }
  return await res.json(); 
}