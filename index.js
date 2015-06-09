var jade        = require('jade');
var through     = require('through2');
var gutil       = require('gulp-util');

var File        = gutil.File;
var ext         = gutil.replaceExtension;
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-jade-duplexer';

var gulpJadeDuplexer = function (options) {

	return trough.obj(function (file, enc, cb) {

		// If file is empty, return empty file
		if (file.isNull()) return cb(null, file);

		// Get data array (numeric or associative)
		// Can be direct input or downstream from gulp-data
		var data = { duplexer: file.data };

		if (options && options.locals) {
			data = options.locals;
			if(options.locals.duplexer)
				data.duplexer = options.locals.duplexer;
		}

		var data = (options && options.locals) {
			options.locals : {duplexer:file.data};

		// data is not an array (numeric or associative)
		//if (!data || typeof data !== 'object') {
		if (typeof data.duplexer !== 'object') {
			return cb(new PluginError(PLUGIN_NAME, 'Passed argument is not an array (associative or numeric)'));
		}

		// Check if data has entries (if no, there would be an empty output)
		/*if (length === 0) {
			return cb(new PluginError(PLUGIN_NAME, 'Passed object has no properties or array has no entries.'));
		}*/

		// If file is a stream, return an error
		if (file.isStream()) {
			return cb(new PluginError('gulp-jade', 'Streaming not supported'));
		}

		// If file is buffer, continue to compilation step
		if (file.isBuffer()) {

			// Stringify the file contents
			var jadeTemplate = String(file.contents);
			var length = (data.duplexer.length) ? data.duplexer.length : Object.keys(data.duplexer).length;

			// If data is an empty object or array, just compile the jade template
			// and return html
			if(length === 0) {
				var html = jade.compile(jadeTemplate, options)(data);
				file.contents = new Buffer(html);
				file.path = ext(file.path, '.html');
				return cb(null, file);
			}

			// Loop through entries
			for (var entry in data.duplexer) {

				// Generate html string
				var lang = data.duplexer[lang];
				var tempData = 
				var html = jade.compile(jadeTemplate, options)(data.duplexer[entry]);

				// Push the new file to the buffer
				this.push(new File({
					base: file.base,
					path: ext(file.path, '_' + entry + '.html'),
					contents: new Buffer(html)
				}));
			}

			// Return no error nor file
			return cb(null, null);
		}
	});
};

function createFile(path, contents) {
	return new File({

	});


}

module.exports = gulpJadeDuplexer;