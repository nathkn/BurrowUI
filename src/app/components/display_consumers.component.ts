import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';
import {BurrowService} from '../services/burrow.service';
import {Consumer} from '../classes/consumer';
import {ClusterHome} from '../classes/clusterHome';


@Component({
  selector: 'display_consumer_list',
  templateUrl: '../../templates/display_consumers.html',
})

export class DisplayConsumersComponent implements OnInit {
  @Input() cluster: ClusterHome;
  consumers: Consumer[];

  constructor(private burrowService: BurrowService, private router: Router) {  }

  ngOnInit() {
    this.burrowService.consumerDictionary.subscribe(consumerDict => {
      this.consumers = consumerDict[this.cluster.clusterName];
    });
  }

  public analyze(cluster: string, consumer: string) {
    const url = '/AnalyzeConsumer';
    this.router.navigate([url], {queryParams: { consumer: consumer, cluster: cluster }});
  }
}
