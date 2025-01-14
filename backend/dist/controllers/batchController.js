"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBatchHistory = exports.getAllBatches = exports.updateBatchState = exports.getBatchById = exports.createBatch = void 0;
const fabricConfig_1 = require("../config/fabricConfig");
const createBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, productType, producer, currentNode } = req.body;
        const contract = yield (0, fabricConfig_1.getContract)();
        yield contract.submitTransaction("CreateBatch", id, productType, producer, currentNode);
        res.status(200).json({ message: `Batch ${id} created successfully` });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createBatch = createBatch;
const getBatchById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const contract = yield (0, fabricConfig_1.getContract)();
        const result = yield contract.evaluateTransaction("GetBatchByID", id);
        res.status(200).json(JSON.parse(result.toString()));
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getBatchById = getBatchById;
const updateBatchState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, newNode, newStatus } = req.body;
        const contract = yield (0, fabricConfig_1.getContract)();
        yield contract.submitTransaction("UpdateBatchState", id, newNode, newStatus);
        res.status(200).json({ message: `Batch ${id} updated successfully` });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateBatchState = updateBatchState;
const getAllBatches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = yield (0, fabricConfig_1.getContract)();
        const result = yield contract.evaluateTransaction("GetAllBatches");
        res.status(200).json(JSON.parse(result.toString()));
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllBatches = getAllBatches;
const getBatchHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const contract = yield (0, fabricConfig_1.getContract)();
        const result = yield contract.evaluateTransaction("GetBatchHistory", id);
        res.status(200).json(JSON.parse(result.toString()));
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getBatchHistory = getBatchHistory;
