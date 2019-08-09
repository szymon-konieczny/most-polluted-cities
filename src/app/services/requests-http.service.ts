import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpService } from './http.service';
import { IAqApiRes, IWikiRes } from '../interfaces';
import {
  DEFAULT_CITIES_FETCH_LIMIT,
  DEFAULT_COUNTRY_CODE,
  DEFAULT_SORT_TYPE,
  DEFAULT_ORDER_BY,
  DEFAULT_PARAMETER,
} from '../constants';

@Injectable({
  providedIn: 'root'
})
export class RequestsHttpService {
  private readonly DEFAULT_CONFIG_VALUES = {
    countryCode: DEFAULT_COUNTRY_CODE,
    orderBy: DEFAULT_ORDER_BY,
    sortType: DEFAULT_SORT_TYPE,
    limit: DEFAULT_CITIES_FETCH_LIMIT,
    parameter: DEFAULT_PARAMETER,
  };

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
  ) {}

  public getMeasurements(countryCode: string, param?: string): Observable<IAqApiRes> {
    const { orderBy, sortType, limit, parameter } = this.DEFAULT_CONFIG_VALUES;

    return this.http.get<IAqApiRes>(
      this.httpService.createOpenAqApiUrl(
        `measurements?country=${countryCode}&order_by=${orderBy}&sort=${sortType}&limit=${limit}&parameter=${param || parameter}`,
      ),
    );
  }

  public getCityData(cityName: string): Observable<IWikiRes> {
    const splittedName = cityName.split('/');
    const name = splittedName[0];
    return this.http.get<IWikiRes>(this.httpService.createWikipediaApiUrl(`${name.replace(/\s+/g, '+')}`));
  }
}
