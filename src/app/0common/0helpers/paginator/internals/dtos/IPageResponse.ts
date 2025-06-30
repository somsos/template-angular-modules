import { Entity } from "../../../../types/Entity";

export interface IPageResponse<T extends Entity> {
  totalElements: number,
  content: T[],
}
