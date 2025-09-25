import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WeatherSalesComponent } from './weather-sales/weather-sales.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RainIntensityReturnsComponent } from './rain-intensity-returns/rain-intensity-returns.component';
import { SeasonSalesTotalComponent } from './season-sales-total/season-sales-total.component';
import { SunshinePurchaseComponent } from './sunshine-purchase/sunshine-purchase.component';
import { ToggleDlComponent } from './dashboard/toggle-dl/toggle-dl.component';
import { TempRangeOrdersComponent } from './temp-range-orders/temp-range-orders.component';
import { LoadingComponent } from './loading/loading.component';
import { LoadingService } from './services/loading.service';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { NotfoundComponent } from './notfound/notfound.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WeatherSalesComponent,
    DashboardComponent,
    RainIntensityReturnsComponent,
    SeasonSalesTotalComponent,
    SunshinePurchaseComponent,
    ToggleDlComponent,
    TempRangeOrdersComponent,
    LoadingComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule
  ],
  providers: [
    provideAnimationsAsync(),
    LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }