import { useState } from "react";
import { createBatch } from "../utils/api";
import { TextField, Button, Typography, Paper } from "@mui/material";

const BatchForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    productType: "",
    producer: "",
    currentNode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createBatch(formData);
      alert("Batch created successfully!");
      console.log(response);
    } catch (error) {
      console.error("Error creating batch:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="container mx-auto px-4">
        <Paper className="p-8 shadow-md max-w-2xl mx-auto">
          <Typography variant="h4" className="mb-6 text-center font-bold">
            Create a New Batch
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["id", "productType", "producer", "currentNode"].map((field) => (
                <TextField
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                />
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                className="hover:bg-blue-600"
              >
                Create Batch
              </Button>
            </div>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default BatchForm;
