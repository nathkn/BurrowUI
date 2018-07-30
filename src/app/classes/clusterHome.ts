import {PipeTransform, Injectable, Pipe} from "@angular/core";
import {Request} from "./request";
import {Cluster} from "./cluster";
import {Consumer} from "./consumer";
import {Topic} from "./topic";

export class ClusterHome {
  public consumers:  Consumer[];
  public topics: Topic[];
  public isError: boolean = false;
  public isWarning: boolean = false;
  public isOkay: boolean = true;

  constructor(
    public error:      string,
    public message:    string,
    public cluster:    Cluster,
    public request:    Request,
    public clusterName: string
  ) {
    this.consumers = [];
    this.topics = [];
  };

}

// This is used for filtering partition results
@Pipe({
  name: 'clusterSort',
  pure: false
})

@Injectable()
export class ClusterSortPipe implements PipeTransform {
  transform(array: Array<any>): Array<string> {
    if (array == null) return array;
    array.sort((a: any, b: any) => {
      if (a.clusterName.toLowerCase() < b.clusterName.toLowerCase()) {
        return -1;
      } else if (a.clusterName.toLowerCase() > b.clusterName.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}

