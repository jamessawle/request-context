# Request Context

This library provides a simple mechanism to store and retrieve data across the lifecycle of a request within Express, without having to pass objects around.

```javascript
import {getContext, setupContextMiddleware} from '@jamessawle/request-context';
import express from 'express';

// Setup
const app = express();
app.use(setupContextMiddleware('some-unique-id'));

// Somewhere in request handling code
getContext().set('where', 'there');

// Elsewhere in request handling code
const data = getContext().get('where'); //will equal 'there'
```

## How it works

Under the hood, the library is use continuation local storage, powered by [async-hooks](https://nodejs.org/api/async_hooks.html) using [cls-hooked](https://www.npmjs.com/package/cls-hooked). This however may change in any release in the future.

Similar libraries:

- `express-http-context`
- `express-cls-hooked`
- `express-ctx`

However, unlike these libraries, this library provides mechanisms to find out what data is contained within the Context. This is required to enable the following feature.

## Stop corruption of the Context

A number of middleware are known to corrupt `async-hooks`, such as `body-parser`. Unlike the prior libraries, this library provides a mechanism to wrap such middleware to ensure that the Context is maintained.

```typescript
import { middlewareWrapper } from '@jamessawle/request-context';
import bodyParser from 'body-parser';

app.use(middlewareWrapper(bodyParser));
```

The wrapper copies the content of the Context before calling the delegate middleware. Once the delegate has completed, the wrapper then resets the Context to the retrieved content and then calls the next middleware in the chain.

The downside of this implementation means that any data that is set or changed during a wrapped middleware will be lost. This may be revisited in future.

## License

[MIT](LICENSE)
