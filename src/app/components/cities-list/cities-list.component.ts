import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';

import { Observable, forkJoin } from 'rxjs';
import { filter, map, switchMap, startWith } from 'rxjs/operators';

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
  public countryForm: FormGroup;
  public countriesList = countries;
  public measurements$: Observable<IMeasurement[]>;
  public measurements: any[];
  public countryName: string;
  public countriesNames: string[];
  public filteredCountries$: Observable<string[]>;

  constructor(
    private requestsHttpService: RequestsHttpService,
    private storageService: StorageService,
    private fb: FormBuilder,
  ) {}

  get country(): FormGroup {
    return this.countryForm.get('countryName') as FormGroup;
  }

  public ngOnInit() {
    const code = this.storageService.fetchFromLocalStorage();

    this.countryForm = this.createForm();
    this.countriesNames = this.countriesList.map(country => country.name);
    this.filteredCountries$ = this.country.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value)),
    );

    if (code) {
      this.measurements$ = this.getMeasurements(code);
      this.countryName = this.getCountryParamValue(code, 'code', 'name');
      this.countryForm.setValue({ countryName: this.countryName });
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({ countryName: [''] });
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

  private matchCountryName(value: string): boolean {
    return !!this.countriesList.some(country => country.name.toLowerCase() === value.toLowerCase());
  }

  public onCountryChange(select: MatAutocompleteSelectedEvent): void {
    const countryName = select.option.value;

    if (!countryName || !this.matchCountryName(countryName)) {
      return;
    }

    const name = countryName.charAt(0).toUpperCase() + countryName.substr(1).toLowerCase();
    const countryCode = this.getCountryParamValue(name, 'name', 'code');
    this.measurements$ = this.getMeasurements(countryCode);
    this.storageService.saveToLocalStorage(countryCode);
  }

  public clearInput(): void {
    this.countryForm.setValue({ countryName: '' });
  }
}
