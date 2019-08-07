import { Component, OnInit } from '@angular/core';

import { Observable, forkJoin } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { removeDuplicates } from '../../helpers/helpers';
import { countries, DEFAULT_CITIES_LIMIT } from '../../constants';
import { RequestsHttpService, StorageService } from '../../services';
import { IMeasurement } from '../../interfaces/interfaces';

@Component({
  selector: 'app-cities-list',
  templateUrl: './cities-list.component.html',
  styleUrls: ['./cities-list.component.scss']
})
export class CitiesListComponent implements OnInit {
  public countriesList = countries;
  public measurements$: Observable<IMeasurement[]>;
  public measurements: any[];
  public countryName: string;

  constructor(
    private requestsHttpService: RequestsHttpService,
    private storageService: StorageService,
  ) {}

  public ngOnInit() {
    const code = this.storageService.fetchFromLocalStorage();

    if (code) {
      this.measurements$ = this.getMeasurements(code);
      this.countryName = this.getCountryParamValue(code, 'code', 'name');
    }
  }

  private getMeasurements(countryCode: string): Observable<IMeasurement[]> {
    return this.requestsHttpService.getMeasurements(countryCode).pipe(
      filter(response => !!response),
      map(measurements => removeDuplicates(measurements.results, (measurement: IMeasurement) => measurement.city)),
      map(measurements => measurements.slice(0, DEFAULT_CITIES_LIMIT)),
      switchMap(measurements => {
        const observables = measurements.map(measurement => this.getCityData(measurement).pipe(
          map(cityData => ({ ...measurement, cityData })),
        ));

        return forkJoin(observables);
      }),
    );
  }

  private getCityData(measurementData: IMeasurement): Observable<any> {
    return this.requestsHttpService.getCityData(measurementData.city).pipe(
      filter(data => !!data),
      map(data => {
        const pageId = Object.keys(data.query.pages)[0];
        const page = data.query.pages[pageId];
        return page.extract;
      }),
    );
  }

  private getCountryParamValue(value: string, filterParam: string, paramName: string): string {
    if (!this.countriesList || !value || !filterParam || !paramName) {
      return;
    }

    const country = this.countriesList.find(countryData => countryData[filterParam] === value);

    if (!country) {
      return;
    }

    return country[paramName];
  }

  public onCountryChange(countryName: string): void {
    const countryCode = this.getCountryParamValue(countryName, 'name', 'code');
    this.measurements$ = this.getMeasurements(countryCode);
    this.storageService.saveToLocalStorage(countryCode);
  }
}
