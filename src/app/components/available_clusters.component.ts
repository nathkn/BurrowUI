import { Component, OnInit } from '@angular/core';
import {ClusterHome} from '../classes/clusterHome';
import {HomeService} from '../services/home.service';

@Component({
  selector: 'available_clusters_list',
  templateUrl: '../../templates/available_clusters_list.html',
})

export class AvailableClustersComponent implements OnInit {
  clusters: ClusterHome[];

  constructor(private homeService: HomeService) {

  }

  ngOnInit() {
    this.homeService.clusters.subscribe(clusterList => {
      this.clusters = clusterList;
    });
  }

  public viewConsumers = (cluster) => {
    this.homeService.viewConsumers(cluster);
  }

  public viewTopics = (cluster) => {
    this.homeService.viewTopics(cluster);
  }

}
