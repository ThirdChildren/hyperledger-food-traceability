import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  CircularProgress,
  IconButton,
  Modal,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Edit, Info } from "@mui/icons-material";
import { green } from "@mui/material/colors";
import { getAllBatches, updateBatchState, getBatchHistory } from "../utils/api";

interface Batch {
  id: string;
  productType: string;
  producer: string;
  currentNode: string;
  status: string;
}

interface BatchHistoryRecord {
  txId: string;
  timestamp: string;
  isDeleted: boolean;
  [key: string]: any;
}

const BatchHistory = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [history, setHistory] = useState<BatchHistoryRecord[]>([]);
  const [newNode, setNewNode] = useState("");
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await getAllBatches();
        setBatches(response);
      } catch (error) {
        console.error("Error fetching batches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const handleEditClick = (batch: Batch) => {
    setSelectedBatch(batch);
    setNewNode(batch.currentNode);
    setNewStatus(batch.status);
    setOpenEditModal(true);
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
        setOpenEditModal(false);
        setBatches((prevBatches) =>
          prevBatches.map((batch) =>
            batch.id === selectedBatch.id
              ? { ...batch, currentNode: newNode, status: newStatus }
              : batch
          )
        );
      } catch (error) {
        console.error("Error updating batch:", error);
      }
    }
  };

  const handleViewHistory = async (batch: Batch) => {
    try {
      const historyData = await getBatchHistory(batch.id);
      setHistory(historyData);
      setOpenHistoryModal(true);
    } catch (error) {
      console.error("Error fetching batch history:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Paper className="p-6 shadow-md w-full max-w-4xl">
        <Typography variant="h4" className="mb-6 text-center font-bold">
          Batch Management
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
                  <b>Current Status</b>
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
                  <TableCell>{batch.status}</TableCell>
                  <TableCell>
                    <IconButton
                      sx={{ color: green[500] }}
                      onClick={() => handleEditClick(batch)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewHistory(batch)}
                    >
                      <Info />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Modal per Modifica Stato */}
        <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
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

        {/* Modal per Visualizzazione Storico */}
        <Modal
          open={openHistoryModal}
          onClose={() => setOpenHistoryModal(false)}
        >
          <Box className="bg-white p-6 rounded shadow-md w-96 mx-auto mt-20">
            <Typography variant="h6" className="mb-4">
              Batch History
            </Typography>
            <List>
              {history.map((record, index) => (
                <ListItem key={index}>
                  <Tooltip title={record.txId} placement="top" arrow>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          <b>Transaction ID:</b> {record.txId.slice(0, 12)}...
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2">
                            <b>Current Node:</b> {record.currentNode}
                          </Typography>
                          <Typography variant="body2">
                            <b>Status:</b> {record.status}
                          </Typography>
                        </>
                      }
                    />
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          </Box>
        </Modal>
      </Paper>
    </div>
  );
};

export default BatchHistory;
