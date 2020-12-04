import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-index',
  templateUrl: './auth-index.component.html',
  styleUrls: ['./auth-index.component.scss'],
  host: {
    class: 'auth_wrapper'
  }
})
export class AuthIndexComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
