function writeHeader( name, value ){
	return function(req, res){
		res.setHeader(name, value);
	}
	//resp.end("hello world a");
}
module.exports = writeHeader;