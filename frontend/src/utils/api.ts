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
  newNode: string;
  newStatus: string;
}) => {
  const response = await fetch(BASE_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getAllBatches = async () => {
  const response = await fetch("http://localhost:3000/api/batches");
  return response.json();
};

export const getBatchHistory = async (id: string) => {
  const response = await fetch(`${BASE_URL}/history/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch batch history: ${response.statusText}`);
  }
  return response.json();
};
