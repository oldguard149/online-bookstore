import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-publisher-create',
  templateUrl: './publisher-create.component.html',
  styleUrls: ['../../style/createupdate.scss'], //'./publisher-create.component.scss',
  host: {
    class: 'management-main'
  }
})
export class PublisherCreateComponent implements OnInit {
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
