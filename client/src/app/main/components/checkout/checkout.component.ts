import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BillService } from '../../services/bill.service';
import { SubSink } from 'subsink';
import { CartService } from '../../services/cart.service';
import { ProfileService } from 'src/app/profile/services/profile.service';
import { Router } from '@angular/router';

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
  checkoutForm: FormGroup;
  private subs = new SubSink();
  cartItems: any;
  displayedColumns = ['item', 'quantity', 'delete-option']
  constructor(
    private fb: FormBuilder,
    private bill: BillService,
    private cart: CartService,
    private profile: ProfileService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.subs.sink =  this.bill.getCustomerInfo().subscribe(data => {
      this.customerForm.patchValue({
        fullname: data.user.fullname,
        phoneNumber: data.user.phone_number,
        address: data.user.address
      });
    });
    
    this.fetchCartItems();
  }

  initializeForms(): void {
    this.customerForm = this.fb.group({
      fullname: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.checkoutForm = this.fb.group({
      checkoutMethod: ['0', Validators.required],
      cartItemsFormArray: this.fb.array([])
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.saveChangesOfCartItems();
  }

  updateCustomerInfo() {
    this.subs.sink = this.profile.updateCustomerProfile(this.customerForm.value).subscribe(data => {
      console.log(data.message);
    })
  }

  createBill() {
    this.subs.sink = this.bill.createBill().subscribe(data => {
      if (data.success) {
        this.router.navigateByUrl(`/bill/${data.billid}`);
      }
    });
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
