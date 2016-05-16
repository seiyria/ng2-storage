# ng2-storage
A service wrapping local and session storage for ng2.

# Install
`npm i -s ng2-storage`

# Browser Support
This library makes heavy use of [ES6 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), meaning it only has support in the latest Edge, Chrome, Firefox, and Opera.

# Usage
First, bootstrap the service globally:

```js
import { StorageSettings } from 'ng2-storage';

bootstrap(App, [
  provide(StorageSettings, { useValue: { prefix: 'ng2-storage' } })
]);
```

Next, inject it into a component:
```js
import { StorageService } from 'ng2-storage';

@Component({
  providers: [StorageService],
  template: `<button (click)="incrementStoredData()">click</button>`
})
export class MyComponent {

  static get parameters() {
    return [[StorageService]];
  }

  constructor(storage) {
    // you can also use storage.session for sessionStorage
    this.storage = storage.local;
  }

  incrementStoredData() {
    this.storage.data = this.storage.data || 0;
    this.storage.data++;
  }
}
```

# Options
Name      | Default       | Description
----      | -------       | -----------
prefix    | 'ng2-storage' | The key prefix when assigning data to local or session storage.
serialize | window.JSON   | Used when de/serializing data from the storage container. Both `serialize` and `parse` attributes must be specified and must be functions if you want custom ones.
