import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { BillService } from '../../services/bill.service';
import { SubSink } from 'subsink';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  host: {
    class: 'wrapper-checkout'
  }
})
export class CheckoutComponent implements OnInit {
  customerForm: FormGroup;
  checkoutForm: FormGroup = this.fb.group({
    checkoutMethod: ['0', Validators.required],
    cartItemsFormArray: this.fb.array([])
  });
  private subs = new SubSink();
  cartItems: any;
  displayedColumns = ['item', 'quantity', 'delete-option']
  constructor(
    private fb: FormBuilder,
    private bill: BillService,
    private cart: CartService
  ) { }

  ngOnInit(): void {
    this.subs.sink =  this.bill.getCustomerInfo().subscribe(data => {
      console.log(data.customer);
      
      this.customerForm = this.fb.group({
        name: ['name sdf', [Validators.required]],
        phoneNumber: [data.customer.phone_number, [Validators.required]],
        address: [data.customer.address, [Validators.required]]
      });
    });
    
    this.checkoutForm = this.fb.group({
      checkoutMethod: ['0', Validators.required],
      cartItemsFormArray: this.fb.array([])
    });

    this.fetchCartItems();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.saveChangesOfCartItems();
  }

  updateCustomerInfo() {
    console.log(this.customerForm.value);
  }

  createBill() {
    console.log(this.checkoutForm.value);
  }

  deleteItem(i: number): void {
    this.cart.deleteCartItem(this.cartItems[i].isbn)
    .then(data => {
      if (data.success) {
        this.cartItemsForm.removeAt(i);
        this.cartItems.splice(i, 1);
      }
    });
  }

  saveChangesOfCartItems() {
    const data = this.checkoutForm.value;
    this.cart.updateCartItems(data).then(data => {
      if (data.success) {
        console.log(data.message);
      }
    });
  }

  get cartItemsForm() {
    return this.checkoutForm.get('cartItemsFormArray') as FormArray;
  }

  fetchCartItems() {
    this.cart.getCartItems().then(data => {
      if (data.success) {
        this.cartItems = data.cartItems;
        // this.totalItems = data.totalItems;
        
        this.preprocessCartItems();
        for (let i = 0; i < parseInt(data.totalItems); i++) {
          this.cartItemsForm.push(this.fb.group({
            isbn: [data.cartItems[i].isbn],
            quantity: [data.cartItems[i].order_qty],
            price: [data.cartItems[i].price]
          }));
        }
      }
    });
  }

  preprocessCartItems() {
    for (let i = 0; i < this.cartItems.length; i++) {
      this.cartItems[i].available_qty = this.cart.range(this.cartItems[i].available_qty);
      this.cartItems[i].authors = this.cartItems[i].authors.join(', ');
    }
  }

}
