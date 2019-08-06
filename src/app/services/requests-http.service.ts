import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { HttpService } from './http.service';
import { IAqRes } from '../interfaces/interfaces';
import {
  DEFAULT_CITIES_FETCH_LIMIT,
  DEFAULT_COUNTRY_CODE,
  DEFAULT_SORT_TYPE,
  DEFAULT_ORDER_BY,
  DEFAULT_PARAMETER,
} from '../constants/requests';

@Injectable({
  providedIn: 'root'
})
export class RequestsHttpService {

  private DEFAULT_CONFIG_VALUES = {
    countryCode: DEFAULT_COUNTRY_CODE,
    order_by: DEFAULT_ORDER_BY,
    sortType: DEFAULT_SORT_TYPE,
    limit: DEFAULT_CITIES_FETCH_LIMIT,
    parameter: DEFAULT_PARAMETER,
  };

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
  ) {}

  public getMeasurements(countryCode: string, param?: string): Observable<IAqRes> {
    const { order_by, sortType, limit, parameter } = this.DEFAULT_CONFIG_VALUES;

    return this.http.get<IAqRes>(
      this.httpService.createOpenAqApiUrl(
        `measurements?country=${countryCode}&order_by=${order_by}&sort=${sortType}&limit=${limit}&parameter=${param || parameter}`,
      ),
    );
  }

  public getCityData(cityName: string): Observable<IAqRes> {
    const splittedName = cityName.split('/');
    const name = splittedName.length > 1 ? splittedName[1] : splittedName[0];
    console.log(cityName);
    return this.http.get<IAqRes>(
      this.httpService.createWikipediaApiUrl(
        `?format=json&action=query&srsearch=${name.replace(/\s/g, '+')}`,
      ),
    );
  }
}
