import { Component, OnInit, Input } from '@angular/core';
import { scrollToTop } from 'src/app/shared/functions/scrollToTop';

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

  scrollTop() {
    scrollToTop();
  }

}
