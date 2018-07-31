import {Request} from './request';

export class Home {

  constructor(
    public error:     string,
    public message:   string,
    public clusters:  string[],
    public request:   Request
  ) {}

}
