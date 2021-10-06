import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor(private restService: RestService) { }

  public loadGridData(url: string): Observable<{}> {
    return this.restService.getMockData('grid', url);
  }

  public downloadExcelGridData(url: string) {
    return this.restService.downloadFile(url, 'export.xls', 'page-center');
  }

  public downloadPdfGridData(url: string) {
    return this.restService.downloadFile(url, 'print.pdf', 'page-center');
  }
}
