import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManagementService } from '../../services/management.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-emp-update',
  templateUrl: './emp-update.component.html',
  styleUrls: ['./emp-update.component.scss']
})
export class EmpUpdateComponent implements OnInit {
  employee: any;
  errorMsg: string[];
  private subs = new SubSink();
  constructor(
    private _management: ManagementService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const empId = this._route.snapshot.params['id'];
    this._management.getDetail('employee', empId).subscribe(data => {
      if (data.success) {
        this.employee = data.employee;
      } else {
        this.errorMsg = data.message;
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getMessage(msgObject: any) {
    const { type, message } = msgObject;
    this.errorMsg = message;
  }

}
