import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-emp-search',
  templateUrl: './emp-search.component.html',
  styleUrls: ['./emp-search.component.scss'],
  host: {
    class: 'management-main'
  }
})
export class EmpSearchComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
