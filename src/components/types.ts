export interface Config {
    gruBaseUrl?: string;
    gruUserId: string;
    gruUserName: string;
    gboxApiKey: string;
    gboxBaseUrl?: string;
    gboxInstanceId?: string;
    translateThinking?: boolean;
    jobRequest?: string; // Not really sure if this is needed
  }
  
  export interface ConfigOptions {
    gruBaseUrl?: string;
    gruUserId?: string;
    gruUserName?: string;
    show?: boolean;
    gboxApiKey?: string;
    gboxBaseUrl?: string;
    translateThinking?: boolean;
  }
  
  export interface ConversationListOptions {
    page: string;
    size: string;
    members?: string[];
  }
  
  export interface CreateConversationOptions {
    title?: string;
    agent: string;
    noPropose?: boolean;
    planModel?: string;
    cuaModel?: string;
    rules?: string;
    rulesFile?: string;
    gboxInstanceId?: string;
  }
  
  export interface JobListOptions {
    page: string;
    size: string;
    status?: string;
  }
  
  export interface Agent {
    name: string;
    displayName: string;
  }
  
  export interface Conversation {
    id: string;
    title?: string;
    members: string[];
    createdAt: string;
    updatedAt: string;
    ownerName: string;
    ownerId: string;
    metadata?: Record<string, unknown>;
  }
  
  export interface Message {
    id: string;
    content: string;
    senderName: string;
    createdAt: string;
  }
  
  export interface Job {
    id: string;
    status: string;
    spec?: string;
    content?: string;
    createdAt: string;
    updatedAt: string;
    assignerName: string;
    userId: string;
    context?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    pageable?: {
      page: number;
      size: number;
    };
  }
  
  export interface MessageOptions {
    cache: {
      useCache: boolean;
      delayOnCached: number;
      prefix: string;
      clearable: boolean;
      cacheBase: string;
    };
    llm: {
      numOfChoices: number;
      temperature: number;
      planModel?: string;
      cuaModel?: string;
    };
    runUnitTests: boolean;
    reproduce: boolean;
    needValidation: boolean;
    compressProgress: boolean;
    multiModal: boolean;
    cleanupSandboxImmediately: boolean;
    knowledgeEnable: boolean;
    temperatureEscalation: boolean;
    nativeMsgStruct: boolean;
    longRun: boolean;
    ignoreCommands: string[];
  }
  
  export interface MessageData {
    content: string;
    metadata: Record<string, unknown>;
    targets: string[];
    options: MessageOptions;
  }
  
  export interface ConversationsParams {
    page: number;
    size: number;
    members?: string[];
  }
  
  export interface JobsParams {
    page: number;
    size: number;
    status?: string | { not: string };
  }
  
  // Plan and Task types
  export interface StepMetadata {
    traceUrl?: string;
    runId?: string;
    parentRunId?: string;
    toolCallMetadata?: {
      traceUrl?: string;
      runId?: string;
      parentRunId?: string;
    };
  }
  
  export interface TaskStep {
    metadata?: StepMetadata;
    createdAt?: string;
    updatedAt?: string;
    thought?: string;
    action?: string;
    name?: string;
    observation?: string | Record<string, unknown>;
    args?: Record<string, unknown>;
    status?: string;
    context?: string | Record<string, unknown>;
    toolCallResult?: unknown;
    error?: string;
  }
  
  export interface Task {
    id: number;
    target: string;
    status: string;
    steps?: TaskStep[];
    metadata?: {
      traceUrl?: string;
      statusReason?: string;
    };
  }
  
  export interface Plan {
    id: string;
    jobId: string;
    goals: string[];
    tasks: Task[];
    nextTask: number;
    createdAt?: string | null;
    createdBy?: string | null;
    updatedAt?: string | null;
    updatedBy?: string | null;
    metadata?: {
      traceUrl?: string;
      executionSequence?: number[];
    };
  }
  