export class Serializable {
  fromJSON(json: string) {
    console.log('Entry: ' + json + 'from JSON');
    const jsonObj = JSON.parse(json);
    for (const propName of Object.keys(jsonObj)) {
      this[propName] = jsonObj[propName];
    }
    return this;
  }
}
