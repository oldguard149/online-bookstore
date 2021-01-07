import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from "@angular/material/snack-bar";
import { IBook } from 'src/app/shared/interfaces/interfaces';
import { SubSink } from 'subsink';
import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
  host: {
    class: 'book-detail'
  }
})
export class BookDetailComponent implements OnInit {
  book: IBook;
  recommendBook: IBook[];
  orderQtyForm: FormControl;
  // orderForm: FormGroup;
  available_qty: number[] = [];
  private isbn: string;
  private subs = new SubSink();
  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private _snackBar: MatSnackBar,
    private cart: CartService
  ) { }

  ngOnInit(): void {
    this.orderQtyForm = new FormControl('1');
    this.subs.sink = this.route.params.subscribe(params => {
      this.isbn = params['isbn'];
      this.data.getBookDetail(this.isbn).then(data => {
        if (data.success) {
          this.book = data.book;          
          this.available_qty = [...Array(data.book.available_qty).keys()].map(x => x + 1);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmit() {
    const isbn = this.route.snapshot.params['isbn'];
    const order = this.orderQtyForm.value;
    console.log(order);
    
    this.cart.addToCart(isbn, {order_qty: order})
      .then(data => {
        this.openSnackbar(data.message[0]);
      });

  }

  openSnackbar(message: string) {
    this._snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }
}
