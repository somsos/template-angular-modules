import { first, Observable, of, switchMap } from "rxjs";
import { Entity, StringUtils } from "../../../../0common";
import { MockUsersBackendUtils } from "../../../../0common/utils/MockBackendUtils";

interface UserPicture extends Entity {

  id: number;

  idUser: number;

  url: string;

  urlBase64: string;

}

function buildToSaveInLocalStore(id: number, idUser: number, urlBase64: string): UserPicture {
  return {
    id: id,
    idUser: idUser,
    url: '',
    urlBase64: urlBase64,
  };
}

export class UsersImagesStore {

  private static readonly _keyS = 'usersPictures';

  public static saveFileOrThrow(idUser: number, picture: File): Observable<number> {
    return StringUtils.toUrlBase64(picture).pipe(
      first(),
      switchMap(newUrlBase64 => {
        const pictures = UsersImagesStore._getPicturesFromStore();
        const newId = MockUsersBackendUtils.getBiggestId(pictures) + 1;
        const newPicture = buildToSaveInLocalStore(newId, idUser, newUrlBase64);
        pictures.push(newPicture);
        UsersImagesStore._overridePictures(pictures);
        //return throwError(() => new HttpErrorResponse({ url: UsersDao.endPoints.get("uploadImage")!.url }))
        return of(newPicture.id);
      }))
  }

  public static getUrlByUser(idUser: number): string {
    const pictures = UsersImagesStore._getPicturesFromStore();
    const indexFound = pictures.findIndex(p => p.idUser == idUser);
    if(indexFound == -1) {
      return "/img/404.png";
    }
    return pictures[indexFound].urlBase64;
  }

  private static _overridePictures(pictures: UserPicture[]) {
    const newSt = JSON.stringify(pictures);
    localStorage.setItem(UsersImagesStore._keyS, newSt);
  }

  private static _ifNotExistStoreCreateIt(): void {
    if(localStorage.getItem(UsersImagesStore._keyS)) {
      return ;
    }
    localStorage.setItem(UsersImagesStore._keyS, "[]");
  }

  private static _getPicturesFromStore(): UserPicture[] {
    UsersImagesStore._ifNotExistStoreCreateIt();
    const stStored = localStorage.getItem(UsersImagesStore._keyS)!;
    const picturedFound = JSON.parse(stStored) as UserPicture[];
    return picturedFound;
  }

}
