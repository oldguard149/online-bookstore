import { Component, OnInit } from '@angular/core';
import { ManagementService } from '../../services/management.service';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { apiurl } from 'src/app/shared/api-url';

@Component({
  selector: 'management-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.scss'],
  host: {
    class: 'management-main'
  }
})
export class BillListComponent implements OnInit {
  private subs = new SubSink();
  bills: any;
  totalItems: number;
  displayedColumns = ['id', 'createdate', 'state', 'totalamount', 'option'];
  constructor(
    private _management: ManagementService,
    private _router: Router,
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

  manageBill(id: string) {
    this._router.navigateByUrl(`${apiurl}/management/bill/${id}`);
  }

}
