import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.scss'],
  host: {
    class: 'profile-main'
  }
})
export class BillDetailComponent implements OnInit {
  bill: any;
  private subs = new SubSink();
  displayedColumns = ['isbn', 'name', 'price', 'quantity'];
  constructor(
    private _route: ActivatedRoute,
    private _profile: ProfileService
  ) { }

  ngOnInit(): void {
    const billId = this._route.snapshot.params['id'];
    this.subs.sink = this._profile.getBillDetailForCustomer(billId).subscribe(data => {
      this.bill = data.bill;
    })
  }

}
