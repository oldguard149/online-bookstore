import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IGenre } from 'src/app/shared/interfaces/interfaces';
import { FlashMessageService } from 'src/app/shared/services/flash-message.service';
import { ManagementService } from '../../services/management.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'genre-form',
  templateUrl: './genre-form.component.html',
  styleUrls: ['../../style/mform.scss'],
  host: {
    class: 'm-form'
  }
})
export class GenreFormComponent implements OnInit {
  @Input() type: 'update' | 'create';
  @Input('genre') genreDataForUpdate: IGenre;
  @Output() sendMessage: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  displayButton: string;
  onSubmit: any;
  private subs = new SubSink();

  constructor(
    private fb: FormBuilder,
    private management: ManagementService,
    private route: ActivatedRoute,
    private flash: FlashMessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
    this.initializeFormForUpdate();

    if (this.type === 'update') {
      this.displayButton = 'Cập nhật';
      this.onSubmit = this.updateGenre;
    } else {
      this.displayButton = 'Tạo';
      this.onSubmit = this.createGenre;
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subs.unsubscribe();
  }

  initializeFormForUpdate() {
    if (this.type === 'update') {
      const genre = this.genreDataForUpdate;
      this.name.setValue(genre.name);
    }
  }

  createGenre() {
    if (this.form.valid) {
      const genre = this.form.value;
      this.subs.sink = this.management.create('genre', genre).subscribe(data => {
        if (data.success) {
          this.triggerSendMessageEvent('success', data.message);
          this.form.reset();
        } else {
          this.triggerSendMessageEvent('fail', data.message);
        }
      });
    }
  }

  updateGenre() {  
    if (this.form.valid) {
      const genre = this.form.value;
      const genreId = this.route.snapshot.params['id'];
      this.subs.sink = this.management.update('genre', genreId, genre).subscribe(data => {
        if (data.success) {
          this.flash.setMessage('success', data.message[0]);
          this.router.navigateByUrl('/management/search/genre');
        } else {
          this.triggerSendMessageEvent('fail', data.message);
        }
      })
    }
  }

  triggerSendMessageEvent(type: 'success' | 'fail', message: string[]) {
    this.sendMessage.emit({ type: type, message: message });
  }

  get name() {
    return this.form.get('name');
  }

}
