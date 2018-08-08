import { Component, OnInit } from '@angular/core';
import { Consumer } from '../classes/consumer';
import { ConsumerService } from '../services/consumer.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, interval } from 'rxjs';

@Component({
  selector: 'consumer_application',
  templateUrl: '../../templates/consumer.html',
})

export class ConsumerComponent implements OnInit {
  consumerName: string;
  environmentName: string;
  observableConsumer: Observable<Consumer>;
  consumer: Consumer;

  constructor(private consumerService: ConsumerService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.getParams();
    this.observableConsumer = this.consumerService.consumer;

    // Subscribe to changes
    this.observableConsumer.subscribe(consumer => {
      this.consumer = consumer;
    });

    // Refresh every 10 seconds
    // Start by getting 5 snapshots of data at 2 second intervals; this helps build the graph quicker. Then move to the 10 second intervals.
    let startWindow = 0;
    let refresh = interval(2 * 1000).subscribe(x => {
      startWindow++;
      this.consumerService.refreshData();
      if (startWindow === 5) {
        refresh.unsubscribe();
        refresh = interval(10 * 1000).subscribe(t => {
          this.consumerService.refreshData();
        });
      }
    });
  }

  getParams(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.consumerName = params['consumer'];
      this.environmentName = params['environment'];
    });
  }

}
