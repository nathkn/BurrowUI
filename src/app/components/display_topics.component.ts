import { Component, OnInit, Input } from '@angular/core';
import {ClusterHome} from '../classes/clusterHome';
import {BurrowService} from '../services/burrow.service';
import {Topic} from '../classes/topic';
import { load } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'display_topic_list',
  templateUrl: '../../templates/display_topics.html',
})

export class DisplayTopicsComponent implements OnInit {
  @Input() cluster: ClusterHome;
  topics: Topic[];

  constructor(private burrowService: BurrowService) {  }

  ngOnInit() {
    this.burrowService.topicDictionary.subscribe(topicDict => {
      this.topics = topicDict[this.cluster.clusterName];
    });
  }
}
