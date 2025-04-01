import { Entity } from "../../../../types/Entity";
import { IPagePayload } from "../dtos/IPagePayload";
import { IPageResponse } from "../dtos/IPageResponse";

export abstract class PageUtils {

  static fromSortAndPageChangeEventsAndMergeWithOld(newInfo: any, oldInfo: IPagePayload): IPagePayload {
    const mergeNewAndOldInfo = {
      sort: {
        property: newInfo.active ?? oldInfo.sort.property,
        direction: newInfo.direction ?? oldInfo.sort.direction,
      },
      page: {
        index: newInfo.pageIndex ?? oldInfo.page.index,
        indexPrevious: newInfo.previousPageIndex ?? oldInfo.page.indexPrevious,
        itemsPerPage: oldInfo.page.itemsPerPage,
        totalElements: oldInfo.page.totalElements,
        pageIndexes: PageUtils.getIndexCount(oldInfo),
      },
      filter: {
        overall: newInfo.filter?.overall ?? oldInfo.filter.overall
      }
    };

    console.log("newInfo", newInfo, "oldInfo", oldInfo, "mergeNewAndOldInfo", mergeNewAndOldInfo);

    return mergeNewAndOldInfo
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
