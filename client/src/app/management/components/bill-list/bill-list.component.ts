import { Component, OnInit } from '@angular/core';
import { ManagementService } from '../../services/management.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'management-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.scss']
})
export class BillListComponent implements OnInit {
  private subs = new SubSink();
  bills: any;
  totalItems: number;
  displayedColumns = ['id', 'createdate', 'state', 'totalamount', 'option'];
  constructor(
    private _management: ManagementService
  ) { }

  ngOnInit(): void {
    this.subs.sink = this._management.billList().subscribe(data => {
      this.bills = data.bills;
      this.totalItems = data.totalItems;
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
