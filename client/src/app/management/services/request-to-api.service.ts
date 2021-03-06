import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/shared/api-url';


@Injectable()
export class RequestToApiService {

  constructor(
    private http: HttpClient

  ) { }

  private get(urlPath: string, options = {}): Observable<any> {
    const url = `${API}/management/${urlPath}`;
    return this.http.get(url, options);
  }

  /** Create new data */
  private post(urlPath: string, body): Observable<any> {
    const url = `${API}/management/${urlPath}`;
    return this.http.post(url, body);
  }

  /** Update. Ex: url='genre/4' */
  private put(urlPathContainId: string, body): Observable<any> {
    const url = `${API}/management/${urlPathContainId}`;
    return this.http.put(url, body);
  }

  private delete(urlPathContainId: string): Observable<any> {
    const url = `${API}/management/${urlPathContainId}`;
    return this.http.delete(url);
  }

  search(type: 'genre' | 'author' | 'publisher' | 'book' | 'employee',
    search: string, page: string, pageSize: string): Observable<any> {
    const url = `search/${type}`;
    const options = {
      params: new HttpParams()
        .set('search', search)
        .set('page', page)
        .set('pagesize', pageSize)
    };
    return this.get(url, options);
  }

  create
}
