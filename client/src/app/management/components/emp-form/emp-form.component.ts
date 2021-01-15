import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagementService } from '../../services/management.service';
import { SubSink } from 'subsink';
import { FlashMessageService } from 'src/app/shared/services/flash-message.service';

@Component({
  selector: 'emp-form',
  templateUrl: './emp-form.component.html',
  styleUrls: ['../../style/mform.scss'],
  host: {
    class: 'm-form'
  }
})
export class EmpFormComponent implements OnInit {
  @Input() employee: any; // using for update
  @Input() type: 'create' | 'update';
  @Output() sendMessage: EventEmitter<any> = new EventEmitter<any>();
  private subs = new SubSink();
  form: FormGroup;
  onSubmit: any;
  displayButton: string;
  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _management: ManagementService,
    private _flash: FlashMessageService
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      fullname: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      identity_number: ['', [Validators.required, Validators.pattern(/^\d{9}$|^\d{12}$/)]],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/i)], ],
      password: ['', Validators.required],
      role: ['EMP', Validators.required],
      salary: ['', Validators.required]
    });

    if (this.type === 'update') {
      this.initializeFormForUpdate();
      this.onSubmit = this.updateEmp;
      this.displayButton = 'Cập nhật';
    } else {
      this.onSubmit = this.createEmp;
      this.displayButton = 'Tạo';
    }

  }

  initializeFormForUpdate() {
    this.form.patchValue({
      fullname: this.employee.fullname,
      email: this.employee.email,
      identity_number: this.employee.identity_number,
      phone_number: this.employee.phone_number,
      role: this.employee.role,
      salary: this.employee.salary
    });
  }

  createEmp() {
    if (this.form.valid) {
      this.subs.sink = this._management.create('employee', this.form.value).subscribe(data => {
        if (data.success) {
          this.triggerSendMessageEvent('success', data.message);
          this.form.reset();
        } else {
          this.triggerSendMessageEvent('fail', data.message);
        }
      });
    }
  }

  updateEmp() {
    if (this.form.valid) {
      const empId = this._route.snapshot.params['id'];
      this.subs.sink = this._management.update('employee', empId, this.form.value).subscribe(data => {
        if (data.success) {
          this._flash.setMessage('success', data.message[0]);
          this._router.navigateByUrl('/management/search/employee');
        } else {
          this.triggerSendMessageEvent('fail', data.message);
        }
      });
    }
  }


  triggerSendMessageEvent(type: 'success' | 'fail', message: string[]) {
    this.sendMessage.emit({ type: type, message: message });
  }

  get fullname() { return this.form.get('fullname') };
  get email() { return this.form.get('email') };
  get identity_number() { return this.form.get('identity_number') };
  get phone_number() { return this.form.get('phone_number') };
  get salary() { return this.form.get('salary') };
}
