module.exports = function urlEncode(title){
	return title.replace(/\s/g,'+')
	.replace(/[\$|\.]/g,'')
}
