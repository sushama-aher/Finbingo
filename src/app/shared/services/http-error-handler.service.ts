import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { AppSetting } from '../app.setting';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonMessageTransferService } from './common-message-transfer.service';

export type HandleError = <T>(
  identifier?: string,
  result?: T
) => (error: HttpErrorResponse) => Observable<T>;
@Injectable()
export class HttpErrorHandler {
  constructor(
    private router: Router,
    // private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private commonMsgTransferService: CommonMessageTransferService
  ) { }
  createHandleError = () => <T>(identifier = 'unknown', result = {} as T) =>
    this.handleError(identifier, result)

  handleError<T>(identifier = 'unknown', result = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      this.spinnerService.hide();
      if (error.status === 0) {
        if (window.navigator.onLine) {
          this.router.navigate(['/auth/error']);
        }
        // this.matSnackBar.open('Please check your internet connection', 'close', {
        //   duration: 500
        // });
        return throwError(result);
      }
      if (error.status === 500) {
        this.parseFieldErrors(error, identifier, 500);
        return throwError(result);
      }
      if (error.status === 401) {
        // this.matSnackBar.open('Please login again to access the application.', 'close', {
        //   duration: 3000
        // });
        this.router.navigate(['/auth/sign-in']);
        return throwError(result);
      }

      if (error.error.errors !== undefined && error.error.errors !== null) {
        if (error.status === 400) {
          this.parseFieldErrors(error, identifier, 400);
          return throwError(result);
        }
      }

      return throwError(result);
    };
  }

  manageGeneralMsg(generalDto: any, code: number) {
    let errorHeader = 'Error';
    if (code === 500) {
      errorHeader = 'Server Error';
    }
    if (generalDto.identifier !== 'verify-token') {
      // this.matSnackBar.open(generalDto.info, 'close', {
      //   duration: AppSetting.MAT_SNACKBAR_TIME
      // });
    }
    this.commonMsgTransferService.throwGeneralError(generalDto);
  }

  parseFieldErrors(error: HttpErrorResponse, identifier: string, code: number) {
    this.manageGeneralMsg(error.error, error.status);
    
  }
}
