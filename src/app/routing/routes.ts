import { ConsumerComponent } from '../components/consumer.component';
import { HomeComponent } from '../components/home.component';
import { ErrorComponent } from '../components/error.component';

export const ROUTES = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'AnalyzeConsumer',
    component: ConsumerComponent
  },
  {
    path: '**',
    component: ErrorComponent
  }
];
