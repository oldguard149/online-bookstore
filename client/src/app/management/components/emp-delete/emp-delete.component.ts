import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ManagementService } from '../../services/management.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-emp-delete',
  templateUrl: './emp-delete.component.html',
  styleUrls: ['./emp-delete.component.scss'],
  host: {
    class: 'management-main'
  }
})
export class EmpDeleteComponent implements OnInit {
  emp: any;
  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    private _management: ManagementService
  ) { }

  ngOnInit(): void {
    const empId = this.route.snapshot.params['id'];
    this._management.getDetail('employee', empId).subscribe(data => {
      this.emp = data.employee;
    });
  }

  openDialog() {
    this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: {
        id: this.route.snapshot.params['id'],
        name: this.emp.fullname,
        type: 'employee'
      }
    });
  }

}
