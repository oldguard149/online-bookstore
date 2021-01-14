import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { LocalCartService } from '../../services/local-cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  form: FormGroup;
  totalItems: number;
  totalPrice: number = 0;
  cartItems: any;
  private subs = new SubSink();
  constructor(
    private fb: FormBuilder,
    private cart: CartService,
    private router: Router,
    private _auth: AuthenticationService,
    private _localCart: LocalCartService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      cartItemFormArray: this.fb.array([])
    });
    this.fetchCartItems();
    this.subs.sink = this.cartItemFormArray.valueChanges.subscribe(() => {
      this.totalPrice = 0;
      this.calculateTotalAmount();
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.saveChanges();
  }

  fetchCartItems() {
    if (this._auth.isLoggedIn()) {
      this.cart.getCartItems().then(data => {
        this.handleFetchCartItems(data);
      });
    } else { // fetch items from local cart
      this._localCart.getCartItems().subscribe(data => {
        this.handleFetchCartItems(data);
      })
    }
    this.calculateTotalAmount();
  }

  deleteCartItem(i: number) {
    if (this._auth.isLoggedIn()) {
      this.cart.deleteCartItem(this.cartItems[i].isbn)
        .then(data => {
          if (data.success) {
            this.cartItemFormArray.removeAt(i);
            this.cartItems.splice(i, 1);
          }
        });
    } else {
      this.cartItemFormArray.removeAt(i);
      this.cartItems.splice(i, 1);
    }
  }

  saveChanges() {
    const data = this.form.value;
    if (this._auth.isLoggedIn()) {
      this.cart.updateCartItems(data).then(data => {
        if (data.success) {
          console.log(data.message);
        }
      })
    } else {
      this._localCart.updateLocalCart(data);
    }
  }

  onSubmit(): void {
    this.router.navigateByUrl('/checkout');
  }

  get cartItemFormArray() {
    return this.form.get('cartItemFormArray') as FormArray;
  }

  private calculateTotalAmount() {
    for (let controls of this.cartItemFormArray.controls) {
      this.totalPrice += parseInt(controls.value.quantity) * parseInt(controls.value.price);
    }
  }

  private preprocessCartItems() {
    for (let i = 0; i < this.cartItems.length; i++) {
      this.cartItems[i].available_qty = this.cart.range(this.cartItems[i].available_qty);
      this.cartItems[i].authors = this.cartItems[i].authors.join(', ');
    }
  }

  private handleFetchCartItems(data: any) {
    if (data.success) {
      this.cartItems = data.cartItems;
      this.totalItems = data.totalItems;
      this.preprocessCartItems();
      for (let i = 0; i < parseInt(data.totalItems); i++) {
        this.cartItemFormArray.push(this.fb.group({
          isbn: [data.cartItems[i].isbn],
          quantity: [data.cartItems[i].order_qty],
          price: [data.cartItems[i].price]
        }));
      }
    }
  }
}
