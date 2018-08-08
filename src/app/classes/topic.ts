import {Request} from './request';
import {PipeTransform, Injectable, Pipe} from '@angular/core';

export class Topic {
  public topic = '';
  public cluster = '';

  constructor(
    public error:      string,
    public message:    string,
    public offsets:    number[],
    public request:    Request
  ) {}

}

// This is used for filtering partition results
@Pipe({
  name: 'topicSort',
  pure: false
})

@Injectable()
export class TopicSortPipe implements PipeTransform {
  transform(array: Array<any>): Array<string> {
    if (array == null) { return array; }
    array.sort((a: any, b: any) => {
      // Place topics that start with special characters at the end
      a = a.topic.replace(/[_\W]/g, String.fromCharCode(0xFFFF));
      b = b.topic.replace(/[_\W]/g, String.fromCharCode(0xFFFF));
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      } else if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}
