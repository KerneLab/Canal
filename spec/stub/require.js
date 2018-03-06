function require(url){
	if (url.indexOf("canal.js")>=0 ) {
		return Canal;
	}else if (url.indexOf("expect.js")>=0) {
		return expect;
	}
}