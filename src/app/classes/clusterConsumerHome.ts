import {Request} from './request';

export class ClusterConsumerHome {
  constructor(
    public error:      string,
    public message:    string,
    public consumers:  string[],
    public request:    Request
  ) {}

}
