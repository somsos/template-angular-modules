import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UsersDao } from './UsersDao';

@Injectable({
  providedIn: 'root'
})
export class UsersFileDao {

  private readonly _http = inject(HttpClient);

  uploadImage(idUser: number, picture: File): Observable<number> {
    const { url, body } = this._buildRequestUpload(idUser, picture);
    return this._http.post<number>(url, body);
  }


  private _buildRequestUpload(idUser: number, picture: File): {url: string, body: FormData} {
    const formData = new FormData();
    formData.append("picture", picture, picture.name);
    const url = UsersDao.endPoints.get("uploadImage")!.url;
    const urlWithVal = url.replace('${id}', idUser + '');
    return { url: urlWithVal,  body: formData }
  }


}
