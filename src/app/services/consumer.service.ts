import { Injectable } from '@angular/core';
import {Consumer} from '../classes/consumer';
import {Observable, BehaviorSubject, Subject} from 'rxjs';
import {BurrowService} from './burrow.service';
import {Params, ActivatedRoute} from '@angular/router';

@Injectable()
export class ConsumerService {
  // Variables
  consumerName: string;
  clusterName: string;

  // Observable Consumer
  private _consumer: Subject<Consumer> = new Subject();
  get consumer(): Observable<Consumer> { return this._consumer.asObservable(); }

  // Observable Lag Window
  private _lagWindow: BehaviorSubject<number[]> = new BehaviorSubject([]);
  get lagWindow(): Observable<number[]> { return this._lagWindow.asObservable(); }

  constructor(private burrowService: BurrowService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params: Params) => {
      this.consumerName = params['consumer'];
      this.clusterName = params['cluster'];
      this.burrowService.getConsumer(this.clusterName, this.consumerName).subscribe(cons => {
        this._consumer.next(cons);
      });
    });
  }

  refreshData() {
    this.burrowService.getConsumer(this.clusterName, this.consumerName).subscribe(cons => {
      // Add Total Lag Window
      const window = this._lagWindow.getValue();
      window.push(cons.status.totallag);
      this._lagWindow.next(window);

      // Manage Partition Data

      // Update Consumer
      this._consumer.next(cons);
    });
  }

}
