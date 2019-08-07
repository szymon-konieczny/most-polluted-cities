import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { Observable, forkJoin } from 'rxjs';
import { filter, map, switchMap, startWith, tap } from 'rxjs/operators';

import { removeDuplicates } from '../../helpers/helpers';
import { countries, DEFAULT_CITIES_LIMIT } from '../../constants';
import { RequestsHttpService, StorageService } from '../../services';
import { IMeasurement } from '../../interfaces/interfaces';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cities-list',
  templateUrl: './cities-list.component.html',
  styleUrls: ['./cities-list.component.scss']
})
export class CitiesListComponent implements OnInit, AfterViewInit {
  @ViewChild('countryForm', { static: false }) public countryForm: NgForm;

  public countriesList = countries;
  public measurements$: Observable<IMeasurement[]>;
  public measurements: any[];
  public countryName: string;
  public countriesNames: string[];
  public filteredCountries: Observable<string[]>;

  constructor(
    private requestsHttpService: RequestsHttpService,
    private storageService: StorageService,
  ) {}

  public ngOnInit() {
    const code = this.storageService.fetchFromLocalStorage();
    this.countriesNames = this.countriesList.map(country => country.name);

    // this.filteredCountries = this.countryForm.valueChanges.pipe(
    //   startWith(''),
    //   tap(data => console.log('D: ', data)),
    //   map(value => this.filter(value)),
    // );

    if (code) {
      this.measurements$ = this.getMeasurements(code);
      this.countryName = this.getCountryParamValue(code, 'code', 'name');
    }
  }

  public ngAfterViewInit() {
    if (!this.countryForm.touched) {
      return;
    }

    this.filteredCountries = this.countryForm.valueChanges.pipe(
      startWith(''),
      tap(data => console.log('D: ', data)),
      map(value => this.filter(value)),
    );
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countriesNames.filter(name => name.toLowerCase().indexOf(filterValue) === 0);
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

  private matchCountryName(value: string) {
    return !!this.countriesList.some(country => country.name.toLowerCase() === value.toLowerCase());
  }

  public onCountryChange(countryName: string): void {
    if (!this.matchCountryName(countryName)) {
      return;
    }

    const name = countryName.charAt(0).toUpperCase() + countryName.substr(1).toLowerCase();
    const countryCode = this.getCountryParamValue(name, 'name', 'code');
    this.measurements$ = this.getMeasurements(countryCode);
    this.storageService.saveToLocalStorage(countryCode);
  }
}
