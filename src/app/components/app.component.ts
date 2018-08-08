import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BurrowService } from '../services/burrow.service';

@Component({
  selector: 'consumer_application',
  templateUrl: '../../templates/main.html',
})

export class AppComponent implements OnInit {
  consumer: string;
  environment: string;
  burrowHome: string;

  constructor(private route: ActivatedRoute, private burrowService: BurrowService) {  }

  ngOnInit() {
    this.burrowService.getHome().subscribe(
      home => {
        this.burrowHome = home.request.host;
      },
      error => {
        this.burrowHome = 'Error';
      }
    );
    this.getParams();
  }

  getParams(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.consumer = params['consumer'];
      this.environment = params['cluster'];
    });
  }

}
