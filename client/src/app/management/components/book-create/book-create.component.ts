import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['../../style/createupdate.scss'],
  host: {
    class: 'management-main'
  }
})
export class BookCreateComponent implements OnInit {
  errorMsg: string[];
  successMsg: string[];
  constructor() { }

  ngOnInit(): void {
  }

  getMessage(msgObject: any) {
    const {type, message} = msgObject;
    if (type === 'fail') {
      this.errorMsg = message;
    } else {
      this.successMsg = message;
    }
  }
}
