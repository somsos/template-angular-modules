import { Endpoint } from "../../types/Endpoint";

export interface IAuthBackendService {
  addRoutes(newEps: Endpoint[]): void
}
