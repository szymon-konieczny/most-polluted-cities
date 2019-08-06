import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { aqApiUrl, wikipediaApiUrl } from '../constants/requests';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public handleError(error: Error): Observable<Error> {
    return throwError(error);
  }

  public createOpenAqApiUrl(path: string): string {
    return `${aqApiUrl}/${path}`;
  }

  public createWikipediaApiUrl(path: string): string {
    // console.log('wiki path: ', wikipediaApiUrl + path);
    return `${wikipediaApiUrl}${path}`;
  }
}
