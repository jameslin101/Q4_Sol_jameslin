import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";

// Define our Mint address
const mint = publicKey("3yY9xJ3X2i637WNbQQdLpDupDgmtf6Ya6i8jzb15T5Fm")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint,
            mintAuthority: signer
        }

        let data: DataV2Args = {
            name: "PENGULOVE",
            symbol: "PENGULOVE",
            uri: "https://devnet.irys.xyz/YDtcspnNnWjrv8qfwrFLsDp5zfWLdoFW9yyRRBtU7r1",
            sellerFeeBasisPoints: 0,
            creators: [{
                address: keypair.publicKey, // Replace with your wallet public key
                verified: true, // Set to true if this is your wallet
                share: 100 // Percentage of royalty share. Must total to 100 if multiple creators
            }], // Add creators array, even if empty
            collection: null, // Add collection, can be null if not using
            uses: null // Add uses, can be null if not using            
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data: data,
            isMutable: true,
            collectionDetails: null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args,
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(result.signature);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();