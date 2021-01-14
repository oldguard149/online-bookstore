import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiurl } from 'src/app/shared/api-url';

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

  addItemToLocalCart(isbn: string, order_qty: number): void {
    this.localCartItems = this.getLocalCart();
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
    console.log(this.localCartItems);
    
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
    return this._http.post<any>(`${apiurl}/cartitems-with-isbnlist`, { items: this.localCartItems.items });
  }

  syncLocalWithServerCart() {
    return this._http.post<any>(`${apiurl}/sync-cart`, { items: this.localCartItems.items });
  }



  clearLocalCart() {
    this.localCartItems = <ILocalCart>{};
    localStorage.removeItem('localcart');
  }


  private getLocalCart() {
    const localStorageValue = localStorage.getItem('localcart');
    if (localStorage) {
      this.localCartItems = JSON.parse(localStorageValue);
      if (this.localCartItems.expirey_date < Date.now() / 1000) {
        this.clearLocalCart();
      }
    }
    return this.localCartItems;
  }

  private isLocalCartEmpty(): boolean {
    return Object.keys(this.localCartItems).length === 0;
  }

  private getExpireyDate(): number {
    const date = new Date();
    return date.setDate(date.getDate() + 2) / 1000;
  }

}
