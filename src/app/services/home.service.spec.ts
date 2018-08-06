import { TestBed, inject } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';

import { HomeService } from './home.service';
import { BurrowService } from '../services/burrow.service';
import { ClusterHome } from '../classes/clusterHome';
import { Cluster } from '../classes/cluster';
import { Request } from '../classes/request';



describe('HomeService', () => {
  let homeService: HomeService;
  let burrowServiceSpy: jasmine.SpyObj<BurrowService>;
  let mockClusterHome: ClusterHome;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('BurrowService', ['loadHomeView']);

    TestBed.configureTestingModule({
      providers: [
        HomeService,
        {provide: BurrowService, useValue: spy }
      ]
    });

    burrowServiceSpy = TestBed.get(BurrowService);
    homeService = TestBed.get(HomeService);

    mockClusterHome = new ClusterHome(
      'false',
      'cluster list returned',
      new Cluster([''], 2181, 'zkpath', ['kafka'], 9092, ''),
      new Request('/v3/kafka', 'test-burrow-host')
    );
    mockClusterHome.clusterName = 'mock-cluster';
  });

  it('should be created', () => {
    expect(homeService).toBeTruthy();
  });

  it('.viewTopicList should return inital viewTopicList as false', () => {
    const falseBehaviorSubject = new BehaviorSubject(false);
    expect(homeService.viewTopicList).toEqual(falseBehaviorSubject.asObservable());
  });

  it('.viewConsumerList should return initial viewConsumerList as false', () => {
    const falseBehaviorSubject = new BehaviorSubject(false);
    expect(homeService.viewConsumerList).toEqual(falseBehaviorSubject.asObservable());
  });

  it('.listTitle should return inital listTitle', () => {
    const listTitle = new BehaviorSubject('Please Select a Cluster');
    expect(homeService.listTitle).toEqual(listTitle.asObservable());
  });

  it('.selectedCluster should return initial empty cluster as empty', () => {
    const emptySelectedCluster: Subject<ClusterHome> = new Subject();
    expect(homeService.selectedCluster).toEqual(emptySelectedCluster.asObservable());
  });

  it('.loadedCluster should return inital loaded cluster as empty', () => {
    expect(homeService.loadedCluster).not.toBeDefined();
  });

  it('#viewTopics sets selected cluster', () => {
    homeService.viewTopics(mockClusterHome);
    homeService.selectedCluster.subscribe((cluster: ClusterHome) => {
        expect(cluster).toEqual(mockClusterHome);
    });
  });

  it('#viewTopics sets loaded cluster', () => {
    homeService.viewTopics(mockClusterHome);
    expect(homeService.loadedCluster).toEqual(mockClusterHome);
  });

  it('#viewTopics toggles viewTopicList to true', () => {
    homeService.viewTopics(mockClusterHome);
    homeService.viewTopicList.subscribe((toggle: boolean) => {
        expect(toggle).toEqual(true);
    });
  });

  it('#viewTopics toggles viewConsumerList to false', () => {
    homeService.viewTopics(mockClusterHome);
    homeService.viewConsumerList.subscribe((toggle: boolean) => {
        expect(toggle).toEqual(false);
    });
  });

  it('#viewTopics sets listTitle', () => {
    homeService.viewTopics(mockClusterHome);
    homeService.listTitle.subscribe((listTitle: string) => {
        expect(listTitle).toEqual('Available Topics');
    });
  });

  it('#viewConsumers sets loaded cluster', () => {
    homeService.viewConsumers(mockClusterHome);
    expect(homeService.loadedCluster).toEqual(mockClusterHome);
  });

  it('#viewConsumers toggles viewConsumerList to true', () => {
    homeService.viewConsumers(mockClusterHome);
    homeService.viewConsumerList.subscribe((toggle: boolean) => {
        expect(toggle).toEqual(true);
    });
  });

  it('#viewConsumers toggles viewTopicList to false', () => {
    homeService.viewConsumers(mockClusterHome);
    homeService.viewTopicList.subscribe((toggle: boolean) => {
        expect(toggle).toEqual(false);
    });
  });

  it('#viewConsumers sets listTitle', () => {
    homeService.viewConsumers(mockClusterHome);
    homeService.listTitle.subscribe((listTitle: string) => {
        expect(listTitle).toEqual('Available Consumers');
    });
  });

});
