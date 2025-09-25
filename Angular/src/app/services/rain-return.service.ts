import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RainRaturn } from '../interfaces/rain-raturn';

@Injectable({
  providedIn: 'root'
})
export class RainReturnService {
  private baseurl = 'http://localhost:3000/rain-Intensity-vs-Returns';

  constructor(private _http: HttpClient) { }

  getStackedBar(): Observable<RainRaturn[]> {
    return this._http.get<RainRaturn[]>(this.baseurl);
  }
}
