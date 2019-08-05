import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as MAT_MODULES from '@angular/material';

import { AppComponent } from './app.component';
import { HttpService } from './services/http.service';
import { CitiesListComponent } from './components/cities-list/cities-list.component';
import { CityDataComponent } from './components/city-data/city-data.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const materialModules = [
  MAT_MODULES.MatInputModule,
  MAT_MODULES.MatAutocompleteModule,
  MAT_MODULES.MatExpansionModule,
];

@NgModule({
  declarations: [
    AppComponent,
    CitiesListComponent,
    CityDataComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ...materialModules,
  ],
  entryComponents: [],
  providers: [
    HttpService,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {}
