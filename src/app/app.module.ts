import { HttpHandler } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InvestmentComponent } from './pages/investment/investment.component';
import { CommonBindingDataService } from './shared/services/common-binding-data.service';
import { CommonMessageTransferService } from './shared/services/common-message-transfer.service';
import { GridService } from './shared/services/grid.service';
import { HttpErrorHandler } from './shared/services/http-error-handler.service';
import { MissingTranslateLoaderService } from './shared/services/missing-translate-loader.service';
import { RestService } from './shared/services/rest.service';
import { StorageService } from './shared/services/storage.service';
import { TranslateLoaderService } from './shared/services/translate-loader.service';
import { SharedModule } from './shared/shared.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import {DialogModule} from 'primeng/dialog';

@NgModule({
  declarations: [
    AppComponent,
    InvestmentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    RadioButtonModule,
    DropdownModule,
    DialogModule,
    BrowserAnimationsModule
  ],
  providers: [
    RestService,
    HttpErrorHandler,
    GridService,
    CommonBindingDataService,
    CommonMessageTransferService,
    MissingTranslateLoaderService,
    StorageService,
    TranslateLoaderService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
