import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FlashMessageService } from 'src/app/shared/services/flash-message.service';
import { ManagementService } from '../../services/management.service';
import { SubSink } from 'subsink';

export interface IDeleteDataObj {
  id: string;
  type: 'book' | 'employee' | 'genre' | 'publisher' | 'author';
  name: string;
}

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
})
export class ConfirmDeleteDialogComponent implements OnInit {
  private subs = new SubSink();
  displayName = {
    'book': 'sách',
    'publisher': 'nhà xuất bản',
    'genre': 'thể loại sách',
    'author': 'tác giả'
  }
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDeleteDataObj,
    private _management: ManagementService,
    private _flash: FlashMessageService,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  delete(data: IDeleteDataObj): void{
    this.subs.sink = this._management.delete(data.type, data.id).subscribe(result => {
      if (result.success) {
        this._flash.setMessage('success', result.message[0]);
        this._router.navigateByUrl(`/management/search/${data.type}`);
      } else {
        this._flash.setMessage('fail', result.message[0]);
      }
    })
    this.dialogRef.close();
  }

}
