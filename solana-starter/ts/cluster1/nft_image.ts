import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        const image = await readFile("/Users/chemin/turbin3/solana-starter/ts/cluster1/Mythic.png");
        const genericFile = createGenericFile(image, "/Users/chemin/turbin3/solana-starter/ts/cluster1/Mythic.png");  // The second argument is the file name

        const genericFileArray = [genericFile];  // Wrap in an array

        console.log(genericFileArray);
        // console.log(typeof genericFile);  // To check what type is being returned
        
        // const [myUri] = await umi.uploader.upload(genericFile);  // try 'upload' instead of 'uploadFile'
        const [myUri] = await umi.uploader.upload(genericFileArray);
        console.log("File uploaded successfully. File URI:", myUri);

        // console.log(umi.uploader);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
