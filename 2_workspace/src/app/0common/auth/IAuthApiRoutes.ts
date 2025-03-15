import { Endpoint } from "../types/Endpoint";

export interface IAuthApiRoutes {
  addRoutes(newEps: Endpoint[]): void
}
