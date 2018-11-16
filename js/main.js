
var $ = function (id) { 
    return document.getElementById(id); 
};

function btn_click(){
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } 
    else{
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
       
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
		//call function on successful connection
        get_weather(this);
        }
    };
    
    var e = $("city-dropdown");
	//get selected option's value and text 
    var id = e.options[e.selectedIndex].value;
    var text = e.options[e.selectedIndex].text;
    
	//send AJAX request to openweathermap along with city ID 
    var url = "https://api.openweathermap.org/data/2.5/forecast?id="+id+
	"&mode=xml&&units=metric&cnt=12&appid=50350850ca68fe83d96c30ab18c6fb66"; 
    xhttp.open("GET", url, true);
    xhttp.send();
}



//month


var month_name = function(dt){
mlist = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  return mlist[dt.getMonth()];
};


function get_weather(xmlhttp){
 
    var content = ""
    var firstcont = ""; 
    
	//creating content
   content = "<ul class='carousel-indicators mb-0 pb-0'>";
   content += "<li id='l1' data-target='#demo' data-slide-to='0' class='active' ></li>";
   content += "<li id='l2'data-target='#demo' data-slide-to='1' </li>"
   content += "<li id='l3' data-target='#demo' data-slide-to='2' </li>";
   content += "<li id='l4' data-target='#demo' data-slide-to='3'> </li></ul>";
   content += " <div class='carousel-inner no-padding my-5'>";
    
    //getting xml response
    var xml = xmlhttp.responseXML;
    console.log(xml);
    
	//extracting data from XML
	//get the value stored in the first 'name' tag of xml // Eg. <name> Athlone</name>
     var city = xml.getElementsByTagName("name")[0].firstChild.nodeValue;
	 
	//get the value stored in the first 'country' tag of xml // Eg. <country> IE</country>	
     var country = xml.getElementsByTagName("country")[0].firstChild.nodeValue;
    
	//get the value stored in the first 'location' tag of xml 
	// Eg. <location altitude="0" latitude="53.4228" longitude="-7.9373"></location>
     var location = xml.getElementsByTagName("location")[1];
	 //get the attribute 'latitude' in location
     var lat = location.getAttribute('latitude');
	  //get the attribute 'longitude' in location
     var long = location.getAttribute('longitude');
  
	//get all the elements stored in the 'time' tag of xml 
     var times = xml.getElementsByTagName('time');
    
	//array to store time, temperature, pressure for every interval
     var time_array = [];
     var temp_array = []; var humi_array = []; var pres_array = []; var wind_array = []; var prcp_array = []; var climate_array = [];
    
	//for loop to traverse through all tags as 'time' 
    for (i = 0; i < times.length; i++) { 
         
    if(i==0)
    {
		//initialize carousel 
        content += "<div class='carousel-item active'><div class='row'>";        
    }
    else if(i==3 || i==6 || i==9 ) {
		//new carousel for each group of 3 weather cards
       content += "<div class='carousel-item'><div class='row'>";       
    }
        
	
        /*Getting data from xml, i represents the tag 'time' you are at*/
		
		//In the for loop, get values with attribute 'from' & 'to'
		//<time from="2018-11-08T09:00:00" to="2018-11-08T12:00:00">
		var from = times[i].getAttribute('from'); //2018-11-08T09:00:00
        var to = times[i].getAttribute('to'); //2018-11-08T12:00:00 
        
		//split from with 'T' 
		//2018-11-08T09:00:00" will be splitted into 2018-11-08 & 09:00:00
        var ufrom = from.split("T");//2018-11-08
        var uto = to.split("T");
        
		//get first index from 'ufrom' i.e. 2018-11-08 and split  it
        var date_1 = ufrom[0].split("-");//2018, 11, 08
        var time_1 = ufrom[1].split(":");//09, 00, 00
        var time_2 = uto[1].split(":");
        
		//push the time in time array
        time_array.push(time_1[0] + ":00");
       
		//get element with tag 'symbol' and then get it's attribute
		//Eg. <symbol number="800" name="clear sky" var="01d"></symbol>
        var symbol =  xml.getElementsByTagName("symbol")[i];
        var weather_id = symbol.getAttribute('number');//800
        var weather_name = symbol.getAttribute('name');//clear sky
		//create image from var attribute - '01d'
        var weather_image = "http://openweathermap.org/img/w/" + symbol.getAttribute('var') + ".png";
       
	   
        var prec =  xml.getElementsByTagName("precipitation")[i];
        var precvalue = prec.getAttribute('value');
        var prectype = prec.getAttribute('type');
       
        var wind =  xml.getElementsByTagName("windSpeed")[i];
        var windspeed = wind.getAttribute('mps');
        
        var press =  xml.getElementsByTagName("pressure")[i];
        var pressure = press.getAttribute('value');
        
        var humid =  xml.getElementsByTagName("humidity")[i];
        var humidity = humid.getAttribute('value');
        
        var cl =  xml.getElementsByTagName("clouds")[i];
        var cloud = cl.getAttribute('value');
        
        
        var temp =  xml.getElementsByTagName("temperature")[i];
        var mintemp = temp.getAttribute('min');
        var maxtemp = temp.getAttribute('max');
        var curtemp = temp.getAttribute('value');
        
        //Insert climate's attributes to array  
        temp_array.push(curtemp);
        wind_array.push(windspeed);
        pres_array.push(pressure);
        humi_array.push(humidity);
        prcp_array.push(precvalue);
        climate_array.push(weather_name);
        
        //DOM Manipulation
       content += "<div class='col-md-6 col-lg-4'>";
        
        var weather_card = "";
        //create weather card based on weather condition codes
		
		//If condition code suggests thunderstorm
        if(weather_id.startsWith("2")){
			weather_card += "<div class='weather-card thunder'>"; 
			weather_card += "<div class='icon thunder'>";
			weather_card +=  "<div class='cloud'></div>";
			weather_card +=  "<div class='lightning'>";
			weather_card +=  "<div class='bolt'></div>";
			weather_card +=  "<div class='bolt'></div></div>";
        }
		
		//If condition code suggests drizzle or light rain
        else if(weather_id.startsWith("3") || weather_id == 500){ 
			weather_card +=  "<div class='weather-card sun-shower'>"; 
			weather_card += "<div class='icon sun-shower'>";
			weather_card += "<div class='cloud'></div>";
			weather_card += "<div class='sun'>";
			weather_card += "<div class='ray'></div></div>";
			weather_card += "<div class='rain'></div>";  
        }
        
       //If condition code suggests heavy rain
        else if(weather_id > 500 && weather_id.startsWith("5")){
			weather_card += "<div class='weather-card rainy'>"; 
			weather_card += "<div class='icon rainy'>";
			weather_card += "<div class='cloud'></div>";
			weather_card += "<div class='rain'></div>";
        }
        
		//If condition code suggests clouds
        else if( weather_id.startsWith("8")){
			weather_card += "<div class='weather-card cloudy'>"; 
			weather_card += "<div class='icon cloudy'>";
			weather_card += "<div class='cloud'></div>";
         
        }
        
        //If condition code suggests snow
        else if(weather_id.startsWith("6")){
			weather_card +=  "<div class='weather-card snowy'>";
			weather_card += "<div class='icon snowy'>";
			weather_card += "<div class='cloud'></div>";
			weather_card += "<div class='snow'>";
			weather_card += "<div class='flake'></div>";
			weather_card += "<div class='flake'></div></div>";  
        }
        
		//If condition code suggests sunny
        else{
            weather_card =  "<div class='weather-card sunny'>";
            weather_card += "<div class='icon sunny'>";
            weather_card += "<div class='sun'>";
            weather_card += "<div class='rays'></div></div>";  
        }
        
		//get month from date
        var month = month_name(new Date(ufrom[0]));  
       
        //now put the weather content in the created weather card
        content += weather_card ;
        content += " <div class='date-bar'> " + date_1[2] +"&nbsp" + month+" </div>";
        content += "<div class='time-bar'>" +time_1[0]+ "&nbsp-&nbsp"+ time_2[0]+"</div>";
       
        content += "<div class='temp-min'><p>Min : " + mintemp + "ºC<br>Max : " + maxtemp + "ºC</p></div>";
		content += "<div class='other-info'>Wind Speed - " + windspeed + "<br>        Pressure - " + pressure + "<br>  Humidity - " + humidity + "%</div>";
     
		content += "</div>";
        content += "<h1>"+ curtemp+"º  </h1>";
        content += "<p><b>" + city + "</b>, " + country + "<br>";
        content += " <div class='sky'>" + weather_name +"</div>";
        content += " <div class='wepic'><img src = '" + weather_image + "'</div></div></div></div>";
        
		//Close div for each 3 set in carousel 
        if(i==2 || i==5 || i==8 || i==11 ) {
			content += "</div></div>";            
        }
        
        /* Create first Element */
        if(i==0){
            firstcont = "<div id='ftitle'>Current Status </div>";
            firstcont += "<div id='cardz' class='weater'>";
            firstcont += "<div class='city-selected'><article><div class='infoz'>";
            firstcont += "<div class='city'>"+ city +"</div><div class='night'>From "+time_1[0] +" to " + time_2[0] + "</div><div class='temp'>"+ curtemp +" °C</div>";
            firstcont +="<div class='wind'><svg version='1.1' id='wind' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'viewBox='0 0 300.492 300.492' style='enable-background:new 0 0 300.492 300.492;' xml:space='preserve'><g><g><g><path style='fill:#FFFFFF;' d='M287.166,100.421c-9.502-13.217-24.046-23.034-39.868-26.945c-5.309-1.365-10.845-2.061-16.453-2.061c-11.531,0-22.257,3.035-30.981,8.746c-14.076,8.86-23.709,23.91-25.759,40.157c-2.698,16.644,4.357,34.315,17.519,43.959c7.555,5.716,17.47,8.991,27.201,8.991c7.332,0,14.109-1.811,19.575-5.216c14.936-8.991,21.495-28.577,14.626-43.665c-3.525-7.669-10.427-13.647-18.455-15.975c-2.361-0.696-4.754-1.082-7.131-1.164l-0.288,5.434c1.974,0.141,3.916,0.544,5.782,1.202c6.288,2.143,11.536,7.093,14.044,13.288c1.256,2.975,1.893,6.211,1.822,9.355c-0.071,3.421-0.658,6.565-1.855,9.861c-2.366,6.222-6.967,11.667-12.678,14.968c-10.269,6.233-26.624,4.329-37.171-4.172c-10.405-8.278-15.529-21.87-13.364-35.528c1.8-13.413,9.85-25.71,21.56-32.912c5.553-3.514,12.069-5.803,18.868-6.636c2.823-0.359,6.619-0.413,10.285-0.131c3.497,0.31,7.033,0.903,10.231,1.713c13.358,3.437,25.623,11.863,33.668,23.154c8.365,11.324,12.325,24.96,11.438,39.477c-0.587,14.098-5.423,28.305-13.619,40.021c-8.159,11.759-19.907,21.354-33.108,27.027c-6.059,2.654-13.07,4.574-20.832,5.695c-4.803,0.68-9.959,0.8-16.203,0.892l-176.09,2.339l-29.817,1.164l0.109,5.439l199.015,0.131c2.295,0,4.596,0,6.88,0.022l4.253,0.027c3.835,0,8.376-0.071,12.988-0.593c8.36-1.033,16.263-3.111,23.464-6.168c14.925-6.206,28.283-16.905,37.606-30.127c9.426-13.206,15.072-29.36,15.893-45.438C301.476,130.293,296.679,113.399,287.166,100.421z'/></g><g><path style='fill:#FFFFFF;' d='M106.617,209.839c0.664-0.027,1.463-0.038,2.23-0.038l5.445,0.065c1.528,0.027,2.959,0.049,4.395,0.049c2.801,0,6.511-0.076,10.438-0.647c7.626-1.246,14.849-4.471,20.864-9.312c12.374-9.752,18.874-25.999,16.562-41.391c-2.371-15.648-15.953-28.697-31.547-30.35c-8.539-1.05-16.421,0.979-22.404,5.619c-6.451,4.824-10.688,12.091-11.612,19.842c-1.229,8.077,1.806,16.589,7.664,21.637c5.803,5.287,15.431,7.43,22.387,5.037c5.102-1.702,9.42-5.798,11.563-10.971l-4.928-2.284c-1.817,3.519-5.096,6.124-8.762,6.957c-1.218,0.277-2.317,0.408-3.367,0.408c-4.329,0-8.762-1.866-11.591-4.89c-3.835-4.003-5.249-9.11-4.096-14.762c1.044-5.08,4.308-10.106,8.496-13.124c4.449-3.176,9.284-4.286,15.349-3.405c11.123,1.441,20.603,10.943,22.077,22.229c1.996,11.335-2.877,24.013-12.173,31.585c-4.585,3.867-10.193,6.494-16.236,7.604c-2.469,0.479-4.922,0.571-7.647,0.642l-104.506,2.752C10.264,203.524,5.134,203.9,0,204.275l0.19,5.434L106.617,209.839z'/></g></g></g><span>"+ windspeed +"mps</span></svg></div></div>";
            firstcont += "<div class='iconz'><img src = '" +weather_image + "' ></div>";
            firstcont += "<div class='mapz'><a href='#'  class='mapbtn' data-latLng='"+ lat+","+long +"' data-toggle='modal' data-target='#myModal'>View on Map</a></div>";
        }
    }
    
     
    /*Making Charts*/
  
    $('charts-div').style.display = "block";
    $('chartsection').innerHTML = "<div id='ftitle'>Variation in Climate - '" + city +"'</div>";
        
   /*Clear previous graph*/
    
    $("line-Chart").remove();$("bar-Chart").remove();$("pie-Chart").remove();
    
    $("line-cont").innerHTML = '<canvas id="line-Chart" class="chcanvas material" ></canvas>';
    $("bar-cont").innerHTML = ' <canvas id="bar-Chart" class="chcanvas2 material mtop" ></canvas>';
    $("pie-cont").innerHTML = ' <canvas id="pie-Chart" class="chcanvas2 material mtop" ></canvas>';
    
	/* LINE GRAPH*/ 
    
    var ctx = $('line-Chart').getContext('2d');
	linechart  = new Chart(ctx, {
	type: 'line',
	data: {
    labels: time_array,
    datasets: [{ 
        data: temp_array,
        label: "Tempearture(°C)",
        borderColor: "#3e95cd",
        fill: true
      }, { 
        data: wind_array,
        label: "WindSpeed(mps)",
        borderColor: "#8e5ea2",
        fill: false
      }, { 
        data: humi_array,
        label: "Humidity",
        borderColor: "#3cba9f",
        fill: false,
            hidden: true
      },{ 
        data: pres_array,
        label: "Pressure(hPa)",
        borderColor: "#c45850",
        fill: false,
            hidden: true
      }
    ]
	},
	options: {
      responsive: false, 
		maintainAspectRatio: false,
		title: {
		display: true,
		text: 'Weather over a day '
		}
	}
	});
   
   
    /* BAR GRAPH*/  
    
    var ctx = $('bar-Chart').getContext('2d');
    barchart = new Chart(ctx, {
    type: 'bar',
	
    // The data for our dataset
    data: {
        labels: time_array,
        datasets: [{
            label: "Precipitation",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: prcp_array,
        }]
    },

    // Configuration options go here
    options: {responsive: false, 
	maintainAspectRatio: false}
	});
    
	
   var a = [], b = [], prev;

    //traverse climate_array to get unique climate conditions i.e. a[]
	//And no. of occurances of conditions i.e. b[]
	for ( var i = 0; i < climate_array.length; i++ ) {
        climate_array.sort();
        if ( climate_array[i] !== prev ) {
            a.push(climate_array[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = climate_array[i];
    }
    
   
    for(var k=0;k<b.length;k++){
        b[k] = Math.round(((b[k] / 12) * 100) * 100)/100;
    }
    
    
    /* PIE CHART*/
    
    var ctx = $('pie-Chart').getContext('2d');
    myPieChart = new Chart(ctx,{
    type: 'doughnut',
    data :{
    datasets: [{
        data: b,
        label : "Climate over a day",
        backgroundColor : ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"]
    }],    
    labels: a
	},
    options: {
		responsive: false, 
		maintainAspectRatio: false}
	});
    
    /*Filling Contents*/
    content += "</div>";
    content += "<a class='carousel-control-prev' href='#demo' data-slide='prev'>";
    content +="<span class='carousel-control-prev-icon sp'></span></a>";
	content += "<a class='carousel-control-next' href='#demo' data-slide='next'>";
    content +="<span class='carousel-control-next-icon sp'></span></a>";
   
   //finally, giving all the element to div in HTML
    $('first').innerHTML = firstcont;    
    $('demo').innerHTML = content; 
    
    
    //active carousel and moving slides
      $('l1').onclick = function(){
          
         $('l1').classList.add("active");
         $('l2').classList.remove("active");
         $('l3').classList.remove("active");
         $('l4').classList.remove("active");
    };
    
    $('l2').onclick = function(){
          
         $('l2').classList.add("active");
         $('l1').classList.remove("active");
         $('l3').classList.remove("active");
         $('l4').classList.remove("active");
    };
    
    $('l3').onclick = function(){
          
         $('l3').classList.add("active");
         $('l2').classList.remove("active");
         $('l1').classList.remove("active");
         $('l4').classList.remove("active");
    };
    
    $('l4').onclick = function(){
          
         $('l4').classList.add("active");
         $('l2').classList.remove("active");
         $('l3').classList.remove("active");
         $('l1').classList.remove("active");
    };

}




//Searchbox
 
window.onload = function () {
    
    /*Chart Variables*/
   
    //assign btn_click() function to search button 
    $("btn_search").onclick = btn_click;    
    $("city_name").focus();
    
    
    //getting the select element with id - 'city-dropdown'
	//and saving it in variable 'dropdown'
    let dropdown = $("city-dropdown");

	//clearing the select & removing all options
    dropdown.length = 0;

	//creating first option as defaultOption element for select
    let defaultOption = document.createElement('option');
    defaultOption.text = 'Select your City';
    defaultOption.value = '3313472';
    
	//adding defaultOption to dropdown or select box
    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;

	//location of file where all cities are stored
    const url = 'js/city_list.json';
	
	//making AJAX request to this json file 
    const request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
        if (request.status === 200) {
		//parsing the JSON data from response 
        const data = JSON.parse(request.responseText);
        let option;
    
		//populate the select box with options from the file
		//create option elements for each city 
        for (let i = 0; i < data.length; i++) {
            option = document.createElement('option');
			//assign attributes for option 
			//city name as option text & city ID as option value 
            option.text = data[i].name;
            option.value = data[i].id;
			//adding option to dropdown
            dropdown.add(option);
        }
        } else {
        // Reached the server, but it returned an error
        }   
    }

    request.onerror = function() {
    console.error('An error occurred fetching the JSON from ' + url);
    };
	//send AJAX request
    request.send();
   
    
};
 
//If we enter something on textbox, change will be reflected on select box  
function searchSel() {
  var input=$('city_text').value.toUpperCase();
  var output=$('city-dropdown').options;
     
  for(var i=0;i<output.length;i++) {
     
	 //if user entry matches a city in selectbox
    if(output[i].text.toUpperCase().indexOf(input)==0){
      
      output[i].selected=true;
    }
	//if user entry doesn't match or if user doesnt enter anything
	//then by default select first option i.e. one with Athlone ID
    if($('city_text').value==''){
      output[0].selected=true;
    }
  }
}	


