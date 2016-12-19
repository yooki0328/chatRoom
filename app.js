var http = require("http")
var fs = require("fs")
var url = require("url")
var mime = require("./mime").type
var path = require("path")
var server = http.createServer(function(req,res){
	var pathname=url.parse(req.url).pathname;
	if(pathname!="/favicon.ico")
	{


	pathname =path.normalize(__dirname+url.parse(req.url).pathname)
	
	pathHandle(pathname)
		function pathHandle(pathname){
		fs.stat(pathname,function(err,stats){
			if(err){

				console.log(pathname)
				console.log(err)
				res.writeHeader(404,{'Content-Type':'text/plain'})
				res.end()
			}else{
				if(stats.isDirectory()){
					pathname+= '/index.html'
					
					pathHandle(pathname)
				}else{
					
					var ext = path.extname(pathname) 
					ext = ext?ext.slice(1):'unknown'
					var ContentType = mime[ext]||"text/plain"
					var readStream=fs.createReadStream(pathname)
					readStream.on('data',function(data){

						res.writeHeader(200,{'Content-Type':ContentType})
						res.write(data)
						res.end();
					})				
				}
			}
		})		
	}
	}
}).listen(3000)
var count = 0
var io = require("socket.io").listen(server)
io.sockets.on('connection',function(socket){
	count++;
	socket.on('title',function(data){
		
		socket.emit('usernum',{usernum:count})
		socket.broadcast.emit('usernum',{usernum:count})
		socket.emit('get title',data)
		socket.broadcast.emit('get title',data)
	})
	socket.on('information',function(data){
		socket.emit('get information',data)
		socket.broadcast.emit('get information',data);
	})
	socket.on('disconnect',function(){
    count--;
    socket.broadcast.emit('usernum',{usernum:count});
  });	
})
