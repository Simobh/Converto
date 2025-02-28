import { Component, Input, AfterViewInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  template: `<canvas #chartCanvas></canvas>`,
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements AfterViewInit, OnChanges {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() label: string = 'Graphique';
  @Input() borderColor: string = 'blue';
  @Input() backgroundColor: string = 'rgba(0, 0, 255, 0.2)';

  chart!: Chart;

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart && changes['data']?.currentValue) {
      this.updateChart();
    }
  }

  createChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.label,
            data: this.data,
            borderColor: this.borderColor,
            backgroundColor: this.backgroundColor,
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Jour du mois'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Valeur'
            }
          }
        }
      }
    });
  }

  updateChart() {
    this.chart.data.labels = this.labels;
    this.chart.data.datasets[0].data = this.data;
    this.chart.update();
  }
  
}
