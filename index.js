/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var read = fs.readFileSync;
var yaml = require('js-yaml');

/**
 * Expose the yaml component builder
 */

module.exports = function cyaml(options) {
  options = options || {};

  return function yamlBuilder (builder) {
    builder.hook('before scripts', function(pkg) {
      // check if we have .files in component.json
      var files = pkg.config.files;
      if (!files) return;

      // translate templates
      files.forEach(function(file) {
        // avoid if not yaml
        if ('.yaml' !== path.extname(file)) return;

        var str = read(pkg.path(file), 'utf8');
        var js = 'module.exports = ' + JSON.stringify(yaml.safeLoad(str, options), null, 2);

        // add the fabricated script
        pkg.addFile('scripts', file, js);
        pkg.removeFile('files', file);
      });
    });

  }
}
