import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessageService } from 'src/app/shared/services/flash-message.service';
import { ManagementService } from '../../services/management.service';

@Component({
  selector: 'management-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.scss'],
  host: {
    class: 'management-main'
  }
})
export class BillDetailComponent implements OnInit {
  bill: any;
  displayedColumns = ['isbn', 'name', 'quantity', 'price'];
  errorMsg: string[];
  constructor(
    private _management: ManagementService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _flash: FlashMessageService
  ) { }

  ngOnInit(): void {
    const billId = this._route.snapshot.params['id'];
    this._management.billDetails(billId).subscribe(data => {
      if (data.success) {   
        console.log(data.bill);
          
        this.bill = data.bill;
      } else {
        // invalid bill id
        this._flash.setMessage('fail', data.message[0]);
        this._router.navigateByUrl('/management/bills');
      }
    });
  }

  confirm(id: string) {
    this._management.confirmBill(id).subscribe(data => {
      if (data.success) {
        this._flash.setMessage('success', data.message[0]);
        this._router.navigateByUrl('/management/bills');
      } else {
        this.errorMsg = data.message;
      }
    })
  }

  cancel(id: string) {
    this._management.cancelBill(id).subscribe(data => {
      if (data.success) {
        this._flash.setMessage('success', data.message[0]);
        this._router.navigateByUrl('/management/bills');
      } else {
        this.errorMsg = data.message;
      }
    })
  }

}
