import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      cartItemFormArray: this.fb.array([])
    });
    this.fetchCartItems();
    this.subs.sink = this.cartItemFormArray.valueChanges.subscribe(() => {
      this.totalPrice = 0;
      this.calculateTotalPrice();
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.saveChanges();
  }

  fetchCartItems() {
    this.cart.getCartItems().then(data => {
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
    });
    this.calculateTotalPrice();
  }

  deleteCartItem(i: number) {
    this.cart.deleteCartItem(this.cartItems[i].isbn)
    .then(data => {
      if (data.success) {
        this.cartItemFormArray.removeAt(i);
        this.cartItems.splice(i, 1);
      }
    });
  }

  calculateTotalPrice() {
    for (let controls of this.cartItemFormArray.controls) {
      this.totalPrice += parseInt(controls.value.quantity) * parseInt(controls.value.price);
    }
  }

  saveChanges() {
    const data = this.form.value;
    this.cart.updateCartItems(data).then(data => {
      if (data.success) {
        console.log(data.message);
      }
    });
  }

  onSubmit(): void {
    this.router.navigateByUrl('/checkout');
  }

  get cartItemFormArray() {
    return this.form.get('cartItemFormArray') as FormArray;
  }

  preprocessCartItems() {
    for (let i = 0; i < this.cartItems.length; i++) {
      this.cartItems[i].available_qty = this.cart.range(this.cartItems[i].available_qty);
      this.cartItems[i].authors = this.cartItems[i].authors.join(', ');
    }
  }
}
