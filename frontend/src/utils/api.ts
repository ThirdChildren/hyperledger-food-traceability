const BASE_URL = "http://localhost:3000/api/batch";

export const createBatch = async (data: {
  id: string;
  productType: string;
  producer: string;
  currentNode: string;
}) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getBatchById = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  return response.json();
};

export const updateBatchState = async (data: {
  id: string;
  currentNode: string;
  state: string;
}) => {
  const response = await fetch(BASE_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};
