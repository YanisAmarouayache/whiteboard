import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-chart-widget',
  templateUrl: './chart-widget.component.html',
  styleUrls: ['./chart-widget.component.scss']
})
export class ChartWidgetComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() chartType: ChartType = 'pie';
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['chartType']) return;
    this.renderChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(): void {
    if (!this.chartCanvas) return;
    this.chart?.destroy();
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: this.chartType,
      data: {
        labels: ['A', 'B', 'C'],
        datasets: [{ label: 'Series 1', data: [3, 5, 2] }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}
