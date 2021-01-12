import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ManagementService } from '../../services/management.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-book-delete',
  templateUrl: './book-delete.component.html',
  styleUrls: ['./book-delete.component.scss'],
  host: {
    class: 'management-main'
  }
})
export class BookDeleteComponent implements OnInit {
  book: any;
  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    private _management: ManagementService,
  ) { }

  ngOnInit(): void {
    const isbn = this.route.snapshot.params['isbn'];
    this._management.getDetail('book', isbn).subscribe(data => {
      this.book = data.book;
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: {
        id: this.route.snapshot.params['isbn'],
        name: this.book.name,
        type: 'book'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}