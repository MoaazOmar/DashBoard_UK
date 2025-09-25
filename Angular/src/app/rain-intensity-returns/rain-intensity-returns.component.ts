import { AfterViewInit, Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { RainRaturn } from '../interfaces/rain-raturn';
import { RainReturnService } from '../services/rain-return.service';

@Component({
  selector: 'app-rain-intensity-returns',
  templateUrl: './rain-intensity-returns.component.html',
  styleUrls: ['./rain-intensity-returns.component.css'] // ✅ تعديل: كانت styleUrl لازم تبقى styleUrls
})
export class RainIntensityReturnsComponent implements AfterViewInit {
  list: Array<any> = []
  chart: Chart | undefined

  constructor(private rainReturn: RainReturnService) { }

  ngAfterViewInit(): void {
    this.getRainReturnData()
    window.addEventListener('resize', () => {
    if (this.list.length) {
      this.drawChart(this.list);
    }
  });
}


  getRainReturnData() {
    this.rainReturn.getStackedBar().subscribe(
      {
        next: (response) => {
          // 1. نجهز Map للتجميع
          const grouped: any = {};
          response.forEach((item: RainRaturn) => {
            if (!grouped[item.rainIntensity]) {
              grouped[item.rainIntensity] = {
                intensity: item.rainIntensity,
                transactionsReturned: 0,
                transactionsNotReturned: 0,
                quantitiesReturned: 0,
                quantitiesNotReturned: 0,
                revenueReturned: 0,
                revenueNotReturned: 0
              };
            }

            if (item.returnStatus === 'Returned') {
              grouped[item.rainIntensity].transactionsReturned = item.transactions;
              grouped[item.rainIntensity].quantitiesReturned = item.quantities;
              grouped[item.rainIntensity].revenueReturned = item.revenue;
            } else {
              grouped[item.rainIntensity].transactionsNotReturned = item.transactions;
              grouped[item.rainIntensity].quantitiesNotReturned = item.quantities;
              grouped[item.rainIntensity].revenueNotReturned = item.revenue;
            }
          });

          // 2. نحولها Array
          this.list = Object.values(grouped);

          console.log("📊 Debug list:", this.list); // ✅ تعديل: عشان تشوف الشكل النهائي قبل الرسم

          // 3. نبني الـ Chart
          this.drawChart(this.list)
        }
      }
    )
  }

  drawChart(data: any[]) {
    if (this.chart) {
      this.chart.destroy();
    }
    const maxBarThickness =
  window.innerWidth < 768 ? 30 :
  window.innerWidth < 1200 ? 50 : 72.5;

    this.chart = new Chart('rainReturnsChart', {
      
      type: 'bar',
      data: {
        labels: data.map(d => d.intensity),
        
        datasets: [
          {
            label: 'Transactions - Returned',
            data: data.map(d => d.transactionsReturned),
            backgroundColor: '#ff1f6f',
            borderColor: '#f3085aff',
            hoverBackgroundColor: '#ff85a2',
            hoverBorderColor: '#000000',
            borderWidth: 2,
            borderRadius: 12,          // 🔹 Rounded stacked bars
            borderSkipped: false,      // keep rounding on all sides
            stack: 'Transactions',
            barThickness: maxBarThickness
          },
          {
            label: 'Transactions - Not Returned',
            data: data.map(d => d.transactionsNotReturned),
            backgroundColor: '#00f7f7',
            borderColor: '#0d8d8dff',
            hoverBackgroundColor: '#85fff5ff',
            hoverBorderColor: '#000000',
            borderWidth: 2,
            borderRadius: 12,
            borderSkipped: false,
            stack: 'Transactions',
            barThickness: maxBarThickness
          },
          {
            label: 'Quantities - Returned',
            data: data.map(d => d.quantitiesReturned),
            backgroundColor: '#1f8fff',
            borderColor: '#1f8fffe8',
            hoverBackgroundColor: '#4f51ffff',
            hoverBorderColor: '#000000',
            borderWidth: 2,
            borderRadius: 12,
            borderSkipped: false,
            stack: 'Quantities',
            barThickness: maxBarThickness
          },
          {
            label: 'Quantities - Not Returned',
            data: data.map(d => d.quantitiesNotReturned),
            backgroundColor: '#fff700',
            borderColor: '#cfca2fd8',
            hoverBackgroundColor: '#f9fd1bff',
            hoverBorderColor: '#000000',
            borderWidth: 2,
            borderRadius: 12,
            borderSkipped: false,
            stack: 'Quantities',
            barThickness: maxBarThickness
          },
          {
            label: 'Revenue - Returned',
            data: data.map(d => d.revenueReturned),
            backgroundColor: '#b366ff',
            borderColor: '#6412b6c7',
            hoverBackgroundColor: '#ff4ff0ff',
            hoverBorderColor: '#000000',
            borderWidth: 2,
            borderRadius: 12,
            borderSkipped: false,
            stack: 'Revenue',
            barThickness: maxBarThickness
          },
          {
            label: 'Revenue - Not Returned',
            data: data.map(d => d.revenueNotReturned),
            backgroundColor: '#ff6f1f',
            borderColor: '#f7b740ff',
            hoverBackgroundColor: '#f87f1dff',
            hoverBorderColor: '#000000',
            borderWidth: 2,
            borderRadius: 12,
            borderSkipped: false,
            stack: 'Revenue',
            barThickness: maxBarThickness
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            mode: 'index',      // ✅ يخلي كل الـ bars اللي لهم نفس الـ label (intensity) يظهروا
            intersect: false,   // ✅ حتى لو ماوقفتش بالظبط على البار
            backgroundColor: 'rgba(0,0,0,0.8)',
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: (ctx) => {
                let label = ctx.dataset.label || '';
                let value = ctx.formattedValue;
                return ` ${label}: ${value}`;
              }
            }
          },
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              font: { weight: 'bolder' }
            }
          },
          title: {
            display: true,
            text: 'Rain Intensity vs Returns (Grouped + Stacked)',
            font: { size: 18, weight: 'bolder' }
          }
        },
        interaction: {
          mode: 'index',      // ✅ نفس الفكرة هنا
          intersect: false
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true }
        }
      }

    });
  }
}
