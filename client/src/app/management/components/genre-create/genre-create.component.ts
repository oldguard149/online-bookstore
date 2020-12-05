import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-genre-create',
  templateUrl: './genre-create.component.html',
  styleUrls: ['./genre-create.component.scss']
})
export class GenreCreateComponent implements OnInit {
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
