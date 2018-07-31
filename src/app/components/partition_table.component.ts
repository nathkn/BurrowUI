import { Component, OnInit } from '@angular/core';
import { Consumer } from '../classes/consumer';
import { ConsumerService } from '../services/consumer.service';

@Component({
  selector: 'partition-table',
  templateUrl: '../../templates/partition_table.html',
})

export class PartitionTableComponent implements OnInit {
  consumer: Consumer;
  toggle = true;

  constructor(private consumerService: ConsumerService) {
    this.consumerService.consumer.subscribe(obj => {
      this.consumer = obj;
    });
  }

  ngOnInit(): void {

  }

  get pipeString(): string[] {
    return this.toggle ? ['WARN', 'STOP', 'STALL', 'ERR', 'OK'] : ['WARN', 'STOP', 'STALL', 'ERR'];
  }

  get sortTitle(): string {
    return this.toggle ? 'Hide OK' : 'Show OK';
  }

  toggleSort() { this.toggle = !this.toggle; }

}
