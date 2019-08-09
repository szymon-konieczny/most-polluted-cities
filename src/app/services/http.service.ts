import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { AQ_API_URL, WIKIPEDIA_API_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public handleError(error: Error): Observable<Error> {
    return throwError(error);
  }

  public createOpenAqApiUrl(path: string): string {
    return `${AQ_API_URL}/${path}`;
  }

  public createWikipediaApiUrl(path: string): string {
    return `${WIKIPEDIA_API_URL}${path}`;
  }
}
