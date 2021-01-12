import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ManagementService } from '../../services/management.service';
import { ConfirmDeleteDialogComponent } from "../confirm-delete-dialog/confirm-delete-dialog.component";

@Component({
  selector: 'app-author-delete',
  templateUrl: './author-delete.component.html',
  styleUrls: ['./author-delete.component.scss'],
  host: {
    class: 'management-main'
  }
})
export class AuthorDeleteComponent implements OnInit {
  author: any;
  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    private _management: ManagementService
  ) { }

  ngOnInit(): void {
    const authorId = this.route.snapshot.params['id'];
    this._management.getDetail('author', authorId).subscribe(data => {
      this.author = data.author;
    });
  }

  openDialog(): void {
    this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: {
        id: this.route.snapshot.params['id'],
        name: this.author.fullname,
        type: 'book'
      }
    });
  }

}
