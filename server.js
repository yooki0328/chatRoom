var message = document.getElementById("message");
var btn = document.querySelector(".submit");
var socket = io.connect("localhost:3000"); 
var chatbox=document.querySelector(".chatbox");
socket.on('usernum',function(data){
	document.querySelector(".count").innerHTML="当前有"+data.usernum+"人在线"
});
var information={
	value:message.value,
	user:''
}
var name="";
var subbtn = document.querySelector(".entry");
subbtn.onclick=function(){
	
	name = document.getElementById("NameId").value;
	socket.emit('title',name);
	document.getElementById("first").style.display="none";
	document.getElementById("second").style.display="block";	
	return false;
}
socket.on('get title',function(data){
	
	var p = document.createElement('p');
	var text = document.createTextNode(data+"进入聊天室");
	var b=document.getElementById("title_top");
	if(b.innerText=="")
		{b.innerHTML=data;}
	p.appendChild(text);
	p.setAttribute('class','title');
	chatbox.appendChild(p);
})
btn.onclick=function(){
	information.value = message.value;
	information.user = name;
	socket.emit('information',information);
	return false;
}
message.onkeypress=function(){
	if(event.keyCode==13){
		if(message.value){
			information.value = message.value;
			information.user = name;
			socket.emit('information',information);
		}
		
	
	return false;
	}
}
socket.on('get information',function(data){
	var section = document.createElement('section');
	var div =document.createElement('div');
	var span = document.createElement('span');
	var textNode1 = document.createTextNode(data.user);
	var textNode2 = document.createTextNode(data.value);
	div.appendChild(textNode1);
	span.appendChild(textNode2);
	section.appendChild(span);
	section.appendChild(div);
	if(data.user== name){
		section.setAttribute('class','user');
	}
	
	chatbox.appendChild(section);
	chatbox.appendChild(document.createElement('br'));
	message.value="";
	chatbox.scrollTop=chatbox.scrollHeight;
})
document.getElementById("exit").onclick=function(){
	if(confirm("确定退出？")){
		document.location.reload();}	
}





