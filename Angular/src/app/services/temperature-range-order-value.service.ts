import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Temporders } from '../interfaces/temporders';

@Injectable({
  providedIn: 'root'
})
export class TemperatureRangeOrderValueService {
  private baseurl = 'https://dashboardback-production-0aa3.up.railway.app/Temp_range-orders'; 

  constructor(private _httpclient: HttpClient) {} 

  getRangeOrders(): Observable<Temporders[]> {
    return this._httpclient.get<Temporders[]>(this.baseurl);
  }
}
