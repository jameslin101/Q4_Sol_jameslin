import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        const metadata = {
            name: "JAMES NFT",
            symbol: "GOATSE",
            description: "GOATSE",
            image: "https://devnet.irys.xyz/YDtcspnNnWjrv8qfwrFLsDp5zfWLdoFW9yyRRBtU7r1",
            attributes: [
                { trait_type: 'GOATSE', value: 'GOATSE' }
            ],
            properties: {
                files: [
                    {
                        type: "image/jpg",
                        uri: "https://devnet.irys.xyz/YDtcspnNnWjrv8qfwrFLsDp5zfWLdoFW9yyRRBtU7r1"
                    },
                ]
            },
            creators: [
                {
                    share: 100,
                    address: signer.publicKey,
                    verified: true
                }
            ]
        };

        // Upload metadata JSON to Arweave or other storage provider via irysUploader
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
    }
    catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
