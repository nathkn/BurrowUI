import {Injectable} from '@angular/core';
import {ClusterHome} from '../classes/clusterHome';
import {Observable, Subject, BehaviorSubject} from 'rxjs';
import {ClusterDictionary, ConsumerDictionary, TopicDictionary, BurrowService} from './burrow.service';
import { ConsumerComponent } from '../components/consumer.component';

@Injectable()
export class HomeService {

  // Observable View Topic Bool
  private _viewTopicList: BehaviorSubject<boolean> = new BehaviorSubject(false);
  get viewTopicList(): Observable<boolean> { return this._viewTopicList.asObservable(); }

  // Observable View Consumers Bool
  private _viewConsumerList: BehaviorSubject<boolean> = new BehaviorSubject(false);
  get viewConsumerList(): Observable<boolean> { return this._viewConsumerList.asObservable(); }

  // Observable List Title
  private _listTitle: BehaviorSubject<string> = new BehaviorSubject('Please Select a Cluster');
  get listTitle(): Observable<string> { return this._listTitle.asObservable(); }


  // Observable Clusters
  clusters: Observable<ClusterDictionary>;

  // Observable Selected Cluster
  private currentCluster: ClusterHome;
  private _selectedCluster: BehaviorSubject<ClusterHome> = new BehaviorSubject(null);
  get selectedCluster(): Observable<ClusterHome> {return this._selectedCluster.asObservable(); }

  get loadedCluster(): ClusterHome {
    return this.currentCluster;
  }

  constructor(private burrowService: BurrowService) {
    this.clusters = this.burrowService.clusters;
    this.burrowService.loadHomeView();
  }

  viewConsumers(cluster: ClusterHome) {
    this.burrowService.loadConsumers(cluster);
    this.setCurrentCluster(cluster);
    this._viewTopicList.next(false);
    this._viewConsumerList.next(true);
    this._listTitle.next('Available Consumers');
  }

  viewTopics(cluster: ClusterHome) {
    this.burrowService.loadTopics(cluster);
    this.setCurrentCluster(cluster);
    this._viewTopicList.next(true);
    this._viewConsumerList.next(false);
    this._listTitle.next('Available Topics');
  }

  private setCurrentCluster(cluster: ClusterHome) {
    this._selectedCluster.next(cluster);
    this.currentCluster = cluster;
  }
}
