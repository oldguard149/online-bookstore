import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiurl } from "../../shared/api-url";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private http: HttpClient
  ) { }
  addToCart(isbn: string, body): any {
    const apiUrl = `${apiurl}/add-to-cart/${isbn}`;
    return this.http.post(apiUrl, body).toPromise();
  }

  getCartItems(): any {
    const apiUrl = `${apiurl}/cart`;
    return this.http.get(apiUrl).toPromise();
  }

  deleteCartItem(isbn: string): any {
    const apiUrl = `${apiurl}/delete-cart-item/${isbn}`;
    return this.http.get(apiUrl).toPromise();
  }

  updateCartItems(body): any {
    const apiUrl = `${apiurl}/update-cart-items`;
    return this.http.post(apiUrl, body).toPromise();
  }

  //** Return array number from [startValue, ..., n] */
  range(n: number, startValue = 1) {
    !Number.isNaN(n) ? n = n : n = 1;
    return [...Array(n).keys()].map(x => x+1);
  }
}
