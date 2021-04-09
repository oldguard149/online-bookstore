import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from "../../shared/api-url";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private http: HttpClient
  ) { }
  addToCart(isbn: string, body): any {
    const url = `${API}/add-to-cart/${isbn}`;
    return this.http.post(url, body).toPromise();
  }

  getCartItems(): any {
    const url = `${API}/cart`;
    return this.http.get(url).toPromise();
  }

  deleteCartItem(isbn: string): any {
    const url = `${API}/delete-cart-item/${isbn}`;
    return this.http.get(url).toPromise();
  }

  updateCartItems(body): any {
    const url = `${API}/update-cart-items`;
    return this.http.post(url, body).toPromise();
  }

  //** Return array number from [startValue, ..., n] */
  range(n: number, startValue = 1) {
    !Number.isNaN(n) ? n = n : n = 1;
    return [...Array(n).keys()].map(x => x+1);
  }
}
