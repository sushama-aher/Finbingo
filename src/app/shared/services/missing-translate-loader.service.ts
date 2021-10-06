import { Injectable } from '@angular/core';
import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MissingTranslateLoaderService implements MissingTranslationHandler {

  constructor() {
   }
  handle(param: MissingTranslationHandlerParams) {
    return param.key;
  }
}
