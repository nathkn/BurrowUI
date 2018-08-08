import {PipeTransform, Injectable, Pipe} from '@angular/core';
import {Request} from './request';
import {Cluster} from './cluster';
import {Consumer} from './consumer';
import {Topic} from './topic';

export class ClusterHome {
  public consumers:  Consumer[];
  public topics: Topic[];
  public isError = false;
  public isWarning = false;
  public isOkay = true;
  public clusterName = '';
  public numConsumers = 0;
  public numTopics = 0;

  constructor(
    public error:      string,
    public message:    string,
    public cluster:    Cluster,
    public request:    Request
  ) {
    this.consumers = [];
    this.topics = [];
  }

}

