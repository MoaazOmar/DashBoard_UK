import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { TemperatureRangeOrderValueService } from '../services/temperature-range-order-value.service';
import { Chart, TooltipItem } from 'chart.js/auto';
import { Temporders } from '../interfaces/temporders';

// تعريف interface للـ Point
interface BubblePoint {
  x: number;
  y: number;
  r: number;
}

@Component({
  selector: 'app-temp-range-orders',
  templateUrl: './temp-range-orders.component.html',
  styleUrls: ['./temp-range-orders.component.css']
})
export class TempRangeOrdersComponent implements AfterViewInit, OnDestroy {
  temporders: Temporders[] = [];
  private chart: Chart | undefined;

  // KPIs
  totalTransactions: number = 0;
  avgTransactionsPerPoint: number = 0;
  numberOfTempRanges: number = 0;
  numberOfOrderSizes: number = 0;

  constructor(private tempOrdersService: TemperatureRangeOrderValueService) { }

  ngAfterViewInit(): void {
    this.getTheData();
  }

  getTheData(): void {
    this.tempOrdersService.getRangeOrders().subscribe((data: Temporders[]) => {
      this.temporders = data.map(d => {
        let fixedType = d.type;

        if (fixedType.toLowerCase() === 'meduim') {
          fixedType = 'Medium';
        } else if (fixedType.toLowerCase() === 'small') {
          fixedType = 'Small';
        } else if (fixedType.toLowerCase() === 'large') {
          fixedType = 'Large';
        }

        return {
          ...d,
          type: fixedType
        };
      });

      // استدعاء الدوال
      this.totalTransactions = this.getTotalTransactions();
      this.avgTransactionsPerPoint = this.getAvgTransactionsPerPoint();
      this.numberOfTempRanges = this.getNumberTempRanges();
      this.numberOfOrderSizes = this.getNumberOfOrderSizes();

      const maxOrders = Math.max(...this.temporders.map(d => d.y));
      const baseSizes = { 'Small': 8, 'Medium': 12, 'Large': 16 };

      const datasets = [
        {
          label: 'Small',
          data: this.temporders.filter(d => d.type === 'Small').map(d => ({
            x: parseFloat(d.x.toFixed(1)),
            y: d.y,
            r: baseSizes['Small'] + (d.y / maxOrders) * 10
          })),
          backgroundColor: 'rgba(41, 178, 202, 0.6)',
          borderColor: '#053333'
        },
        {
          label: 'Medium',
          data: this.temporders.filter(d => d.type === 'Medium').map(d => ({
            x: parseFloat(d.x.toFixed(1)),
            y: d.y,
            r: baseSizes['Medium'] + (d.y / maxOrders) * 10
          })),
          backgroundColor: 'rgba(239, 255, 17, 0.6)',
          borderColor: '#61790a'
        },
        {
          label: 'Large',
          data: this.temporders.filter(d => d.type === 'Large').map(d => ({
            x: parseFloat(d.x.toFixed(1)),
            y: d.y,
            r: baseSizes['Large'] + (d.y / maxOrders) * 10
          })),
          backgroundColor: 'rgba(185, 10, 48, 0.6)',
          borderColor: '#c21010'
        }
      ];
      this.renderChart(datasets);
    });
  }

  // === Helper Functions ===
  getTotalTransactions(): number {
    return this.temporders.reduce((sum, d) => sum + d.y, 0);
  }

  getAvgTransactionsPerPoint(): number {
    if (this.temporders.length === 0) return 0;
    const totalTransactions = this.temporders.reduce((sum, d) => sum + d.y, 0);
    return parseFloat((totalTransactions / this.temporders.length).toFixed(2));
  }

  getNumberTempRanges(): number {
    const uniqueRanges = new Set(this.temporders.map(d => d.x));
    return uniqueRanges.size;
  }

  getNumberOfOrderSizes(): number {
    const uniqueTypes = new Set(this.temporders.map(d => d.type));
    return uniqueTypes.size;
  }

  renderChart(datasets: any[]): void {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('tempOrdersCanvas', {
      type: 'bubble',
      data: {
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels:{
              color:'#ffffff',
              font:{
                size:18,
                weight: 'bolder',
                family:'cursive'
              },
              padding: 20
            }
          },
          title: {
            display: true,
            text: 'Temperature Range vs. Number of Transactions',
            color: '#FFFFFF',
            font:{
                size:22.5,
                weight: 'bolder',
                family:'cursive'
            },
            padding: 20
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13,
              weight: 'bold'
            },
            callbacks: {
              label: (context: TooltipItem<'bubble'>) => {
                const point = context.raw as BubblePoint;
                return [
                  `Order Type: ${context.dataset?.label || 'Unknown'}`,
                  `Temperature: ${point.x}°C`,
                  `Number of Transactions: ${point.y.toLocaleString()}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Temperature Range (°C)',
              color: '#FFFFFF',
              font: {
                size: 16,
                weight: 'bold',
                family: 'Arial, sans-serif'
              }
            },
            ticks: {
              color: '#FFFFFF',
              font: { weight: 'bolder', size: 18 }
            },
            grid: { color: '#888', lineWidth: 2.8 }
          },
          y: {
            title: {
              display: true,
              text: 'Number of Transactions',
              color: '#FFFFFF',
              font: {
                size: 16,
                weight: 'bold',
                family: 'Arial, sans-serif'
              }
            },  
            ticks: {
              color: '#FFFFFF',
              font: { weight: 'bolder', size: 18 }
            },
            grid: { color: '#888', lineWidth: 2.8 }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}