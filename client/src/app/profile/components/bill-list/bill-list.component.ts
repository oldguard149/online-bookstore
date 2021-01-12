import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.scss'],
  host: {
    class: 'profile-main'
  }
})
export class BillListComponent implements OnInit {
  private subs = new SubSink();
  bills: any;
  totalItems: number;
  displayedColumns = ['id', 'createdate', 'state', 'totalamount'];
  constructor(
    private _profile: ProfileService
  ) { }

  ngOnInit(): void {
    this.subs.sink = this._profile.getBillListForCustomer().subscribe(data => {
      this.bills = data.bills;
      this.totalItems = data.totalItems;
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
