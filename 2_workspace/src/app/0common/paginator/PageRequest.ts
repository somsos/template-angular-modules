import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BehaviorSubject, merge, map, switchMap, retry, Observable, filter, debounceTime, EMPTY, tap } from "rxjs";
import { Entity } from "../types/Entity"
import { ILayoutService } from "../layout/ILayoutService";
import { FormControl } from "@angular/forms";
import { AppError } from "../errors/externals/AppError";
import { ErrorType } from "../errors/externals/ErrorType";
import { IUserDto } from "../../users/internals/commons/IUserDto";

export interface IPagePayload {
  sort: {
    property: string,
    direction: 'asc' | 'desc',
  },
  page: {
    index: number,
    indexPrevious: number,
    pageIndexes: number[], // example: [1, 2, 3], so can iterate and show it in UI
    itemsPerPage: number,
    itemsInTotal: number,

  }
}

export interface IPageResponse<T extends Entity> {
  itemsInTotal: number,
  data: T[],
}


export interface IPaginatorService<T extends Entity> {

  filterOverAll(textFilter: string): Observable<IPageResponse<T>>

  findPage(payload: IPagePayload): Observable<IPageResponse<T>>;

  deleteById(id: number): Observable<T>

}

// -------------- implementation ----------------

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
        itemsInTotal: oldInfo.page.itemsInTotal,
        pageIndexes: PageUtils.getIndexCount(oldInfo),
      }
    }
  }

  public static getIndexCount(info: IPagePayload): number[] {
    const size = Math.ceil(info.page.itemsInTotal / info.page.itemsPerPage);
    const pageIndexes = Array.from({length: size}, (_, i) => i + 1);
    return pageIndexes;
  }

  public static fromFiltering(usersFiltered: IUserDto[]): IPageResponse<Entity> {
    const casted: IPageResponse<Entity> = {
      itemsInTotal: usersFiltered.length,
      data: usersFiltered,
    }
    return casted;
  }

}


/**
 * Hot to use
 *
 *
 * fist make sure you have in in your template and component

  @ViewChild(MatPaginator)
   paginator!: MatPaginator;

   @ViewChild(MatSort)
   sort!: MatSort;

   private readonly _srv = inject(--IPaginatorService--);

   constructor(
      @Inject(commonsNames.ILayoutService) private _layoutSrv: ILayoutService
   )

   // to initialize you need to do it in ngAfterViewInit or angular will not find sort and paginator

   ngAfterViewInit(): void {
    this.pageHelper = new PageHelper(this._srv, this._layoutSrv, this.paginator, this.sort);
  }

 *
 *
 */

const firstPayload: IPagePayload = {
  sort: { property: 'id', direction: 'asc', },
  page: { index: 0, indexPrevious: 0, itemsPerPage: 3, itemsInTotal: 0, pageIndexes: [], }
}

export class PageHelper<T extends Entity = Entity> {

  //You must call linkUI or it will fail on ngAfterViewInit
  private paginator!: MatPaginator;
  private sort!: MatSort;
  private textFilter!: FormControl;

  public pagePayload: IPagePayload = firstPayload;

  public data$ = new BehaviorSubject<T[]>(new Array<T>());

  constructor(
    private _srv: IPaginatorService<T>,
    private _layoutSrv: ILayoutService,
    itemsPerPage: number,
  ) {
    this.pagePayload.page.itemsPerPage = itemsPerPage;
  }

  //You must call linkUI or it will fail on ngAfterViewInit
  public linkUI(paginator: MatPaginator, sort: MatSort, tf: FormControl) {
    this.paginator = paginator;
    this.sort = sort;
    this.textFilter = tf;
    this._firstRequestUsers();
    this._observeSortAndPagination();
    this._observeFilter();
  }

  private _firstRequestUsers(): void {
    this.pagePayload = firstPayload; // when we what to reset
    this._srv.findPage(this.pagePayload).subscribe({
        next: (response) => this._updatePage(response),
        complete: () => console.debug("fist-req finished")
      }
    );
  }

  private _observeSortAndPagination() {
    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      //startWith({ allItemsCount: 10, data: [] }),
      map((events: any) => PageUtils.fromSortAndPageChangeEventsAndMergeWithOld(events, this.pagePayload) ),
      switchMap((mergedPayload: IPagePayload) => {
        //this.isLoadingResults = true;
        this.pagePayload = mergedPayload;
        const pageFoundReq = this._srv.findPage(this.pagePayload);
        return pageFoundReq;
      }),
    )
    .subscribe({
      next: (resp) => this._updatePage(resp),
      complete: () => console.debug("change-page-sort completed")
    });
  }


  private _updatePage(response: IPageResponse<T>): void {
    //console.log("users list found", list);
    //const users = response.data.map(u => UserDtoUtils.dtoToIUserItem(u))
    if((response as any).data == undefined) {
      const usrMsg = "Error inesperado, contacte con administrador";
      const cause = "response to show in UI unexpected";
      throw new AppError(usrMsg, ErrorType.CodeFault, cause);
    }
    this.data$.next(response.data);
    this.pagePayload.page.itemsInTotal = response.itemsInTotal;
    this.pagePayload.page.pageIndexes = PageUtils.getIndexCount(this.pagePayload);
    //console.log("table-updated", response);
  }

  onClickChangePage(pageIndex: number): void {
    this.pagePayload.page.index = pageIndex - 1;
    this._srv.findPage(this.pagePayload).subscribe({
      next: (resp) => this._updatePage(resp),
      complete: () => console.log("change-selected-page-index completed")
    });
  }


  deleteById(id: number) {
    const msg = '¿Realmente quieres eliminar este usuario?';
    const sub = this._layoutSrv.askConfirmation(msg).subscribe((confirm) => {
      if (confirm) {
        const sub2 = this._srv.deleteById(id).subscribe({
          next: (uDel) => {
            const all = this.data$.getValue();
            const filtered = all.filter(u => u.id === uDel.id);
            this.data$.next(filtered);
          },
          complete: () => {
            console.debug("Deleted completed");
            sub2.unsubscribe();
          },
        });
      }
      sub.unsubscribe();
    });
  }


  private _observeFilter() {
    this.textFilter.valueChanges.pipe(
      map(v => v ?? ''),
      filter(_ => this.textFilter.valid),
      debounceTime(1000),
    ).subscribe({
      next: (textFilter) => {
        if(textFilter == '') { // it feels natural make first request
          this._firstRequestUsers();
          return ;
        }
        this._srv.filterOverAll(textFilter).subscribe({
          next: (response) => {
            this._updatePage(response);
          },
          error: (error) => {
            this._layoutSrv.showError(error);
            return EMPTY;
          }
        })
      },

    });
  }


}
