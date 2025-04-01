import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BehaviorSubject, merge, map, switchMap, EMPTY, filter, debounce, interval, debounceTime } from "rxjs";
import { Entity } from "../../../../types/Entity"
import { ILayoutService } from "../../../../layout/ILayoutService";
import { FormControl } from "@angular/forms";
import { IPagePayload } from "../dtos/IPagePayload";
import { IPaginatorService } from "../IPaginatorService";
import { PageUtils } from "./PageUtils";
import { IPageResponse } from "../dtos/IPageResponse";
import { AppError } from "../../../errors";



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
  filter: { overall: '' },
  page: { index: 0, indexPrevious: 0, itemsPerPage: 3, totalElements: 0, pageIndexes: [], }
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
  public linkUI(paginator: MatPaginator, sort: MatSort, tf: FormControl): void {
    this.paginator = paginator;
    this.sort = sort;
    this.textFilter = tf;
    this._firstRequestEntities();
    this._observeSortAndPagination();
    //this._observeFilter();
  }

  private _firstRequestEntities(): void {
    this.pagePayload = firstPayload; // when we what to reset
    this._srv.findPage(this.pagePayload).subscribe({
        next: (response) => this._updatePage(response),
        complete: () => console.debug("fist-req finished")
      }
    );
  }

  private _observeSortAndPagination(): void {
    merge(
      this.sort.sortChange,
      this.paginator.page,
      this.textFilter.valueChanges.pipe(
        debounceTime(1000),
        map(v => v ?? ''),
        filter(_ => this.textFilter.valid),
        map((plainText) => ({ filter: { overall: plainText } }) ),
      )
    )
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
    if((response as any).content == undefined) {
      const usrMsg = "Error inesperado, contacte con administrador";
      const cause = "response to show in UI unexpected";
      throw new AppError(usrMsg, 600, cause);
    }
    this.data$.next(response.content);
    this.pagePayload.page.totalElements = response.totalElements;
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

  onClickRefresh(): void {
    this.textFilter.setValue("");
    this._firstRequestEntities();
  }


  deleteById(id: number): void {
    const msg = '¿Realmente quieres eliminar este usuario?';
    const sub = this._layoutSrv.askConfirmation(msg).subscribe((confirm) => {
      if (confirm) {
        const sub2 = this._srv.deleteById(id).subscribe({
          next: (uDel) => {
            const all = this.data$.getValue();
            const filtered = all.filter(u => u.id !== uDel.id);
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


  /*
  private _observeFilter(): void {
    this.textFilter.valueChanges.pipe(
      map(v => v ?? ''),
      filter(_ => this.textFilter.valid),
      debounceTime(1000),
    ).subscribe({
      next: (textFilter) => {
        if(textFilter == '') { // it feels natural make first request
          this._firstRequestEntities();
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
    */


}
