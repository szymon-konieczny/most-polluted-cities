import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as MAT_MODULES from '@angular/material';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { AppComponent } from './app.component';
import { HttpService } from './services/http.service';
import { CitiesListComponent } from './components/cities-list/cities-list.component';
import { CityDataComponent } from './components/city-data/city-data.component';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';

const materialModules = [
  MAT_MODULES.MatInputModule,
  MAT_MODULES.MatAutocompleteModule,
  MAT_MODULES.MatExpansionModule,
  MAT_MODULES.MatProgressSpinnerModule,
];

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    CitiesListComponent,
    CityDataComponent,
    SanitizeHtmlPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PerfectScrollbarModule,
    ...materialModules,
  ],
  entryComponents: [],
  providers: [
    HttpService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {}
