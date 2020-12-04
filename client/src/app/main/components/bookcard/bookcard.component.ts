import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bookcard',
  templateUrl: './bookcard.component.html',
  styleUrls: ['./bookcard.component.scss']
})
export class BookcardComponent implements OnInit {
  @Input() name: string;
  @Input() isbn: string;
  @Input() image_url: string;
  @Input() author: string;
  @Input() price: number;
  
  constructor() { }

  ngOnInit(): void {
  }

}
