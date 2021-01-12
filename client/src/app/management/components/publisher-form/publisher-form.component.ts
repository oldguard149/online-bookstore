import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPublisher } from 'src/app/shared/interfaces/interfaces';
import { ManagementService } from '../../services/management.service';
import { SubSink } from 'subsink';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessageService } from 'src/app/shared/services/flash-message.service';

@Component({
  selector: 'publisher-form',
  templateUrl: './publisher-form.component.html',
  styleUrls: [ '../../style/mform.scss'],
  host: {
    class: 'm-form'
  }
})
export class PublisherFormComponent implements OnInit {
  @Input() type: 'create' | 'update';
  @Input('publisher') publisherDataForUpdate: IPublisher;
  @Output() sendMessage: EventEmitter<any> = new EventEmitter<any>();
  private subs = new SubSink();
  form: FormGroup;
  onSubmit: any;
  displayButton: string;
  constructor(
    private fb: FormBuilder,
    private management: ManagementService,
    private route: ActivatedRoute,
    private flash: FlashMessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    if (this.type === 'create') {
      this.onSubmit = this.createPublisher;
      this.displayButton = 'Thêm';
    } else {
      this.onSubmit = this.updatePublisher;
      this.displayButton = 'Cập nhật';
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    
  }

  initializeForm() {
    if (this.type === 'update' && this.publisherDataForUpdate) {
      const publisher = this.publisherDataForUpdate;
      this.form = this.fb.group({
        name: [publisher.name, Validators.required],
        address: [publisher.address ? publisher.address : ''],
        email: [publisher.email ? publisher.email : '']
      });
    } else {
      this.form = this.fb.group({
        name: ['', Validators.required],
        address: [''],
        email: ['']
      });
    }
  }

  createPublisher() {
    if (this.form.valid) {
      this.subs.sink = this.management.create('publisher', this.form.value).subscribe(data => {
        if (data.success) {
          this.triggerSendMessageEvent('success', data.message);
          this.form.reset();
        } else {
          this.triggerSendMessageEvent('success', data.message);
        }
      });
    }
  }

  updatePublisher() {
    if (this.form.valid) {
      const publisherId = this.route.snapshot.params['id'];
      this.subs.sink = this.management.update('publisher', publisherId, this.form.value)
      .subscribe(data => {
        if (data.success) {
          this.flash.setMessage('success', data.message[0]);
          this.router.navigateByUrl('/search/publisher');
        } else {
          this.triggerSendMessageEvent('success', data.message);
        }
      })
    }
  }

  get publisherName() {
    return this.form.get('name');
  }

  triggerSendMessageEvent(type: 'success' | 'fail', message: string[]) {
    this.sendMessage.emit({ type: type, message: message });
  }

}
