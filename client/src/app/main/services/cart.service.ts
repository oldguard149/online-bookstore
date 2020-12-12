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

  getCartItem(): any {
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
}
