import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {
  @Input('cartItem') item: any;
  @Input('index') i: number;
  @Output() onDeleteItem: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  deleteCartItem(i: number) {
    this.onDeleteItem.emit(i);
  }

}
