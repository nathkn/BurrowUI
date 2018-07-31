import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {Observable, BehaviorSubject, Subject, throwError} from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';
import {Home} from '../classes/home';
import {ClusterHome} from '../classes/clusterHome';
import {ClusterConsumerHome} from '../classes/clusterConsumerHome';
import {Consumer} from '../classes/consumer';
import {ClusterTopicHome} from '../classes/clusterTopicHome';
import {Topic} from '../classes/topic';
import { Status } from '../classes/status';

@Injectable()
export class BurrowService {
  // Observable Home
  private _home: Subject<Home> = new Subject();
  get home(): Observable<Home> { return this._home.asObservable(); }

  // Observable Cluster List
  private _clusters: BehaviorSubject<ClusterHome[]> = new BehaviorSubject([]);
  get clusters(): Observable<ClusterHome[]> { return this._clusters.asObservable(); }

  // Dictionary of Consumers
  private consumerDictionary: ConsumerDictionary = {};
  private topicDictionary: TopicDictionary = {};

  // Home URL for Burrow
  private burrowUrl = '/api/burrow';

  constructor(private http: HttpClient) {

  }

  // Setup Methods
  loadHomeView(): void {
    this.getHome().subscribe(obj => {
      this._home.next(obj);

      obj.clusters.forEach(cluster => {
        this.getCluster(cluster).subscribe(ref => {
          this.consumerDictionary[cluster] = [];
          this.topicDictionary[cluster] = [];

          this.getClusterConsumerHome(cluster).subscribe(clusterObj => {
            clusterObj.consumers.forEach(con => {
              this.getConsumer(cluster, con).subscribe(newCon => {
                this.consumerDictionary[cluster].push(newCon);
              });
            });
          });

          this.getClusterTopicHome(cluster).subscribe(clusterObj => {
            clusterObj.topics.forEach(top => {
              this.getTopic(cluster, top).subscribe(topic => {
                this.topicDictionary[cluster].push(topic);
              });
            });
          });

          const list = this._clusters.getValue();

          ref.consumers = this.consumerDictionary[cluster];
          ref.topics = this.topicDictionary[cluster];
          list.push(ref);
          this._clusters.next(list);
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

interface ConsumerDictionary {
  [ index: string ]: Consumer[];
}

interface TopicDictionary {
  [ index: string ]: Topic[];
}

