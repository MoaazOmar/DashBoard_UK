import { Chart } from 'chart.js';
import { SunshinePurchaseService } from './../services/sunshine-purchase.service';
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-sunshine-purchase',
  templateUrl: './sunshine-purchase.component.html',
  styleUrl: './sunshine-purchase.component.css'
})
export class SunshinePurchaseComponent implements AfterViewInit {
  constructor(private _sunshineServices: SunshinePurchaseService) { }
  chart: Chart | undefined
  dataNight: { [key: number]: number } = {}
  dataLight: { [key: number]: number } = {}
  ngAfterViewInit(): void {
    this.fetchData()
  }
  fetchData() {
    this._sunshineServices.getDataSunshinePurchase().subscribe(
      {
        next: (response) => {
          let data: { [key: number]: number } = {}
          this.dataNight = {}; 
          this.dataLight= {}
          response.forEach((r) => {
            if (r.sunshineHours > 0) {
              data[r.sunshineHours] = r.purchaseCount;
              this.dataLight[r.sunshineHours] = r.purchaseCount
            }
            if(r.sunshineHours == 0){
              this.dataNight[r.sunshineHours] = r.purchaseCount; 
            }
          });
          
          let entries = Object.entries(data).sort((a, b) => Number(a[0]) - Number(b[0])) // convert obj into array of arrays to arrange the data
          const labels = entries.map((a)=>{return a[0]})
          const values = entries.map((a)=>{return a[1]})
          console.log('entries values are',entries);

          this.drawGraph(labels, values)
        },

        error: (err) => {
          console.error('error occures during fetching', err)
        }

      }
    )
  }
  drawGraph(labels: string[], values: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart('sunshinePurchase', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Sales happens during Sunshine ☀️',
          data: values,
          borderColor: 'rgba(14, 212, 163, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 3,
          pointBackgroundColor: 'rgb(75, 192, 192)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 12,
          pointHitRadius: 10,
          pointStyle: 'star',
          pointHoverBackgroundColor: '#FFFF33',
          pointHoverBorderColor: '#FFEC8B',
          fill: true,
          tension: 0.4,
          stepped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1600,
          easing: 'easeInOutQuart',
          delay: (context) => context.dataIndex * 100, 
          loop: false
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { display: true, position: 'top' } ,
          tooltip: { enabled: true, mode: 'index',cornerRadius: 8,backgroundColor:'rgba(0,79,20,0.5)' },
          title: { display: true, text: 'Chart Title' },
          
        }
      }
    });
  }
getTotalLightSale(): number {
  return Object.values(this.dataLight).reduce((acc, val) => acc + val, 0);
}
}