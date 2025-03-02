"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getContract = getContract;
const fabric_network_1 = require("fabric-network");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Percorso al connection profile di Org1
const CONNECTION_PROFILE_PATH = path.resolve(process.env.HOME || "", "go/src/github.com/ThirdChildren/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json");
// Percorso al wallet
const WALLET_PATH = path.join(process.cwd(), "wallet");
console.log(WALLET_PATH);
// Nome del canale e del contratto
const CHANNEL_NAME = "mychannel";
const CHAINCODE_NAME = "basic";
// Nome utente registrato
const USER_ID = "appUser";
function getContract() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Legge il profilo di connessione
            const connectionProfile = JSON.parse(fs.readFileSync(CONNECTION_PROFILE_PATH, "utf8"));
            // Inizializza il wallet
            const wallet = yield fabric_network_1.Wallets.newFileSystemWallet(WALLET_PATH);
            // Verifica che l'utente esista nel wallet
            const userIdentity = yield wallet.get(USER_ID);
            if (!userIdentity) {
                throw new Error(`User ${USER_ID} not found in wallet. Please run the registerUser.ts script first.`);
            }
            // Configura il gateway
            const gateway = new fabric_network_1.Gateway();
            yield gateway.connect(connectionProfile, {
                wallet,
                identity: USER_ID,
                discovery: { enabled: true, asLocalhost: true },
            });
            // Accedi alla rete e ottieni il contratto
            const network = yield gateway.getNetwork(CHANNEL_NAME);
            const contract = network.getContract(CHAINCODE_NAME);
            return contract;
        }
        catch (error) {
            console.error(`Error in getContract: ${error}`);
            throw error;
        }
    });
}
