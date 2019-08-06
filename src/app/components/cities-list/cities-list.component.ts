import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { removeDuplicates } from '../../helpers/helpers';
import { countries, DEFAULT_CITIES_LIMIT } from '../../constants';
import { RequestsHttpService, StorageService } from '../../services';
import { IMeasurement } from '../../interfaces/interfaces';

@Component({
  selector: 'app-cities-list',
  templateUrl: './cities-list.component.html',
  styleUrls: ['./cities-list.component.scss']
})
export class CitiesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public countriesList = countries;
  public measurements$: Observable<IMeasurement[]>;
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

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getMeasurements(countryCode: string): Observable<IMeasurement[]> {
    return this.requestsHttpService.getMeasurements(countryCode).pipe(
      filter(response => !!response),
      map(measurements => removeDuplicates(measurements.results, (measurement: IMeasurement) => measurement.city)),
      map(measurements => measurements.slice(0, DEFAULT_CITIES_LIMIT)),
      takeUntil(this.destroy$),
    );
  }

  private getCountryParamValue(value: string, filterParam: string, paramName: string): string {
    if (!this.countriesList || !value || !filterParam || !paramName) {
      return;
    }

    const country = this.countriesList.find(countryData => countryData[filterParam] === value);
    return country[paramName];
  }

  public onCountryChange(countryName: string): void {
    const countryCode = this.getCountryParamValue(countryName, 'name', 'code');
    this.measurements$ = this.getMeasurements(countryCode);
    this.storageService.saveToLocalStorage(countryCode);
  }
}
