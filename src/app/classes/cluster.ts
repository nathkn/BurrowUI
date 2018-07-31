export class Cluster {

  constructor(
    public zookeepers:     string[],
    public zookeeper_port: number,
    public zookeeper_path: string,
    public brokers:        string[],
    public broker_port:    number,
    public offsets_topic:  string
  ) {}

}
