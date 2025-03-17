import { Observable } from "rxjs";
import { Entity } from "../../../types/Entity";
import type { IPagePayload } from "./dtos/IPagePayload";
import type { IPageResponse } from "./dtos/IPageResponse";

export interface IPaginatorService<T extends Entity> {

  filterOverAll(textFilter: string): Observable<IPageResponse<T>>

  findPage(payload: IPagePayload): Observable<IPageResponse<T>>;

  deleteById(id: number): Observable<T>

}
