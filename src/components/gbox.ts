import { GboxSDK, AndroidBoxOperator} from "gbox-sdk";

function buildGboxSDKConfig(apiKey: string, baseURL: string) {
    return {
      apiKey,
      baseURL
    };
}


export function buildGboxHandler(apiKey?: string, baseURL?: string): GboxSDK {
    const finalApiKey = apiKey ?? process.env.VITE_GBOX_API_KEY;
    const finalBaseURL = baseURL ?? process.env.VITE_GBOX_BASE_URL;
    if (!finalApiKey) { 
      throw new Error("GBOX_API_KEY is required");
    }
    if (!finalBaseURL) {
      throw new Error("GBOX_BASE_URL is required");
    }
    return new GboxSDK(buildGboxSDKConfig(finalApiKey, finalBaseURL));
}

export async function gracefulShutdown(currentBox: AndroidBoxOperator | null = null) {
  if (currentBox) {
    console.log("Shutting down program, deleting Android box...");
    try {
      await currentBox.terminate();
      console.log("Box successfully terminated");
    } catch (error) {
      console.log(`Error terminating box: ${error}`);
    }
  }
  process.exit(0);
}
