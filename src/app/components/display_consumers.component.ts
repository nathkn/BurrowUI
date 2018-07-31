import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HomeService} from '../services/home.service';
import {Consumer} from '../classes/consumer';

@Component({
  selector: 'display_consumer_list',
  templateUrl: '../../templates/display_consumers.html',
})

export class DisplayConsumersComponent implements OnInit {
  consumers: Consumer[];

  constructor(private homeService: HomeService, private router: Router) {
    this.consumers = this.homeService.loadedCluster.consumers;

    this.homeService.selectedCluster.subscribe(cluster => {
      this.consumers = cluster.consumers;
    });
  }

  ngOnInit() {
  }

  public analyze(cluster: string, consumer: string) {
    const url = '/AnalyzeConsumer';
    this.router.navigate([url], {queryParams: { consumer: consumer, cluster: cluster }});
  }
}
