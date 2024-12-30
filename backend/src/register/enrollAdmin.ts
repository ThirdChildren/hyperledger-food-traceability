import { Wallets, X509Identity } from "fabric-network";
import FabricCAServices from "fabric-ca-client";
import * as path from "path";
import * as fs from "fs";

// Percorso al file di configurazione del profilo di connessione
const CONNECTION_PROFILE_PATH = path.resolve(
  process.env.HOME || "",
  "go/src/github.com/ThirdChildren/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json"
);

// Percorso del wallet
const WALLET_PATH = path.join(process.cwd(), "wallet");

async function main() {
  try {
    // Carica il profilo di connessione
    const connectionProfile = JSON.parse(
      fs.readFileSync(CONNECTION_PROFILE_PATH, "utf8")
    );
    const caInfo =
      connectionProfile.certificateAuthorities["ca.org1.example.com"];
    const caURL = caInfo.url;

    // Crea un client Fabric CA
    const ca = new FabricCAServices(caURL);

    // Crea un wallet per gestire le identità
    const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);

    // Verifica se l'identità admin esiste già
    const adminIdentity = await wallet.get("admin");
    if (adminIdentity) {
      console.log(
        "An identity for the admin user 'admin' already exists in the wallet"
      );
      return;
    }

    // Effettua l'enroll dell'admin e salva le credenziali
    const enrollment = await ca.enroll({
      enrollmentID: "admin",
      enrollmentSecret: "adminpw",
    });

    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "Org1MSP",
      type: "X.509",
    };

    await wallet.put("admin", x509Identity);
    console.log(
      "Successfully enrolled admin user 'admin' and imported it into the wallet"
    );
  } catch (error) {
    console.error(`Failed to enroll admin user 'admin': ${error}`);
    process.exit(1);
  }
}

main();
