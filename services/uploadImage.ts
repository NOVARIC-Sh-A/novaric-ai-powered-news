
import { BlobServiceClient } from "@azure/storage-blob";

const blobSasUrl = process.env.REACT_APP_AZURE_BLOB_SAS_URL;

export const isUploadServiceMisconfigured = (): boolean => {
    if (!blobSasUrl) {
        console.error("CRITICAL CONFIGURATION ERROR [uploadImageService]: REACT_APP_AZURE_BLOB_SAS_URL is not set. Image uploads will fail.");
        return true;
    }
    return false;
};

export async function uploadImage(file: File): Promise<string> {
    if (isUploadServiceMisconfigured() || !blobSasUrl) {
        throw new Error("Shërbimi i ngarkimit të imazheve nuk është konfiguruar.");
    }

    const blobServiceClient = new BlobServiceClient(blobSasUrl);
    
    // The SAS URL points to the container, so we extract the container name from the URL's path.
    // Example SAS URL: https://<account>.blob.core.windows.net/<container>?<sas_token>
    const pathSegments = new URL(blobSasUrl).pathname.split('/').filter(Boolean);
    if (!pathSegments.length) {
        throw new Error("SAS URL-ja e Azure Blob është e pavlefshme: Nuk u gjet emri i kontejnerit në shtegun e URL-së.");
    }
    const containerName = pathSegments[0];
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create a unique blob name to avoid overwriting files
    const blobName = `${new Date().getTime()}-${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    const arrayBuffer = await file.arrayBuffer();
    
    await blockBlobClient.uploadData(arrayBuffer, {
        blobHTTPHeaders: { blobContentType: file.type }
    });

    // Return the public URL of the uploaded blob (without the SAS token)
    return blockBlobClient.url.split('?')[0];
}
