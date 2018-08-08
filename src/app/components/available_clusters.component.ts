import { Component, OnInit } from '@angular/core';
import {ClusterHome} from '../classes/clusterHome';
import {HomeService} from '../services/home.service';
import {ClusterDictionary} from '../services/burrow.service';

@Component({
  selector: 'available_clusters_list',
  templateUrl: '../../templates/available_clusters_list.html',
})

export class AvailableClustersComponent implements OnInit {
  clusterDict: ClusterDictionary;
  clusterDictKeys: string[];

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.homeService.clusters.subscribe(clusterDict => {
      this.clusterDict = clusterDict;
      this.clusterDictKeys = Object.keys(this.clusterDict).sort();
    });
  }

  public viewConsumers = (cluster) => {
    this.homeService.viewConsumers(cluster);
  }

  public viewTopics = (cluster) => {
    this.homeService.viewTopics(cluster);
  }

}
