var YAML = require('yamljs');
var _ = require('lodash');

module.exports = function getFileHeader(content){
	var header = content.match(/<!-- header\n(.|\n)*?\nheader -->/g);
	if(!header) return {};

	return YAML.parse(header[0]
	.replace(/<!-- header\n/g,'')
	.replace(/\nheader -->/g,'')
	.replace(/\t/g,'  ')
	)
}
