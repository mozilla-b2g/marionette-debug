var http = require('http');

/**
 * A marionette plugin for debugging integration tests.
 *
 * @param {Marionette.Client} client Marionette client to use.
 * @param {Object} options map of attributes for Apps.
 */
function MarionetteDebug(client, options) {
  this.client = client;
  this.screenshots = [];
  this.options = options;
}

module.exports = MarionetteDebug;

/**
 * Make a new MarionetteDebug.
 *
 * @param {Marionette.Client} client Marionette client to use.
 * @param {Object} options map of attributes.
 * @return {Apps} instance.
 */
MarionetteDebug.setup = function(client, options) {
  return new MarionetteDebug(client, options);
};

MarionetteDebug.prototype = {
  /**
   * Capture a screenshot.
   *
   * @param {String} description the description to the screenshot image.
   */
  screenshot: function(description) {
    var screenshot = this.client.screenshot();
    this.screenshots.push(
      { description: description, image: screenshot }
    );
  },

  /**
   * Send screenshot images to a specified server.
   *
   * @param {Function} callback run after server do response.
   */
  sendScreenshot: function(callback) {
    var options = {
      host: this.options.server,
      port: this.options.port,
      path: '/screenshot',
      method: 'POST'
    };

    var request = http.request(options, function(response) {
      response.setEncoding('utf-8');
      response.on('data', function(data) {
        var json = JSON.parse(data);
        if (data.result === 'success') {
          callback(undefined, json);
        } else {
          callback(json);
        }
      });
    });

    request.on('error', function(error) {
      callback(error);
    });

    var data = JSON.stringify(
      { screenshots: this.screenshots }
    );
    request.write(data);
    request.end();
  },

  /**
   * Get the base64 encoding data of the specified screenshot image.
   *
   * @param {Number} index the index of image files.
   * @return {String} the image data.
   */
  getScreenshot: function(index) {
    return this.screenshots[index];
  }
};
