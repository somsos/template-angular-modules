import { first, Observable, of, switchMap, throwError } from "rxjs";
import { Entity, StringUtils } from "../app/0common";
import { MockUsersBackendUtils } from "../app/0common/utils/MockBackendUtils";
import { HttpErrorResponse } from "@angular/common/http";
import { UsersDao } from "../app/users/internals/data/UsersDao";

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
        //Common
        const pictures = UsersImagesStore._getPicturesFromStore();
        const newId = MockUsersBackendUtils.getBiggestId(pictures) + 1;
        const newPicture = buildToSaveInLocalStore(newId, idUser, newUrlBase64);

        const failRequest = false;
        if(failRequest) {
          return throwError(() => new HttpErrorResponse({ url: UsersDao.endPoints.get("uploadImage")!.url }))
        }

        const found = this._getUserImageIndex(idUser);
        if(found.index == -1) { //Create
          pictures.push(newPicture);
        } else { //Update
          pictures[found.index] = newPicture;
        }
        UsersImagesStore._overridePicturesStore(pictures);
        return of(newPicture.id);
      }))
  }

  public static getUrlByUser(idUser: number): string {
    const found = UsersImagesStore._getUserImageIndex(idUser);
    if(found.index == -1) {
      return "/img/404.png";
    }
    return found.picture.urlBase64;
  }

  //always ask if index is different to -1
  private static _getUserImageIndex(idUser: number): {index: number, picture: UserPicture} {
    const pictures = UsersImagesStore._getPicturesFromStore();
    const indexFound = pictures.findIndex(p => p.idUser == idUser);
    const pictureFound = pictures[indexFound];
    return {index: indexFound, picture: pictureFound};
  }

  private static _overridePicturesStore(pictures: UserPicture[]) {
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
