
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TranslateLoaderService {
  constructor() { }
  getTranslation(): Observable<any> {
    return of({
      label_coming_soon: 'Coming Soon',
    });
  }
}

