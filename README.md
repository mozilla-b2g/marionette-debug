# marionette-debug

A marionette plugin for debugging integration tests.
Currently, we have functions to handle screenshot things.

## Usage

We could capture screenshot images and send it to a specified server.

And the server repository:
https://github.com/mozilla-b2g/marionette-debug-server

```js
// Expose to marionette.
client.plugin(
  'debug',
  require('marionette-debug'),
  {
    server: '192.168.1.2', // The server IP.
    port: 3000
  }
);

// Capture a screenshot.
client.debug.screenshot('Take first screenshot.');

// Send it to the 192.168.1.2 server.
client.debug.sendScreenshot();
```
