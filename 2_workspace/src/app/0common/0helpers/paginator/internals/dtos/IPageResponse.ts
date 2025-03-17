import { Entity } from "../../../../types/Entity";

export interface IPageResponse<T extends Entity> {
  itemsInTotal: number,
  data: T[],
}
