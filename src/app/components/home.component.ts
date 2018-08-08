import { Component, OnInit } from '@angular/core';
import {ClusterHome} from '../classes/clusterHome';
import {HomeService} from '../services/home.service';

@Component({
  selector: 'consumer_application',
  templateUrl: '../../templates/home.html',
})

export class HomeComponent implements OnInit {
  listTitle: string;
  selectedCluster: ClusterHome;
  viewConsumerList: boolean;
  viewTopicList: boolean;

  constructor(private homeService: HomeService) {  }

  ngOnInit() {
    // Subscribe
    this.homeService.selectedCluster.subscribe(cluster => {
      this.selectedCluster = cluster;
    });

    this.homeService.listTitle.subscribe(title => {
      this.listTitle = title;
    });

    this.homeService.viewTopicList.subscribe(viewTopics => {
      this.viewTopicList = viewTopics;
    });

    this.homeService.viewConsumerList.subscribe(viewConsumers => {
      this.viewConsumerList = viewConsumers;
    });
  }

}
