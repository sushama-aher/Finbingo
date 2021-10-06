import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './components/grid/grid.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { KeepHtmlPipe } from './pipes/keep-html.pipe';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateLoaderService } from './services/translate-loader.service';
import { MissingTranslateLoaderService } from './services/missing-translate-loader.service';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    GridComponent,
    KeepHtmlPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    TableModule,
    RouterModule,
    ButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLoaderService
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingTranslateLoaderService

      },
      isolate: true
    })
  ],
  exports: [GridComponent,
    TranslateModule,]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        TranslateService
      ]
    };
  }
  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }
}

declare module '@angular/core' {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
  }
}