import { Component, OnInit } from '@angular/core';
import { ConsumerService } from '../services/consumer.service';
import {Observable, BehaviorSubject} from 'rxjs';
import DateTimeFormat = Intl.DateTimeFormat;

@Component({
  selector: 'lag-graph',
  templateUrl: '../../templates/lag_graph.html',
})

export class LagGraphComponent implements OnInit {
  lagWindow: Observable<number[]>;
  maxLag = 0;
  minLag = 0;
  avgLag = 0;

  public lineChartData: Array<any>;

  public lineChartLabels: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  get observableLabels(): Observable<Array<any>> { return this.lineChartLabels.asObservable(); }

  public lineChartLegend = false;
  public lineChartType = 'line';

  public lineChartOptions: any = {
    responsive: true
  };

  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(233,30,99,0.2)',
      borderColor: 'rgba(233,30,99,1)',
      pointBackgroundColor: 'rgba(0,150, 136, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0, 150, 136, 0.8)'
    }
  ];

  constructor(private consumerService: ConsumerService) {
    this.lagWindow = consumerService.lagWindow;
    this.lineChartData = [
      {data: [], label: this.consumerService.consumerName}
    ];
  }

  ngOnInit(): void {
    this.lagWindow.subscribe(obj => {
      this.drawLagChart(obj);
      this.maxLag = Math.max(...obj);
      this.minLag = Math.min(...obj);
      let value = 0;
      obj.forEach(num => {
        value += num;
      });
      this.avgLag = Math.floor(value / obj.length);
    });
  }

  drawLagChart(newEntries: number[]): void {
    if (newEntries.length > 0) {
      const newLabels = this.lineChartLabels.getValue();
      const newData = this.lineChartData.slice(0);

      const currentTime = new Date().toLocaleTimeString();
      newLabels.push(currentTime);
      newData[0].data = newEntries;

      this.lineChartLabels.next(newLabels);
      this.lineChartData = newData;
    }
  }
}

interface ColorScheme {
  backgroundColor: string;
  borderColor: string;
  pointHoverBorderColor: string;
}
