import { Component, OnInit } from '@angular/core';
import { ManagementService } from '../../services/management.service';
import { SubSink } from 'subsink';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-update',
  templateUrl: './book-update.component.html',
  styleUrls: ['./book-update.component.scss'],
  host: {
    class: 'management-main'
  }
})
export class BookUpdateComponent implements OnInit {
  book: any;
  errorMsg: string[];
  private subs = new SubSink();
  constructor(
    private _management: ManagementService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const isbn = this._route.snapshot.params['isbn'];
    this.subs.sink = this._management.getDetail('book', isbn).subscribe(data => {
      if (data.success) {
        this.book = data.book;
      } else {
        this.errorMsg = data.message;
      }
    });
  }

  getMessage(msgObject: any) {
    const { type, message } = msgObject;
    this.errorMsg = message;
  }

}
