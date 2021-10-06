import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AppSetting } from './../app.setting';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable()
export class RestService {
  httpHandleError: HandleError;
  constructor(private httpClient: HttpClient,
    private httpErrorHandler: HttpErrorHandler,
    private spinnerService: NgxSpinnerService,
    ) {
    this.httpHandleError = this.httpErrorHandler.createHandleError();
  }

  private prependApiUrl(url: string): string {
    return AppSetting.BASE_URL + url;
  }

  get(identifier: string, url: string): Observable<{}> {
    this.showLoader();
    return this.handleHttpSuccess(this.callerWithoutBody('get', identifier, url));
  }

  getMockData(identifier: string, url: string): Observable<{}> {
    this.showLoader();
    return this.httpClient.get('./assets/data.json');
  }

  post(identifier: string, url: string, body: any): Observable<{}> {
    this.showLoader();
    return this.handleHttpSuccess(this.callerWithBody('post', identifier, url, body));
  }

  put(identifier: string, url: string, body?: any): Observable<{}> {
    this.showLoader();
    return this.handleHttpSuccess(this.callerWithBody('put', identifier, url, body));
  }

  patch(identifier: string, url: string, body?: any): Observable<{}> {
    this.showLoader();
    return this.handleHttpSuccess(this.callerWithBody('patch', identifier, url, body));
  }

  delete(identifier: string, url: string): Observable<{}> {
    this.showLoader();
    return this.handleHttpSuccess(this.callerWithoutBody('delete', identifier, url));
  }

  callerWithoutBody(method: string, identifier: string, url: string): Observable<{}> {
    if (identifier !== 'sign-out') {
      const call = (AppSetting.IS_IDLE_TIME) ? this.checkIdleTime() : '';
    }
    const head = {
      headers: this.getHttpClientHeaders(),
      // withCredentials: true
    };
    const that = this;
    if (method === 'get') {
      return this.httpClient.get(this.prependApiUrl(url), head).pipe(
        catchError(this.httpHandleError(identifier, []))
      ).pipe(
        map((r) => {
          that.hideLoader();
          return r;
        })
      );
    } else if (method === 'delete') {
      return this.httpClient.delete(this.prependApiUrl(url), head).pipe(
        catchError(this.httpHandleError(identifier, []))
      ).pipe(
        tap((r) => {
          that.hideLoader();
          return r;
        })
      );
    }
    return new Observable();

  }
  callerWithBody(method: string, identifier: string, url: string, body?: any): Observable<any> {
    if (identifier !== 'sign-out') {
      const call = (AppSetting.IS_IDLE_TIME) ? this.checkIdleTime() : '';
    }
    const that = this;
    let head = {
      headers: this.getHttpClientHeaders(),
    };
    if (identifier === 'upload') {
      head = {
        headers: this.getUploadHttpClientHeaders(),
      };
    }
    if (method === 'put') {
      return this.httpClient.put(this.prependApiUrl(url), body, head).pipe(
        catchError(this.httpHandleError(identifier, []))
      ).pipe(
        map((r) => {
          that.hideLoader();
          return r;
        })
      );
    } else if (method === 'patch') {
      return this.httpClient.patch(this.prependApiUrl(url), body, head).pipe(
        catchError(this.httpHandleError(identifier, []))
      ).pipe(
        map((r) => {
          that.hideLoader();
          return r;
        })
      );
    } else if (method === 'post') {
      if (identifier === 'sign-in') {
        return this.httpClient.post(this.prependApiUrl(url), body, { observe: 'response', headers: this.getHttpClientHeaders() }).pipe(
          catchError(this.httpHandleError(identifier, []))
        ).pipe(
          map((r) => {
            that.hideLoader();
            return r;
          })
        );
      } else {
        return this.httpClient.post(this.prependApiUrl(url), body, head).pipe(
          catchError(this.httpHandleError(identifier, []))
        ).pipe(
          map((r) => {
            that.hideLoader();
            return r;
          })
        );
      }
    }
    return new Observable();
  }

  image(identifier: string, url: string, fileName: string) {
    this.showLoader();
    const head = { headers: this.getHttpClientHeaders() };
    const res = this.httpClient.get(url, head).pipe(
      catchError(this.httpHandleError(identifier, []))
    );
    this.downloadFile(res, this.getContentType(fileName), fileName);
  }

  private getHttpClientHeaders(): HttpHeaders {
    
    return new HttpHeaders({
      'Accept-Language': AppSetting.HEADER_ACCEPT_LANGUAGE,
      'Content-Type': AppSetting.HEADER_CONTENT_TYPE,
      'Accept': AppSetting.HEADER_CONTENT_TYPE,
      'token': '',
    });
  }

  private getUploadHttpClientHeaders(): HttpHeaders {
    
    return new HttpHeaders({
      'Accept-Language': AppSetting.HEADER_ACCEPT_LANGUAGE,
      'Content-Type': AppSetting.HEADER_FILE_CONTENT_TYPE,
      // 'Accept': AppSetting.HEADER_CONTENT_TYPE,
      'token': '',
    });
  }

  private handleHttpSuccess(res: Observable<{}>): Observable<{}> {
    return res;
  }

  downloadFile(data: any, contentType: string, fileName: string) {
    const blob = new Blob([data.blob()], { type: contentType });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    this.hideLoader();
  }

  private getContentType(fileName: string) {
    const extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    switch (extension) {
      case 'jpeg':
        return 'image/jpeg';
      case 'jpg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'bmp':
        return 'image/x-ms-bmp';
      case 'pdf':
        return 'application/pdf';
      case 'xls':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    return '';
  }

  private onEnd(): void {
    this.hideLoader();
  }

  private showLoader(): void {
      this.spinnerService.show();
  }

  private hideLoader(): void {
    this.spinnerService.hide();
  }


  checkIdleTime() {
    const idleTime = moment().add((AppSetting.IDLE_TIME), 'm').valueOf();
  }
}
