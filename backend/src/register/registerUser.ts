import { Wallets, X509Identity } from "fabric-network";
import FabricCAServices from "fabric-ca-client";
import * as path from "path";
import * as fs from "fs";

const CONNECTION_PROFILE_PATH = path.resolve(
  process.env.HOME || "",
  "go/src/github.com/ThirdChildren/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json"
);

const WALLET_PATH = path.join(process.cwd(), "wallet");

async function main() {
  try {
    // Load the connection profile
    const connectionProfile = JSON.parse(
      fs.readFileSync(CONNECTION_PROFILE_PATH, "utf8")
    );
    const caInfo =
      connectionProfile.certificateAuthorities["ca.org1.example.com"];
    const caURL = caInfo.url;

    // Create a new CA client for interacting with the CA
    const ca = new FabricCAServices(caURL);

    // Create a wallet to manage identities
    const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);

    // Check if appUser already exists
    const userIdentity = await wallet.get("appUser");
    if (userIdentity) {
      console.log(
        "An identity for the user 'appUser' already exists in the wallet"
      );
      return;
    }

    // Check if admin identity exists in the wallet
    const adminIdentity = await wallet.get("admin");
    if (!adminIdentity) {
      console.log(
        "An identity for the admin user 'admin' does not exist in the wallet. Run the enrollAdmin.ts script first."
      );
      return;
    }

    // Build a user object for authenticating with the CA
    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, "admin");

    // Register the user and enroll the user identity
    const secret = await ca.register(
      {
        affiliation: "org1.department1",
        enrollmentID: "appUser",
        role: "client",
      },
      adminUser
    );

    const enrollment = await ca.enroll({
      enrollmentID: "appUser",
      enrollmentSecret: secret,
    });

    // Create and save the identity in the wallet
    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "Org1MSP",
      type: "X.509",
    };
    await wallet.put("appUser", x509Identity);
    console.log(
      "Successfully registered and enrolled user 'appUser' and imported it into the wallet"
    );
  } catch (error) {
    console.error(`Failed to register user appUser: ${error}`);
    process.exit(1);
  }
}

main();
