import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {Observable, BehaviorSubject, Subject, of, forkJoin, concat, throwError, interval, combineLatest, merge} from 'rxjs';
import { retry, map, catchError, take, mergeMap, concatMap } from 'rxjs/operators';
import {Home} from '../classes/home';
import {ClusterHome} from '../classes/clusterHome';
import {ClusterConsumerHome} from '../classes/clusterConsumerHome';
import {Consumer} from '../classes/consumer';
import {ClusterTopicHome} from '../classes/clusterTopicHome';
import {Topic} from '../classes/topic';

@Injectable()
export class BurrowService {
  // Observable Home
  private _home: Subject<Home> = new Subject();
  get home(): Observable<Home> { return this._home.asObservable(); }

  // Observable Dictionary of Clusters
  private _clusters: BehaviorSubject<ClusterDictionary> = new BehaviorSubject({});
  get clusters(): Observable<ClusterDictionary> { return this._clusters.asObservable(); }

  // Observable Dictionary of Consumers
  private _consumers: BehaviorSubject<ConsumerDictionary> = new BehaviorSubject({});
  get consumerDictionary(): Observable<ConsumerDictionary> {
    return this._consumers.asObservable();
  }

  // Observable Dictionary of Topics
  private _topics: BehaviorSubject<TopicDictionary> = new BehaviorSubject({});
  get topicDictionary(): Observable<TopicDictionary> {
    return this._topics.asObservable();
  }

  // Home URL for Burrow
  private burrowUrl = '/api/burrow';

  constructor(private http: HttpClient) {  }

  // Setup Methods
  loadHomeView(): void {
    this.getHome().subscribe(homeObj => {
      this._home.next(homeObj);

      homeObj.clusters.forEach(clusterName => {
        this.getCluster(clusterName).subscribe(newCluster => {

          this.getClusterConsumerHome(clusterName).subscribe(clusterObj => {
            newCluster.numConsumers = clusterObj.consumers.length;
          });

          this.getClusterTopicHome(clusterName).subscribe(clusterObj => {
            newCluster.numTopics = clusterObj.topics.length;
          });

          const clusterDictionary = this._clusters.getValue();
          clusterDictionary[newCluster.clusterName] = newCluster;
          this._clusters.next(clusterDictionary);
        });
      });
    });
  }

  loadConsumers(cluster: ClusterHome): void {
    const clusterName = cluster.clusterName;

    this.getClusterConsumerHome(clusterName).subscribe(clusterObj => {
      const consumerDictionary = this._consumers.getValue();
      consumerDictionary[clusterName] = [];

      clusterObj.consumers.forEach(consumer => {
        this.getConsumer(clusterName, consumer).subscribe(newConsumer => {
          consumerDictionary[clusterName].push(newConsumer);
          this._consumers.next(consumerDictionary);
        });
      });
    });

  }

  loadTopics(cluster: ClusterHome): void {
    const clusterName = cluster.clusterName;

    this.getClusterTopicHome(clusterName).subscribe(clusterObj => {
      const topicDictionary = this._topics.getValue();
      topicDictionary[clusterName] = [];

      clusterObj.topics.forEach(topic => {
        this.getTopic(clusterName, topic).subscribe(newTopic => {
          topicDictionary[clusterName].push(newTopic);
          this._topics.next(topicDictionary);
        });
      });
    });
  }

  getHome(): Observable<Home> {
    return this.http.get<Home>(this.burrowUrl + '/home')
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getCluster(cluster: string): Observable<ClusterHome> {
    return this.http.get<ClusterHome>(this.burrowUrl + '/cluster/' + cluster)
      .pipe(
        map((response: ClusterHome) => {
          response.clusterName = cluster;
          return response;
        }),
        retry(3),
        catchError(this.handleError)
      );
  }

  getClusterConsumerHome(cluster: string): Observable<ClusterConsumerHome> {
    return this.http.get<ClusterConsumerHome>(this.burrowUrl + '/cluster/' + cluster + '/consumer')
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getConsumer(cluster: string, consumer: string): Observable<Consumer> {
    return this.http.get<Consumer>(this.burrowUrl + '/cluster/' + cluster + '/consumer/' + consumer)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getClusterTopicHome(cluster: string): Observable<ClusterTopicHome> {
    return this.http.get<ClusterTopicHome>(this.burrowUrl + '/cluster/' + cluster + '/topic')
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getTopic(cluster: string, topic: string): Observable<Topic> {
    return this.http.get<Topic>(this.burrowUrl + '/cluster/' + cluster + '/topic/' + topic)
    .pipe(
      map((response: Topic) => {
        response.cluster = cluster;
        response.topic = topic;
        return response;
      }),
      retry(3),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'There was a server error, please try again later.');
  }
}

export interface ConsumerDictionary {
  [ index: string ]: Consumer[];
}

export interface TopicDictionary {
  [ index: string ]: Topic[];
}

export interface ClusterDictionary {
  [ index: string ]: ClusterHome;
}

