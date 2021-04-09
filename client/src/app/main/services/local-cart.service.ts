import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { API } from 'src/app/shared/api-url';

interface ILocalCart {
  expirey_date: number;
  items: {};
}


@Injectable({
  providedIn: 'root'
})
export class LocalCartService {
  localCartItems: ILocalCart = <ILocalCart>{};
  constructor(
    private _http: HttpClient
  ) { }

  private getLocalCart() {
    const localStorageValue = localStorage.getItem('localcart');
    if (localStorageValue) {
      this.localCartItems = JSON.parse(localStorageValue);
      if (this.localCartItems.expirey_date < Date.now() / 1000) {
        this.clearLocalCart();
      }
    }
    return this.localCartItems;
  }

  addItemToLocalCart(isbn: string, order_qty: number): void {
    this.localCartItems = this.getLocalCart();
    console.log(this.localCartItems);
    if (this.isLocalCartEmpty()) { // initialize cart
      this.localCartItems = {
        expirey_date: this.getExpireyDate(),
        items: {}
      }
      this.localCartItems.items[isbn] = order_qty;
    } else {
      if (isbn in this.localCartItems.items) { // item already exist in cart
        const currentQuantity = Number(this.localCartItems.items[isbn]);
        this.localCartItems.items[isbn] = Number(order_qty) + currentQuantity;
      } else { // new item
        this.localCartItems.items[isbn] = Number(order_qty);
      }
    }

    this.saveLocalCart(this.localCartItems);
  }

  updateLocalCart(formValue: any) {
    const cartItems = formValue.cartItemFormArray;
    const expireydDate = this.localCartItems.expirey_date;
    this.clearLocalCart();

    this.localCartItems = {
      expirey_date: expireydDate,
      items: {}
    }
    for (const item of cartItems) {
      this.localCartItems.items[item.isbn] = Number(item.quantity);
    }
    this.saveLocalCart(this.localCartItems);
  }

  saveLocalCart(tempCart: ILocalCart): void {
    this.localCartItems = tempCart;
    localStorage.setItem('localcart', JSON.stringify(this.localCartItems));
  }

  getCartItems() {
    this.localCartItems = this.getLocalCart();
    if (!this.isLocalCartEmpty()) {
      return this._http.post<any>(`${API}/cartitems-with-isbnlist`, { items: this.localCartItems.items });
    } else {
      return of({ success: false });
    }
  }

  syncLocalCartWithServerCart() {
    this.localCartItems = this.getLocalCart();
    if (!this.isLocalCartEmpty()) {
      const form = [];
      for (const key of Object.keys(this.localCartItems.items)) {
        form.push({ isbn: key, quantity: this.localCartItems.items[key] });
      }
      return this._http.post<any>(`${API}/sync-cart`, { items: form });
    } else {
      return of({success: false});
    }
  }



  clearLocalCart() {
    this.localCartItems = <ILocalCart>{};
    localStorage.removeItem('localcart');
  }

  private isLocalCartEmpty(): boolean {
    return Object.keys(this.localCartItems).length === 0;
  }

  private getExpireyDate(): number {
    const date = new Date();
    return date.setDate(date.getDate() + 2) / 1000;
  }

}
