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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_network_1 = require("fabric-network");
const fabric_ca_client_1 = __importDefault(require("fabric-ca-client"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Percorso al file di configurazione del profilo di connessione
const CONNECTION_PROFILE_PATH = path.resolve(process.env.HOME || "", "go/src/github.com/ThirdChildren/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json");
// Percorso del wallet
const WALLET_PATH = path.join(process.cwd(), "wallet");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Carica il profilo di connessione
            const connectionProfile = JSON.parse(fs.readFileSync(CONNECTION_PROFILE_PATH, "utf8"));
            const caInfo = connectionProfile.certificateAuthorities["ca.org1.example.com"];
            const caURL = caInfo.url;
            // Crea un client Fabric CA
            const ca = new fabric_ca_client_1.default(caURL);
            // Crea un wallet per gestire le identità
            const wallet = yield fabric_network_1.Wallets.newFileSystemWallet(WALLET_PATH);
            // Verifica se l'identità admin esiste già
            const adminIdentity = yield wallet.get("admin");
            if (adminIdentity) {
                console.log("An identity for the admin user 'admin' already exists in the wallet");
                return;
            }
            // Effettua l'enroll dell'admin e salva le credenziali
            const enrollment = yield ca.enroll({
                enrollmentID: "admin",
                enrollmentSecret: "adminpw",
            });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: "Org1MSP",
                type: "X.509",
            };
            yield wallet.put("admin", x509Identity);
            console.log("Successfully enrolled admin user 'admin' and imported it into the wallet");
        }
        catch (error) {
            console.error(`Failed to enroll admin user 'admin': ${error}`);
            process.exit(1);
        }
    });
}
main();
