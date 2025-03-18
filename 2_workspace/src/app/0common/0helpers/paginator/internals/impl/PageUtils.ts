import { Entity } from "../../../../types/Entity";
import { IPagePayload } from "../dtos/IPagePayload";
import { IPageResponse } from "../dtos/IPageResponse";

export abstract class PageUtils {

  static fromSortAndPageChangeEventsAndMergeWithOld(events: any, oldInfo: IPagePayload): IPagePayload {
    return {
      sort: {
        property: events.active ?? oldInfo.sort.property,
        direction: events.direction ?? oldInfo.sort.direction,
      },
      page: {
        index: events.pageIndex ?? oldInfo.page.index,
        indexPrevious: events.previousPageIndex ?? oldInfo.page.indexPrevious,
        itemsPerPage: oldInfo.page.itemsPerPage,
        totalElements: oldInfo.page.totalElements,
        pageIndexes: PageUtils.getIndexCount(oldInfo),
      }
    }
  }

  public static getIndexCount(info: IPagePayload): number[] {
    const size = Math.ceil(info.page.totalElements / info.page.itemsPerPage);
    const pageIndexes = Array.from({length: size}, (_, i) => i + 1);
    return pageIndexes;
  }

  public static fromFiltering(usersFiltered: Entity[]): IPageResponse<Entity> {
    const casted: IPageResponse<Entity> = {
      totalElements: usersFiltered.length,
      content: usersFiltered,
    }
    return casted;
  }

}
