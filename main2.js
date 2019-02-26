var socket = io();
var mymap = L.map('mapid1').setView([42.698334, 23.319941], 13);// 42 - lat, 23 - lng

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia2FtY2hvMTEzIiwiYSI6ImNqcGd5ZmZtMjA0eG4zcXF3dHRlb3pmZHQifQ.s_z5folvJO7-ybvZqy0WvA', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);
	
	var popup = L.popup();
	var markers = [
	L.marker([42.698204, 23.343312]),
	L.marker([42.698004, 23.343018]),
	L.marker([42.699104, 23.343928]),
	L.marker([42.697404, 23.344188])
	], marker;

	socket.on("signal", function(sig){
		//markers = [];
			markers.push(L.circle([sig.coords.lat, sig.coords.lng], {
    color: 'red',//otvun
    fillColor: '#f03',//vutre
    fillOpacity: 0.3,
    radius: sig.r
}).bindPopup("<h2 style='color: blue;'>"+sig.name+"</h2><img style='width: 100%; max-width: 400px; height: auto;' src="+sig.file+"><p>"+sig.text+"</p><p>"+sig.koi+" <a href='/checked'>Изпълни<a/> </p>"));
//console.log(sig[i]);
//console.log("1");
	});

		socket.on("delSignal", function(sig){
		markers = [];
		for (var i = sig.length - 1; i >= 0; i--) {
			markers.push(L.circle([sig[i].coords.lat, sig[i].coords.lng], {
    color: 'red',//otvun
    fillColor: '#f03',//vutre
    fillOpacity: 0.3,
    radius: sig[i].r
}).bindPopup("<h2 style='color: blue;'>"+sig[i].name+"</h2><img style='width: 100%; max-width: 400px; height: auto;' src="+sig[i].file+"><p>"+sig[i].text+"</p><p>"+sig[i].koi+" <a href='/checked'>Изпълни<a/> </p>"));
//console.log(sig[i]);
		}
	});

	socket.on("signali", function(sig){
		markers = [];
		for (var i = sig.length - 1; i >= 0; i--) {
			markers.push(L.circle([sig[i].coords.lat, sig[i].coords.lng], {
    color: 'red',//otvun
    fillColor: '#f03',//vutre
    fillOpacity: 0.3,
    radius: sig[i].r
}).bindPopup("<h2 style='color: blue;'>"+sig[i].name+"</h2><img style='width: 100%; max-width: 400px; height: auto;' src="+sig[i].file+"><p>"+sig[i].text+"</p><p>"+sig[i].koi+"</p>"));
//console.log(sig[i]);
		}
//console.log("1");
	});

	socket.on("coordsP", function(msg){
		//document.getElementById('msg').value = msg;
		document.getElementById('msg').style.display = 'block';
	});

function onMapClick(e) {
	if(marker != undefined){
		mymap.removeLayer(marker);
		}
        //marker = L.marker(e.latlng).addTo(mymap);
        marker = L.circle(e.latlng, {
    color: '#6EBE20',//otvun
    fillColor: '#73D216',//vutre
    fillOpacity: 0.3,
    radius: parseInt(document.getElementById("mySelect").value)
}).addTo(mymap);
marker.bindPopup("<h2 style='color: blue;'>Kude sum???</h2>");
document.getElementById('x').value = e.latlng.lat;
document.getElementById('y').value = e.latlng.lng;
        //markers.push(marker);
}

mymap.on('click', onMapClick);

function upImg() {
	document.getElementById('file-to-upload').style.display = "block";
}

function imgDis(){
		document.getElementById('file-to-upload').style.display = "none";
}

function update() {

	
	for(var i=0; i<markers.length; i++){
			markers[i].addTo(mymap);
		}
	
}
  setInterval(function(){
		update();
	  }, 100);
