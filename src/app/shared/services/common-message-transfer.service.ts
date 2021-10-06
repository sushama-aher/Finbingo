import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class CommonMessageTransferService {

  private _restAPIFieldErrorEvent = new EventEmitter<any>();
  private _restAPIGeneralErrorEvent = new EventEmitter<any>();

  constructor() { }

  get restAPIGeneralErrorEvent(): EventEmitter<any> {
    return this._restAPIGeneralErrorEvent;
  }
  get restAPIFieldErrorEvent(): EventEmitter<any> {
    return this._restAPIFieldErrorEvent;
  }
  throwFieldsError(errors: any) {
    this._restAPIFieldErrorEvent.emit(errors);
  }

  throwGeneralError(error: any) {
    this._restAPIGeneralErrorEvent.emit(error);
  }
}
