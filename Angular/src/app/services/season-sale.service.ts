import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import{SeasonSale} from '../interfaces/season-sale'
@Injectable({
  providedIn: 'root'
})
export class SeasonSaleService {
  private baseurl = 'https://dashboardback-production-0aa3.up.railway.app/season_Sales-vs-totalAmountSales'
  constructor(private _http:HttpClient) { }
  getSeasonSale():Observable<SeasonSale[]>{
    return this._http.get<SeasonSale[]>(this.baseurl)
  }
}
