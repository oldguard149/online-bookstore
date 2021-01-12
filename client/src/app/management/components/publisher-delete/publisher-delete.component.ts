import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ManagementService } from '../../services/management.service';
import { ConfirmDeleteDialogComponent } from "../confirm-delete-dialog/confirm-delete-dialog.component";

@Component({
  selector: 'app-publisher-delete',
  templateUrl: './publisher-delete.component.html',
  styleUrls: ['./publisher-delete.component.scss']
})
export class PublisherDeleteComponent implements OnInit {
  publisher: any;
  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    private _management: ManagementService
  ) { }

  ngOnInit(): void {
    const publisherId = this.route.snapshot.params['id'];
    this._management.getDetail('publisher', publisherId).subscribe(data => {
      this.publisher = data.publisher;
    });
  }

  openDialog(): void {
    this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: {
        id: this.route.snapshot.params['id'],
        name: this.publisher.name,
        type: 'book'
      }
    });
  }

}
