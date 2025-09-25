import { AfterViewInit, Component } from '@angular/core';
import { SeasonSaleService } from '../services/season-sale.service';
import { SeasonSale } from '../interfaces/season-sale';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-season-sales-total',
  templateUrl: './season-sales-total.component.html',
  styleUrls: ['./season-sales-total.component.css']
})
export class SeasonSalesTotalComponent implements AfterViewInit {
  chart: Chart | undefined;
  results: { season: string, value: string, percentage: string }[] = [];

  constructor(private _seasonsaleService: SeasonSaleService) {}

  ngAfterViewInit(): void {
    this.fetchData();
  }

  fetchData() {
    this._seasonsaleService.getSeasonSale().subscribe({
      next: (response: SeasonSale[]) => {
        let Obj: { [key: string]: number } = {};
        response.forEach(item => {
          Obj[item.season] = Number(item.totalSales.toFixed(2));
        });
        let entries  = Object.entries(Obj).sort((a, b) => a[1] - b[1])
        const labels = entries.map(e => e[0]);
        const values = entries.map(e => e[1]);
        this.drawDonutGraph(labels, values);
        this.CreateDivForCreatingPrecentage(labels , values)
      }
    });
  }

  drawDonutGraph(labels: string[], data: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('seasonSalesChart', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Sales by Season',
          data: data,
          backgroundColor: ['#1f8fff', '#ff6f1f', '#fff700', '#b366ff'],
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 40
        }]
        // #1f8fff  , #ff6f1f , #fff700 , #b366ff
      },
      options: {
        responsive: true,
          animation: {
    duration: 2000,
    easing: 'easeOutBounce'
  },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#fff',
              font: {
                weight: 'bolder',
                size: 19,                
              },
              usePointStyle: true,
              pointStyle: 'rectRounded',
              boxWidth: 20,
              boxHeight: 20
            },
            onClick: (e, legendItem, legend) =>{
              const chart = legend.chart as Chart;
              const index = legendItem.index ?? 0;
                  // toggle visibility
              chart.toggleDataVisibility(index);
              chart.update();
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            cornerRadius: 8,
            padding: 10,
            titleColor: '#fff',
            callbacks:{
                label: function(context){
                  const value = context.parsed;
                  return `£${value.toFixed(2)}`;
                }
            }
          }
        }
      },
      plugins:[{
         id: 'centerText',
         beforeDraw:(chart)=>{
          const { width, height, ctx } = chart;
          ctx.restore();
          const dataset = chart.data.datasets[0];
          const values = dataset.data as number[];
          // نفلتر الـ data بناءً على الـ hidden flag
          const visibleValues = values.filter((_, i) => chart.getDataVisibility(i));
          const total = visibleValues.reduce((acc, val) => acc + val, 0);
          const text = `Total: £${total.toFixed(2)}`;
          ctx.font = 'bold 22px cursive';
          ctx.fillStyle = '#fff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, width / 2, height / 2);
          ctx.save();
         }
      }]
    });
  }
CreateDivForCreatingPrecentage(keys: string[], values: number[]) {
  const total = values.reduce((acc, val) => acc + val, 0);

  this.results = keys.map((season, i) => {
    const value = values[i].toFixed(2);
    const percentage = ((values[i] / total) * 100).toFixed(2);
    return { season, value, percentage };
  });

  console.log(this.results);
}
// Add to season-sales-total.component.ts
highlightSeason(season: string) {
  if (this.chart) {
    const index = this.chart.data.labels?.indexOf(season);
    if (index !== undefined && index !== -1) {
      // Highlight the corresponding segment in the chart
      this.chart.setActiveElements([{ datasetIndex: 0, index }]);
      this.chart.update();
    }
  }
}

resetHighlight() {
  if (this.chart) {
    this.chart.setActiveElements([]);
    this.chart.update();
  }
}
}
