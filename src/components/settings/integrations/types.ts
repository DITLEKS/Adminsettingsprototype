export type ServerStatus = "active" | "disabled" | "unavailable";

export interface ServerConfig {
  id: string;
  name: string;
  type: "AD" | "Other"; // "Other" for config management if needed, or just use generic
  address: string;
  port?: string;
  baseDN?: string; // Optional, not used in Config Management
  isMain: boolean;
  stopTracking: boolean;
  status: ServerStatus;
  syncFrequency: string;
  availabilityCheckValue: number;
  availabilityCheckUnit: "min" | "h";
}
