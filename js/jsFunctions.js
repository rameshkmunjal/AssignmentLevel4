$(document).ready(function(){ //as the HTML document  gets ready

var count = 0; //var to count images
function slideImages(){
				if(count < 9){	//first and last images excluded since visible by default				
					$("#slideshow").animate({left:"-=605px"},6000); //moves left 9 times 0-8
					count++;
				} else { 
					$("#slideshow").animate({left:"+=5445px"},4000); //image width X 9 , moves entire list of images rightwards
					count= 0;
				}
				slideImages();
			}//end of function slideImages
			
			setTimeout(slideImages, 500); //function called in every half second

//teams played in season 2015-16 -array
var teamName1516 = [ "LEI","ARS","TOT","MUN","MCI","SOU","WHU","LIV","STK","CHE","EVE","SWA","WAT","WBA","BOU","CRY","SUN","NEW","NOR","AVL" ];
//teams played in season 2016-17 - array
var teamName1617 = [ "BOU","CHE","TOT","MCI","LIV","ARS","MUN","EVE","SOU","WBA","WHU","LEI","STK","SWA","CRY","BUR","WAT","HUL","MFC","SUN" ];
//seasons array
var season = ['epl_16_17', 'epl_15_16'];	

//grab by id 
var div = document.getElementById("team-list");


for (var j=0; j < season.length; j++) // loop to create list heading  and calling createList function
{	
	var ul = document.createElement("ul");
	if(season[j] == "epl_16_17"){
			var h = document.createElement("h3");
			h.innerHTML="Team-List : 2016-17";			
			div.appendChild(h);
			createList(season[j], ul,teamName1617);
	} else if(season[j] == "epl_15_16") {
			var h = document.createElement("h3");
			h.innerHTML="Team-List : 2015-16";
			div.appendChild(h);
			createList(season[j], ul, teamName1516);
	}	
}
//function to create list of teams dynamically
function createList(something , ul, arr){
	for(var i=0; i < arr.length; i++)
			{	
				var listItem = document.createElement("li");				
				
				var link = document.createElement("a");
				link.href= "#!"+something+"/teamDetails/"+arr[i];
				if( i == arr.length-1){
					var linkName = document.createTextNode( arr[i] );
				} else {
					var linkName = document.createTextNode( arr[i] + " | ");
				}
				
				link.appendChild(linkName);
				listItem.appendChild(link);	
				ul.appendChild(listItem);			
			}
		div.appendChild(ul);
}
//nav-menu list headings
var menuArr = ["leagueDetails", "league/Summary"];
//nav-menu list items
var menuArr2 = ["League Matches", "League Summary" ]
//grab nav-menu div by id
var div2 = document.getElementById("nav-menu");


for(var j=0; j < season.length; j++){ //loop to create heading and calling createMenu function
		var ul = document.createElement("ul");
		
		if(season[j] == "epl_16_17"){
			var h = document.createElement("li");
			h.innerHTML = "Season - 2016-17 : ";
			ul.appendChild(h);
			createMenu(season[j], ul);
		}else if(season[j] == "epl_15_16"){
			var h = document.createElement("li");
			h.innerHTML = "Season - 2015-16 :  ";
			ul.appendChild(h);
			createMenu(season[j], ul);
		}	
}//end of  for loop
//function to create nav-menu list items dynamically
function createMenu(something, ul){
		
		for(var i=0; i< menuArr.length; i++){
			var listItem = document.createElement("li");
			var link = document.createElement("a");
			
			link.href= "#!"+season[j]+"/"+menuArr[i];
			var linkName = document.createTextNode(menuArr2[i]);
			
			link.appendChild(linkName);
			listItem.appendChild(link);
			ul.appendChild(listItem);		
	}//end of outer for loop
	div2.appendChild(ul);
}
			
	
}); // end of window onload event function




		