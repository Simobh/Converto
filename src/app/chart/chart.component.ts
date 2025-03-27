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
  @Input() title_display: boolean = true;
  @Input() x_grid_display: boolean = false;
  @Input() y_grid_display: boolean = true;
  @Input() show_ticks: boolean = true;

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
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: this.x_grid_display
            },
            title: {
              display: this.title_display,
              text: 'Jour du mois'
            },
            ticks: {
              display: this.show_ticks
            }
          },
          y: {
            grid: {
              display: this.y_grid_display
            },
            title: {
              display: this.title_display,
              text: 'Valeur'
            },
            ticks: {
              display: this.show_ticks 
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
