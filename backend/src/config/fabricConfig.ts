import { Gateway, Wallets, Contract } from "fabric-network";
import * as path from "path";
import * as fs from "fs";

// Percorso al connection profile di Org1
const CONNECTION_PROFILE_PATH = path.resolve(
  process.env.HOME || "",
  "go/src/github.com/ThirdChildren/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json"
);

// Percorso al wallet
const WALLET_PATH = path.join(process.cwd(), "src/register/wallet");
console.log(WALLET_PATH);

// Nome del canale e del contratto
const CHANNEL_NAME = "mychannel";
const CHAINCODE_NAME = "basic";

// Nome utente registrato
const USER_ID = "appUser";

export async function getContract(): Promise<Contract> {
  try {
    // Legge il profilo di connessione
    const connectionProfile = JSON.parse(
      fs.readFileSync(CONNECTION_PROFILE_PATH, "utf8")
    );

    // Inizializza il wallet
    const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);

    // Verifica che l'utente esista nel wallet
    const userIdentity = await wallet.get(USER_ID);
    if (!userIdentity) {
      throw new Error(
        `User ${USER_ID} not found in wallet. Please run the registerUser.ts script first.`
      );
    }

    // Configura il gateway
    const gateway = new Gateway();
    await gateway.connect(connectionProfile, {
      wallet,
      identity: USER_ID,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Accedi alla rete e ottieni il contratto
    const network = await gateway.getNetwork(CHANNEL_NAME);
    const contract = network.getContract(CHAINCODE_NAME);

    return contract;
  } catch (error) {
    console.error(`Error in getContract: ${error}`);
    throw error;
  }
}
