import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {WeatherSales} from '../interfaces/weatherSales'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WeathersalesService {
  private baseurl = 'http://localhost:3000/weather-sales'
  constructor(private http:HttpClient) { }
  getWeatherSales():Observable<WeatherSales[]>{
    return this.http.get<WeatherSales[]>(this.baseurl)
  }
}
