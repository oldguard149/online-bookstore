import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.scss']
})
export class BooklistComponent implements OnInit {
  @Input() booklist: any;
  @Input() pageSize: number;
  @Input() pageIndex: number;
  @Input() totalItems: number;
  constructor() { }

  ngOnInit(): void {
  }

}
