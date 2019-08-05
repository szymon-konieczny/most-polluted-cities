import { Component, OnInit, OnChanges, SimpleChanges, SimpleChange, ViewChild, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { filter, map, tap, startWith, takeUntil } from 'rxjs/operators';

import { removeDuplicates } from '../../helpers/helpers';
import { countries } from '../../constants/countries';
import { RequestsHttpService } from '../../services/requests-http.service';
import { IMeasurement } from '../../interfaces/interfaces';
import { DEFAULT_CITIES_LIMIT } from '../../constants/requests';
import { NgForm } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-cities-list',
  templateUrl: './cities-list.component.html',
  styleUrls: ['./cities-list.component.scss']
})
export class CitiesListComponent implements OnInit, OnDestroy {
  @ViewChild('countryForm', null) public countryForm: NgForm;

  private destroy$ = new Subject<void>();

  public countriesList = countries;
  public measurements$: Observable<IMeasurement[]>;

  constructor(
    private requestsHttpService: RequestsHttpService,
    private storageService: StorageService,
  ) {}

  public ngOnInit() {
    const code = this.storageService.fetchFromLocalStorage();
    this.measurements$ = this.getMeasurements(code);

    this.countryForm.form.valueChanges.pipe(
      map(data => data.selectedCountryName),
      filter(countryName => !!countryName),
      tap(countryName => {
        const countryCode = this.getSelectedCountryCode(countryName);
        this.measurements$ = this.getMeasurements(countryCode);
        this.storageService.saveToLocalStorage(countryCode);
      }),
      takeUntil(this.destroy$),
    ).subscribe();
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

  private getSelectedCountryCode(countryName: string) {
    if (!this.countriesList || !countryName) {
      return;
    }

    const country = this.countriesList.find(countryData => countryData.name === countryName);
    return country.code;
  }

}
