import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagementService } from '../../services/management.service';
import { SubSink } from 'subsink';
import { FlashMessageService } from 'src/app/shared/services/flash-message.service';

@Component({
  selector: 'emp-form',
  templateUrl: './emp-form.component.html',
  styleUrls: ['./emp-form.component.scss']
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
      identity_number: ['', Validators.required],
      phone_number: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      salary: ['', Validators.required]
    });


  }

  initializeFormForUpdate() {
    if (this.type === 'update') {
      this.form.patchValue({
        fullname: this.employee.fullname,
        email: this.employee.email,
        identity_number: this.employee.identity_number,
        phone_number: this.employee.phone_number,
        role: this.employee.role,
        salary: this.employee.salary
      });
    }
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
}
