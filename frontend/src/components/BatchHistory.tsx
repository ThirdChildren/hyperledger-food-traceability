import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Modal,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { getAllBatches, updateBatchState } from "../utils/api";

interface Batch {
  id: string;
  productType: string;
  producer: string;
  currentNode: string;
}

const BatchHistory = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [newNode, setNewNode] = useState("");
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await getAllBatches();
        setBatches(response);
      } catch (error) {
        console.error("Error fetching batch history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const handleEditClick = (batch: Batch) => {
    setSelectedBatch(batch);
    setNewNode(batch.currentNode);
    setNewStatus(""); // Puoi inizializzarlo o lasciare vuoto
    setOpenModal(true);
  };

  const handleUpdateBatch = async () => {
    if (selectedBatch) {
      try {
        await updateBatchState({
          id: selectedBatch.id,
          newNode: newNode,
          newStatus: newStatus,
        });
        alert(`Batch ${selectedBatch.id} updated successfully`);
        setOpenModal(false);
        // Aggiorna la tabella dopo la modifica
        setBatches((prevBatches) =>
          prevBatches.map((batch) =>
            batch.id === selectedBatch.id
              ? { ...batch, currentNode: newNode }
              : batch
          )
        );
      } catch (error) {
        console.error("Error updating batch:", error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Paper className="p-6 shadow-md w-full max-w-4xl">
        <Typography variant="h4" className="mb-6 text-center font-bold">
          Batch History
        </Typography>
        {loading ? (
          <div className="flex justify-center mt-6">
            <CircularProgress />
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>ID</b>
                </TableCell>
                <TableCell>
                  <b>Product Type</b>
                </TableCell>
                <TableCell>
                  <b>Producer</b>
                </TableCell>
                <TableCell>
                  <b>Current Node</b>
                </TableCell>
                <TableCell>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>{batch.id}</TableCell>
                  <TableCell>{batch.productType}</TableCell>
                  <TableCell>{batch.producer}</TableCell>
                  <TableCell>{batch.currentNode}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(batch)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Modal per Modifica Stato */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box className="bg-white p-6 rounded shadow-md w-96 mx-auto mt-20">
            <Typography variant="h6" className="mb-4">
              Update Batch State
            </Typography>
            <TextField
              label="New Node"
              fullWidth
              value={newNode}
              onChange={(e) => setNewNode(e.target.value)}
              className="mb-4"
            />
            <TextField
              label="New Status"
              fullWidth
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateBatch}
              >
                Update
              </Button>
            </div>
          </Box>
        </Modal>
      </Paper>
    </div>
  );
};

export default BatchHistory;
