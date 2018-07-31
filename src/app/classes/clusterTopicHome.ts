import {Request} from './request';

export class ClusterTopicHome {
  constructor(
    public error:      string,
    public message:    string,
    public topics:     string[],
    public request:    Request
  ) {}

}
