import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagementService } from '../../services/management.service';
import { SubSink } from 'subsink';
import { FlashMessageService } from 'src/app/shared/services/flash-message.service';

@Component({
  selector: 'app-author-update',
  templateUrl: './author-update.component.html',
  styleUrls: ['./author-update.component.scss'],
  host: {
    class: 'management-main'
  }
})
export class AuthorUpdateComponent implements OnInit {
  form: FormGroup;
  errorMsg: string[];
  private subs = new SubSink();
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _management: ManagementService,
    private _route: ActivatedRoute,
    private _flash: FlashMessageService
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      fullname: ['', Validators.required],
      info: ['']
    });

    this.fectchDataForForm();
  }

  fectchDataForForm(): void {
    const authorId = this._route.snapshot.params['id'];
    this.subs.sink = this._management.getDetail('author', authorId).subscribe(data => {
      if (data.success) {
        const author = data.author;
        this.form.patchValue({
          fullname: author.fullname,
          info: author?.info
        });
      } else {
        this.errorMsg = data.message;
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const authorId = this._route.snapshot.params['id'];
      this.subs.sink = this._management.update('author', authorId, this.form.value)
        .subscribe(data => {
          if (data.success) {
            this._flash.setMessage('success', data.message[0]);
            this._router.navigateByUrl('/search/author');
          } else {
            this.errorMsg = data.message;
          }
        })
    }
  }
}
