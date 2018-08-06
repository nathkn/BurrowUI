import { AppComponent } from './app.component';
import { BurrowService } from '../services/burrow.service';
import { ConsumerService } from '../services/consumer.service';
import { HomeService } from '../services/home.service';
import { HttpClientModule } from '@angular/common/http';
import { from, of, throwError } from 'rxjs';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Home } from '../classes/home';
import { Request } from '../classes/request';
import { ActivatedRoute } from '@angular/router';

describe('AppComponent', function () {

  let burrowServiceSpy: jasmine.SpyObj<BurrowService>;
  const stubHomeObj = new Home(
    'false',
    'cluster list returned',
    ['test-cluster'],
    new Request('/v3/kafka', 'test-burrow-host')
  );

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('BurrowService', ['getHome']);

    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports: [ RouterTestingModule, HttpClientModule ],
      providers: [
        {provide: BurrowService, useValue: spy }
      ]
    })
    .compileComponents();

    burrowServiceSpy = TestBed.get(BurrowService);
    burrowServiceSpy.getHome.and.returnValue(of(stubHomeObj));
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerText).toContain('Kafka Analysis Tool');
  }));

  it('should set burrow home if succeeds', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.burrowHome).toEqual('test-burrow-host');
  }));

  it('should set burrow home to \'Error\' if request errors', async(() => {
    burrowServiceSpy.getHome.and.returnValue(throwError({status: 404}));

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.burrowHome).toEqual('Error');
  }));
});
