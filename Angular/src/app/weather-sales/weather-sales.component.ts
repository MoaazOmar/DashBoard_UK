import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { WeathersalesService } from '../services/weathersales.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-weather-sales',
  templateUrl: './weather-sales.component.html',
  styleUrls: ['./weather-sales.component.css']
})
export class WeatherSalesComponent implements AfterViewInit, OnDestroy {
  private chart: Chart | undefined;

  constructor(private _weatherSalesService: WeathersalesService) { }

  ngAfterViewInit(): void {
    this._weatherSalesService.getWeatherSales().subscribe(data => {
      const labels = data.map(item => item.category.toLowerCase());
      const values = data.map(item => Number(item.totalSales));

      const colorMap: Record<string, string> = {
        'sunny': '#FFC300',
        'normal': '#4FA3D1',
        'windy': '#AAB7B8',
        'cold and rainy': '#5A9BD5'
      };
      const hoverColors: Record<string, string> = {
        'sunny': '#FFD60A',
        'normal': '#6FB7E9',
        'windy': '#D5DBDB',
        'cold and rainy': '#7FB3D5'
      };

      const backgroundColors = labels.map(label => colorMap[label] || '#CCCCCC');
      const hoverBackgroundColors = labels.map(label => hoverColors[label] || '#AAAAAA');

      this.chart = new Chart<'bar', number[], string>('weatherChart', {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Total Sales (£)',
            data: values,
            backgroundColor: backgroundColors,
            borderColor: '#FFFFFF', 
            borderWidth: 2,
            hoverBackgroundColor: hoverBackgroundColors
          }]
        },
        options: {
          responsive: true,
          animation: {
            duration: 1200,       
            easing: 'easeOutBounce' 
          },
          transitions: {
            active: {
              animation: {
                duration: 400,
                easing: 'easeOutQuad'
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => `£${ctx.formattedValue}`
              }
            },
            title: {
              display: true,
              text: 'Weather Impact on Sales',
              color: '#FFFFFF', 
              font: { size: 18, weight: 'bold' }
            }
          },
          scales: {
            x: {
              ticks: {
                color: '#FFFFFF',
                font: { weight: 'bolder', size: 17.5 }
              },
              grid: { color: '#888', lineWidth: 2.5 }
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: value => `£${value}`,
                color: '#FFFFFF',
                font: { weight: 'bolder', size: 17.5 }
              },
              grid: { color: '#888', lineWidth: 2.5 }
            }
          }
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
