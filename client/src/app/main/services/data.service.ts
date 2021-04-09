import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../../shared/api-url';

@Injectable()
export class DataService {

  constructor(
    private http: HttpClient
  ) { }

  private get(urlPath: string, options = {}): Observable<any> {
    const url = `${API}/${urlPath}`;
    return this.http.get<any>(url, options);
  }

  getIndexBooklist(currentPage: string = "1", pageSize = "30") {
    const urlPath = 'booklist';
    const options = {
      params: new HttpParams()
        .set('page', currentPage)
        .set('pagesize', pageSize)
    };
    return this.get(urlPath, options).toPromise();
  }

  getSidenav() {
    const urlPath = 'sidenav';
    return this.get(urlPath).toPromise();
  }

  getBookDetail(isbn: string) {
    const urlPath = `book/${isbn}`;
    return this.get(urlPath).toPromise();
  }

  getList(type: 'author' | 'genre' | 'publisher', currentPage: string = "1", pageSize: string = "30") {
    const options = {
      params: new HttpParams()
        .set('page', currentPage)
        .set('pagesize', pageSize)
    }
    return this.get(type, options);
  }

  getDetail(type: 'author' | 'genre' | 'publisher', id: string,
    currentPage: string = '1', pageSize: string = '30') {

    const options = {
      params: new HttpParams()
        .set('page', currentPage)
        .set('pagesize', pageSize)
    };
    const urlPath = `${type}/${id}`;
    return this.get(urlPath, options);
  }

  getSideAdBooklist() {
    const urlPath = `side-ad-booklist`;
    return this.get(urlPath).toPromise();
  }

  getSideAdForCustomer() {
    return this.get(`side-ad-for-customer`).toPromise();
  }

  getSideAdForGuest() {
    return this.get('side-ad-for-guest').toPromise();
  }

  search(type: 'book' | 'author' | 'publisher' | 'genre', searchtext: string, offset: number, limit: number) {
    const options = {
      params: new HttpParams()
        .set('search', searchtext)
        .set('type', type)
        .set('offset', String(offset))
        .set('limit', String(limit))
    }
    return this.http.get<any>(`${API}/search`, options);
  }

  getRecommendBooks(isbn: string, noOfBook: string) {
    const options = {
      params: new HttpParams().set('number', noOfBook)
    }
    return this.http.get<any>(`${API}/recommend/${isbn}`, options);
  }
}
