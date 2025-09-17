#!/usr/bin/env node

import axios from "axios";
import type { Config, Conversation, Message, MessageData} from "./types";
import {getAxiosConfig, getErrorMessage} from "./common";
import chalk from "chalk";
  
async function proposeConversationName(config: Config, input: string): Promise<string> {
    try {
      const response = await axios.post<{ name: string }>(
        "/api/agent/proposed-name",
        { input },
        {
          ...getAxiosConfig(config),
          params: { scenario: "gru" }
        }
      );
      return response.data.name;
    } catch {
      console.warn(chalk.yellow("Warning: Could not generate name, using input as title"));
      return input.substring(0, 50);
    }
}
  

// Main function that can be called from React
export async function main(config: Config, message: string): Promise<{ success: boolean; conversation?: Conversation; error?: string }> {
  console.log(`This will create a conversation: '${message}' with resourceMonitor agent`);

  // Validate the provided config
  const isValid = validateConfigWithValues(config);
  if (!isValid) {
    return { success: false, error: "Configuration validation failed" };
  }

  // console.log("✅ Configuration validated");
  // console.log(`GRU Base URL: ${config.gruBaseUrl}`);
  // console.log(`GBox Base URL: ${config.gboxBaseUrl}`);
  // console.log(`User ID: ${config.gruUserId}`);
  // console.log(`User Name: ${config.gruUserName}`);

  try {
    const conversation = await createTestConversationWithConfig(config, message);
    
    if (conversation) {
      // console.log("🎉 Test completed successfully!");
      return { success: true, conversation };
    } else {
      console.log("❌ Test failed");
      return { success: false, error: "Failed to create conversation" };
    }
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Unhandled error:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

// Validation function for custom config
function validateConfigWithValues(config: Config): boolean {
  const requiredFields = [
    { key: 'gboxApiKey', value: config.gboxApiKey },
    { key: 'gboxBaseUrl', value: config.gboxBaseUrl },
    { key: 'gruBaseUrl', value: config.gruBaseUrl },
    { key: 'gruUserId', value: config.gruUserId },
    { key: 'gruUserName', value: config.gruUserName }
  ];

  const missingFields = requiredFields.filter(field =>
    !field.value || field.value === "your-gbox-api-key-here"
  );

  if (missingFields.length > 0) {
    console.error("❌ Missing required configuration:");
    missingFields.forEach(field => {
      console.error(`  - ${field.key}: ${field.value || "not set"}`);
    });
    return false;
  }

  return true;
}

// Modified createTestConversation to accept custom config and message
async function createTestConversationWithConfig(config: Config, message: string): Promise<Conversation | undefined> {
  const agent = "resourceMonitor";
  const gboxInstanceId = config.gboxInstanceId;

  try {
    // console.log("Creating test conversation...");
    // console.log(`Message: "${message}"`);
    // console.log(`Agent: ${agent}`);
    // console.log(`GBox Instance ID: ${gboxInstanceId}`);

    // Generate conversation title
    // console.log("Generating conversation title...");
    // console.log(`Message: "${message}"`);
    // console.log(`Config: ${JSON.stringify(config)}`);
    const title = await proposeConversationName(config, message);

    // Create conversation (without message first)
    const envVars: Record<string, unknown> = {
      GBOX_API_KEY: config.gboxApiKey,
      GBOX_BASE_URL: config.gboxBaseUrl
    };

    if (gboxInstanceId) {
      envVars.GBOX_INSTANCE_ID = gboxInstanceId;
    }

    const metadata: Record<string, unknown> = {
      env: envVars
    };

    const conversationData = {
      title: title || message.substring(0, 50),
      members: [agent],
      metadata
    };

    // console.log("Creating conversation...");
    const response = await axios.post<Conversation>("/api/agent/conversations", conversationData, getAxiosConfig(config));
    const conversation = response.data;

    // console.log("✅ Conversation created successfully!");
    // console.log(`  ID: ${conversation.id}`);
    // console.log(`  Title: ${conversation.title}`);
    // console.log(`  Members: ${conversation.members.join(", ")}`);
    // console.log("");

    // Send the first message separately
    // console.log("Sending initial message...");
    const messageData: MessageData = {
      content: message,
      metadata: {},
      targets: [agent],
      options: {
        cache: {
          useCache: false,
          delayOnCached: 0,
          prefix: "",
          clearable: true,
          cacheBase: ".cache"
        },
        llm: {
          numOfChoices: 1,
          temperature: 1
        },
        runUnitTests: false,
        reproduce: false,
        needValidation: true,
        compressProgress: true,
        multiModal: true,
        cleanupSandboxImmediately: false,
        knowledgeEnable: true,
        temperatureEscalation: true,
        nativeMsgStruct: false,
        longRun: false,
        ignoreCommands: []
      }
    };

    const msgResponse = await axios.post<Message>(`/api/agent/conversations/${conversation.id}/messages`, messageData, getAxiosConfig(config));

    console.log("✅ Message sent successfully!");
    console.log(`  Message ID: ${msgResponse.data.id}`);
    console.log("");

    console.log("Test completed! Check the GRU agent logs to see job execution.");
    console.log(`You can monitor the conversation at: ${config.gruBaseUrl}/conversations/${conversation.id}`);

    return conversation;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Error creating test conversation:", errorMessage);
    return undefined;
  }
}