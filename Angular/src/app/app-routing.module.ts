import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WeatherSalesComponent } from './weather-sales/weather-sales.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SeasonSalesTotalComponent } from './season-sales-total/season-sales-total.component';
import { RainIntensityReturnsComponent } from './rain-intensity-returns/rain-intensity-returns.component';
import { SunshinePurchaseComponent } from './sunshine-purchase/sunshine-purchase.component';
import { TempRangeOrdersComponent } from './temp-range-orders/temp-range-orders.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'temp-range-orders', component: TempRangeOrdersComponent },
      { path: 'rain-intensity-returns', component: RainIntensityReturnsComponent },
      { path: 'season-sales-total', component: SeasonSalesTotalComponent },
      { path: 'sunshine-purchase', component: SunshinePurchaseComponent },
      { path: 'weather-sales', component: WeatherSalesComponent }
    ]
  },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }] 
})
export class AppRoutingModule { }
