/** Shared type definitions for willdo.work */

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: "idle" | "running" | "error";
  createdAt: string;
  updatedAt: string;
}
