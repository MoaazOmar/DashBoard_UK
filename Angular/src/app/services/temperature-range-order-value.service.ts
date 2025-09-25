import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Temporders } from '../interfaces/temporders';

@Injectable({
  providedIn: 'root'
})
export class TemperatureRangeOrderValueService {
  private baseurl = 'http://localhost:3000/Temp_range-orders'; 

  constructor(private _httpclient: HttpClient) {} 

  getRangeOrders(): Observable<Temporders[]> {
    return this._httpclient.get<Temporders[]>(this.baseurl);
  }
}
