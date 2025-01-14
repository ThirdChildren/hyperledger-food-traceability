import { Request, Response } from "express";
import { getContract } from "../config/fabricConfig";

export const createBatch = async (req: Request, res: Response) => {
  try {
    const { id, productType, producer, currentNode } = req.body;
    const contract = await getContract();

    await contract.submitTransaction(
      "CreateBatch",
      id,
      productType,
      producer,
      currentNode
    );
    res.status(200).json({ message: `Batch ${id} created successfully` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBatchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contract = await getContract();

    const result = await contract.evaluateTransaction("GetBatchByID", id);
    res.status(200).json(JSON.parse(result.toString()));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBatchState = async (req: Request, res: Response) => {
  try {
    const { id, newNode, newStatus } = req.body;
    const contract = await getContract();

    await contract.submitTransaction(
      "UpdateBatchState",
      id,
      newNode,
      newStatus
    );
    res.status(200).json({ message: `Batch ${id} updated successfully` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBatches = async (req: Request, res: Response) => {
  try {
    const contract = await getContract();

    const result = await contract.evaluateTransaction("GetAllBatches");
    res.status(200).json(JSON.parse(result.toString()));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
