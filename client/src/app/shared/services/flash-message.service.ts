import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlashMessageService {
  private msgType: 'success' | 'fail';
  private message: string;
  constructor() { }

  setMessage(type: 'success' | 'fail', message: string): void {
    this.message = message;
    this.msgType = type;
  }

  initialize(): void {
    this.message = undefined;
    this.msgType = undefined;
  }

  getMessage() {
    return { msgType: this.msgType, message: this.message };
  }

  haveMessage(): boolean {
    return this.message !== undefined;
  }
}
