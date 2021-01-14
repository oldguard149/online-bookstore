import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiurl } from 'src/app/shared/api-url';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  constructor(
    private http: HttpClient
  ) { }

  private apiGet(urlPath: string, options = {}): Observable<any> {
    const url = `${apiurl}/management/${urlPath}`;
    return this.http.get(url, options);
  }

  /** Create new data */
  private apiPost(urlPath: string, body): Observable<any> {
    const url = `${apiurl}/management/${urlPath}`;
    return this.http.post(url, body);
  }

  /** Update. Ex: url='genre/4' */
  private apiPut(urlPathContainId: string, body): Observable<any> {
    const url = `${apiurl}/management/${urlPathContainId}`;
    return this.http.put(url, body);
  }

  private apiDelete(urlPathContainId: string): Observable<any> {
    const url = `${apiurl}/management/${urlPathContainId}`;
    return this.http.delete(url);
  }

  public search(type: 'genre' | 'author' | 'publisher' | 'book',
    search: string, page: string, pageSize: string): Observable<any> {
    const url = `search/${type}`;
    const options = {
      params: new HttpParams()
        .set('search', search)
        .set('page', page)
        .set('pagesize', pageSize)
    };
    return this.apiGet(url, options);
  }

  public create(type: 'genre' | 'author' | 'publisher' | 'book' | 'employee', data: any): Observable<any> {
    return this.apiPost(type, data);
  }

  public update(type: 'genre' | 'author' | 'publisher' | 'book' | 'employee', id: string, data: any): Observable<any> {
    return this.apiPut(`${type}/${id}`, data);
  }

  public getDetail(type: 'genre' | 'author' | 'publisher' | 'book' | 'employee', id: string): Observable<any> {
    return this.apiGet(`${type}/${id}`);
  }

  public delete(type: 'genre' | 'author' | 'publisher' | 'book' | 'employee', id: string): Observable<any> {
    return this.apiDelete(`${type}/${id}`);
  }

  public genresAndPublishers(): Observable<any> {
    return this.apiGet('genres-and-publishers');
  }

  public billList(): Observable<any> {
    return this.apiGet('bills');
  }

  public billDetails(id: string): Observable<any> {
    return this.apiGet(`bill/${id}`);
  }
}
