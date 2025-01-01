import { useState } from "react";
import { getBatchById } from "../utils/api";

const BatchList = () => {
  const [batchId, setBatchId] = useState("");
  const [batchData, setBatchData] = useState<any>(null);

  const handleFetch = async () => {
    try {
      const response = await getBatchById(batchId);
      setBatchData(response);
    } catch (error) {
      console.error("Error fetching batch:", error);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Fetch Batch Data</h2>
      <input
        type="text"
        value={batchId}
        onChange={(e) => setBatchId(e.target.value)}
        placeholder="Enter Batch ID"
        className="w-full border px-2 py-1 rounded mb-2"
      />
      <button
        onClick={handleFetch}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Fetch Batch
      </button>
      {batchData && (
        <pre className="mt-4 bg-gray-100 p-2 rounded">
          {JSON.stringify(batchData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default BatchList;
