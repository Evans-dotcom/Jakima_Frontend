// shared/components/progress-chart/progress-chart.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective  // This provides the baseChart directive
  ],
  template: `
    <div class="progress-chart">
      <canvas 
        baseChart
        [data]="chartData"
        [options]="chartOptions"
        [type]="chartType"
      ></canvas>
    </div>
  `,
  styles: [`
    .progress-chart {
      position: relative;
      height: 300px;
      width: 100%;
    }
  `]
})
export class ProgressChartComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() labels: string[] = [];
  @Input() type: 'line' | 'bar' | 'pie' | 'doughnut' = 'bar';
  @Input() title: string = '';

  chartType: ChartType = 'bar';
  chartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: this.title
      }
    }
  };

  ngOnInit(): void {
    this.chartType = this.type;
    this.chartData.labels = this.labels;
    this.chartOptions!.plugins!.title!.text = this.title;
    
    // Set chart data based on type
    if (this.type === 'pie' || this.type === 'doughnut') {
      this.chartData.datasets = [{
        data: this.data,
        backgroundColor: [
          '#4CAF50', '#2196F3', '#FF9800', '#F44336',
          '#9C27B0', '#00BCD4', '#FFC107', '#795548'
        ]
      }];
    } else {
      this.chartData.datasets = [{
        data: this.data,
        label: 'Progress',
        backgroundColor: '#2196F3',
        borderColor: '#1976D2',
        borderWidth: 2,
        fill: true
      }];
    }
  }
}