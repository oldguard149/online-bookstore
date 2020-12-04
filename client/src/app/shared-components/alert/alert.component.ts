import { Component, Input, OnInit } from '@angular/core';
import { FlashMessageService } from 'src/app/shared/services/flash-message.service';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() errorMsg: string[] = [];
  @Input() successMsg: string[] = [];
  constructor(
    private flash: FlashMessageService
  ) { }

  ngOnInit(): void {
    this.displayFlashMessage()
  }

  displayFlashMessage() {
    if (this.flash.haveMessage()) {
      const { msgType, message } = this.flash.getMessage();
      if (msgType === 'success') {
        this.successMsg.push(message);
      } else {
        this.errorMsg.push(message);
      }
    }
  }

  deleteErrorMessage(i: any): void {
    this.errorMsg.splice(parseInt(i), 1);
  }

  deleteSuccessMessage(i: any): void {
    this.successMsg.splice(parseInt(i), 1);
  }

}
