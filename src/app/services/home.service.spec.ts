import { TestBed, inject } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';

import { HomeService } from './home.service';
import { BurrowService } from '../services/burrow.service';
import { ClusterHome } from '../classes/clusterHome';
import { Cluster } from '../classes/cluster';
import { Request } from '../classes/request';



describe('HomeService', () => {
  let homeService: HomeService;
  let mockClusterHome: ClusterHome;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('BurrowService', ['loadHomeView', 'loadConsumerView', 'loadTopicView']);

    TestBed.configureTestingModule({
      providers: [
        HomeService,
        {provide: BurrowService, useValue: spy }
      ]
    });

    homeService = TestBed.get(HomeService);

    mockClusterHome = new ClusterHome(
      'false',
      'cluster list returned',
      new Cluster(['zk1'], 2181, 'zkpath', ['kafka'], 9092, ''),
      new Request('/v3/kafka', 'test-burrow-host')
    );
    mockClusterHome.clusterName = 'mock-cluster';
  });

  it('should be created', () => {
    expect(homeService).toBeTruthy();
  });

  it('.viewTopicList should return inital viewTopicList as false', () => {
    homeService.viewTopicList.subscribe(toggle => {
      expect(toggle).toBe(false);
    });
  });

  it('.viewConsumerList should return initial viewConsumerList as false', () => {
    homeService.viewConsumerList.subscribe(toggle => {
      expect(toggle).toBe(false);
    });
  });

  it('.listTitle should return inital listTitle', () => {
    homeService.listTitle.subscribe(title => {
      expect(title).toEqual('Please Select a Cluster');
    });
  });

  it('.selectedCluster should return initial empty cluster as empty', () => {
    homeService.selectedCluster.subscribe(cluster => {
      expect(cluster).toBeFalsy();
    });
  });

  it('.loadedCluster should return inital loaded cluster as empty', () => {
    expect(homeService.loadedCluster).toBeFalsy();
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
