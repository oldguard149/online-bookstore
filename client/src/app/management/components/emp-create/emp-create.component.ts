import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-emp-create',
  templateUrl: './emp-create.component.html',
  styleUrls: ['./emp-create.component.scss']
})
export class EmpCreateComponent implements OnInit {
  errorMsg: string[];
  successMsg: string[];
  constructor() { }

  ngOnInit(): void {
  }

  getMessage(msgObj) {
    const { type , message } = msgObj;
    type === 'success' ? this.successMsg = message : this.errorMsg = message;
  }

}
