import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-test-cart',
  templateUrl: './test-cart.component.html',
  styleUrls: ['./test-cart.component.scss']
})
export class TestCartComponent implements OnInit {
  displayedColumns = ['item', 'quantity', 'delete-option'];
  form: FormGroup;
  cartItems: any;
  constructor(
    private cart: CartService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      cartItemFormArray: this.fb.array([])
    });
    this.fetchCartItems();
  }

  fetchCartItems() {
    this.cart.getCartItems().then(data => {
      if (data.success) {
        this.cartItems = data.cartItems;
        // this.totalItems = data.totalItems;
        
        this.preprocessCartItems();
        for (let i = 0; i < parseInt(data.totalItems); i++) {
          this.cartItemForms.push(this.fb.group({
            isbn: [data.cartItems[i].isbn],
            quantity: [data.cartItems[i].order_qty],
            price: [data.cartItems[i].price]
          }));
        }
      }
    });
  }

  showFormValue(): void {
    console.log(this.cartItemForms.value);
  }

  get cartItemForms() {
    return this.form.get('cartItemFormArray') as FormArray;
  }

  preprocessCartItems() {
    for (let i = 0; i < this.cartItems.length; i++) {
      this.cartItems[i].available_qty = this.range(this.cartItems[i].available_qty);
      this.cartItems[i].authors = this.cartItems[i].authors.join(', ');
    }
  }

  //** Return array number from [startValue, ..., n] */
  private range(n: number, startValue = 1) {
    !Number.isNaN(n) ? n = n : n = 1;
    return [...Array(n).keys()].map(x => x+1);
  }

}
