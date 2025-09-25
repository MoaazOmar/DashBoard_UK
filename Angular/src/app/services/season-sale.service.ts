import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import{SeasonSale} from '../interfaces/season-sale'
@Injectable({
  providedIn: 'root'
})
export class SeasonSaleService {
  private baseurl = 'http://localhost:3000/season_Sales-vs-totalAmountSales'
  constructor(private _http:HttpClient) { }
  getSeasonSale():Observable<SeasonSale[]>{
    return this._http.get<SeasonSale[]>(this.baseurl)
  }
}
