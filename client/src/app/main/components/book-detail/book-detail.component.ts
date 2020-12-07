import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IBook } from 'src/app/shared/interfaces/interfaces';
import { SubSink } from 'subsink';
import { DataService } from '../../services/data.service';

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
  order_qty: FormControl;
  available_qty: number[] = [];
  private isbn: string;
  private subs = new SubSink();
  constructor(
    private route: ActivatedRoute,
    private data: DataService

  ) { }

  ngOnInit(): void {
    this.order_qty = new FormControl(1);
    this.subs.sink = this.route.params.subscribe(params => {
      this.isbn = params['isbn'];
      this.data.getBookDetail(this.isbn).then(data => {
        if (data.success) {
          this.book = data.book;
          this.available_qty = [...Array(data.book.available_qty).keys()].map(x => x+1);
        }
      });
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subs.unsubscribe();
  }

  onSubmit() {
    console.log(this.order_qty.value);
    
  }
}
