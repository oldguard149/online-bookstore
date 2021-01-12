import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ManagementService } from '../../services/management.service';
import { ConfirmDeleteDialogComponent } from "../confirm-delete-dialog/confirm-delete-dialog.component";

@Component({
  selector: 'app-genre-delete',
  templateUrl: './genre-delete.component.html',
  styleUrls: ['./genre-delete.component.scss']
})
export class GenreDeleteComponent implements OnInit {
  genre: any;
  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    private _management: ManagementService
  ) { }

  ngOnInit(): void {
    const genreId = this.route.snapshot.params['id'];
    this._management.getDetail('genre', genreId).subscribe(data => {
      this.genre = data.genre;
    });
  }

  openDialog(): void {
    this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: {
        id: this.route.snapshot.params['id'],
        name: this.genre.fullname,
        type: 'book'
      }
    });
  }
}
