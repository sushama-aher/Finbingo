import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ButtonModel } from '../models/button-model';
import { GridQueryModel } from '../models/grid-query-model';
import { GridSearchModel } from '../models/grid-search-model';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CommonBindingDataService {
  buyButton!: ButtonModel;
  searchUrl!: string;
  title = new BehaviorSubject('');
  public redrawSidebar: Subject<any> = new Subject<any>();
  public metaDataSubject: Subject<any> = new Subject<any>();
  queryUpdateObject: GridQueryModel = {
    'page': 1,
    'sortField': '',
    'sortOrderString': 'asc',
    'sortOrder': 1
  };

  queryDefaultObject: GridQueryModel = {
    'page': 1,
    'sortField': '',
    'sortOrderString': 'asc',
    'sortOrder': 1
  }

  searchUpdateObject: GridSearchModel = {
    'searchText': ''
  };


  searchDefaultObject: GridSearchModel = {
    'searchText': ''
  }

  constructor(
    private translateService: TranslateService,
  ) {
    this.initializeButtons();
  }

  getLabel(string: any) {
    let select;
    this.translateService.get(string).subscribe(translatedValue => {
      select = translatedValue;
    });
    return select;
  }

  initializeButtons() {
    this.buyButton = {
      icon: 'pi pi-shopping-cart',
      label: 'Buy',
      class: 'BUY',
      ariaLabel: (data: any) => {
        return data.activated ? this.getLabel('aria_label_deactivate_button') :
          this.getLabel('aria_label_activate_button')
      },
      title: (data: any) => {
        if (data.activated) {
          return {
            title: this.getLabel('label_deactivate'),
            icon: 'pi pi-shopping-cart',
            btnClass: 'btn-delete',
          };
        }
        return {
          title: this.getLabel('label_active'),
          icon: 'pi pi-shopping-cart',
          btnClass: 'btn-edit',
        };
      },
      show: (data: any) => {
          return `Buy`;
      }
    };


  }


  setTitle(title: string) {
    this.title.next(title);
  }

  getIcon(totalSeatBooked: any, totalAdaSeatBooked: any) {
    const eDiv = document.createElement('div');
    if (Number(totalAdaSeatBooked) === 0) {
      eDiv.innerHTML = `<span>${totalSeatBooked}</span>`;
    } else {
      eDiv.innerHTML = `<div class="flex"><span class="mt6">${totalSeatBooked}</span>
   <img class="ada-seats" alt="ada" src="assets/images/empty-ada-seat.svg" /></div>`;
    }
    return eDiv;
  }

}
