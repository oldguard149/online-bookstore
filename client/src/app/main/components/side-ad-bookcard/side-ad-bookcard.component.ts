import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'side-ad-bookcard',
  templateUrl: './side-ad-bookcard.component.html',
  styleUrls: ['./side-ad-bookcard.component.scss']
})
export class SideAdBookcardComponent implements OnInit {
  @Input() name: string;
  @Input() isbn: string;
  @Input() image_url: string;
  constructor() { }

  ngOnInit(): void {
  }

}
