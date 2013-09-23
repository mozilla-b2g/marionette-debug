suite('MarionetteDebug', function() {
  var CLOCK_APP = 'app://clock.gaiamobile.org';
  var BASE64_PATTERN = /^data:image\/png;base64,\S+/;
  var screenshotDescription;

  var assert = require('assert');
  var sinon = require('sinon');

  marionette.plugin('apps', require('marionette-apps'));
  marionette.plugin(
    'debug', require('../index'),
    { server: 'localhost', port: 3000 }
  );
  var client = marionette.client();

  setup(function() {
    screenshotDescription = 'Take first screenshot.';
    client.apps.launch(CLOCK_APP);
    client.apps.switchToApp(CLOCK_APP);
    client.debug.screenshot(screenshotDescription);
  });

  suite('#screenshot', function() {
    test('should take a screenshot', function() {
      assert.strictEqual(client.debug.screenshots.length, 1);
      assert.strictEqual(
        screenshotDescription,
        client.debug.screenshots[0].description
      );
      assert.ok(
        client.debug.screenshots[0].image.match(BASE64_PATTERN)
      );
    });

    test('should take second screenshot', function() {
      var description = 'Take second screenshot.';
      client.debug.screenshot(description);
      assert.strictEqual(client.debug.screenshots.length, 2);
      assert.strictEqual(
        description,
        client.debug.screenshots[1].description
      );
      assert.ok(
        client.debug.screenshots[1].image.match(BASE64_PATTERN)
      );
    });
  });

  suite('#sendScreenshot', function() {
    var http = require('http');
    var requestData = {};

    setup(function() {
      sinon.stub(http, 'request', function() {
        return {
          on: function() {},
          write: function(data) {
            requestData = JSON.parse(data);
          },
          end: function() {}
        };
      });
    });

    teardown(function() {
      http.request.restore();
    });

    test('should send screenshot to server', function() {
      client.debug.sendScreenshot();

      var expectedValue = {
        screenshots: [
          {
            description: screenshotDescription,
            image: requestData.screenshots[0].image
          }
        ]
      };

      assert.strictEqual(
        JSON.stringify(expectedValue),
        JSON.stringify(requestData)
      );
    });
  });

  suite('#getScreenshot', function() {
    test('should get the first screenshot', function() {
      var screenshot = client.debug.getScreenshot(0);

      assert.strictEqual(
        screenshotDescription,
        screenshot.description
      );
      assert.ok(
        screenshot.image.match(BASE64_PATTERN)
      );
    });
  });
});
