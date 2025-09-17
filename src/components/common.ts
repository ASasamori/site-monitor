import type { AxiosRequestConfig } from "axios";
import chalk from "chalk";

export interface Config {
    gruBaseUrl?: string;
    gruUserId: string;
    gruUserName: string;
    gboxApiKey: string;
    gboxBaseUrl?: string;
    translateThinking?: boolean;
  }

export function getAxiosConfig(config: Config): AxiosRequestConfig {
  return {
    baseURL: config.gruBaseUrl,
    headers: {
      "x-auth-user-id": config.gruUserId,
      "x-auth-user-name": config.gruUserName,
      "x-auth-user-roles": "ROLE_SUDOERS",
      "Content-Type": "application/json"
    }
  };
}

export function getStatusColor(status: string): (text: string) => string {
  const statusColors: Record<string, (text: string) => string> = {
    INIT: chalk.gray,
    READY: chalk.cyan,
    PLANNING: chalk.blue,
    PLANNED: chalk.blue,
    EXECUTING: chalk.blue,
    EXECUTED: chalk.green,
    PENDING: chalk.yellow,
    FINISHED: chalk.green
  };
  return statusColors[status] || chalk.white;
}

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
    return axiosError.response?.data?.message || axiosError.message || "Unknown error";
  }
  return error instanceof Error ? error.message : "Unknown error";
}
