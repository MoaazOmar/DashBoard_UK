import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SunshinePurchase } from '../interfaces/sunshine-purchase';

@Injectable({
  providedIn: 'root'
})
export class SunshinePurchaseService {
  private baseurl = 'https://dashboardback-production-0aa3.up.railway.app/sunshineHours_Purchase'; 
  constructor(private _http:HttpClient) { }
  getDataSunshinePurchase():Observable<SunshinePurchase[]>{
    return this._http.get<SunshinePurchase[]>(this.baseurl)
  }
}
