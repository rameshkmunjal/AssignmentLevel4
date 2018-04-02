var app = angular.module('eplApp', ['ngRoute']);

//-------------------------------------------------Home page---------------------------------------------------------------
//----------------------------------This controller function written to prepare Home Page----------------------------------
//----Home page will have Highlights of the latest league 2016-17 to keep viewers informed about important details in one view--
app.controller('homeController',['$http',function($http) {
    //creating context
    var main = this;
    this.data = [];	
    this.url = 'https://raw.githubusercontent.com/openfootball/football.json/master';
    //some temporary variables values of which will be trfd to json array 
    var mp = 0; //matches played
    var gs = 0; //goals scored
    var gc = 0; //goals conceded
    var w = 0;  // total wins 
    var l = 0;  // total losses
    var d = 0;  // total draw
    var pt = 0; //points


    //declaring an array to store  json values of output
    this.jsonArr = { team : [] };	

    //-----this function is meant to create an array of objects of important data of matches played
    this.loadHighlights = function(extendedUrl){
        this.url = "https://raw.githubusercontent.com/openfootball/football.json/master";
        console.log(extendedUrl);
        if( extendedUrl == 'epl_16_17'){
            extendedUrl = '/2016-17/en.1.json';
            this.url = this.url + extendedUrl;				
            this.title = '2016-17'; //will be used to show year in Home page 
        }
        console.log("ok inside function loadHighlights");		
        var teamArray = [];
        var array_with_duplcates = []; //---all teams played in all matches


        $http({
            method:'GET',
            url : main.url			
        }).then( function successCallback(response){

            main.data = response.data.rounds;
            console.log("request successful");
            //making array of teams played in all matchdays since
            //every team is not presumed to play on each Matchday
            //array will have duplicate values
            for(var i in main.data){
                for(var j in main.data[i].matches){
                    var a = main.data[i].matches[j].team1.code;
                    array_with_duplcates.push(a);
                    var b = main.data[i].matches[j].team2.code;
                    array_with_duplcates.push(b);						
                }
            }
            //removing duplicate names using following function and making an array of unique team values
            teamArray = removeDuplicates(array_with_duplcates);				

            function removeDuplicates(arr){
                let unique_array = [];
                for(let i = 0;i < arr.length; i++){
                    if(unique_array.indexOf(arr[i]) == -1){
                        unique_array.push(arr[i])
                    }
                }
                return unique_array
            }

            console.log(teamArray); 
            //---loop through to sort data relating each team one by one , total it where reqd and store it in an array
            for(var a in teamArray){
                for(var b in main.data){
                    for(var c in main.data[b].matches){
                        if( teamArray[a] == main.data[b].matches[c].team1.code){
                            mp++;
                            gs = gs + main.data[b].matches[c].score1;
                            gc = gc + main.data[b].matches[c].score2;
                            if( main.data[b].matches[c].score1 > main.data[b].matches[c].score2  ){
                                w++;
                            } else if( main.data[b].matches[c].score1 <  main.data[b].matches[c].score2 ){
                                l++;
                            } else {
                                d++;
                            }
                        }		//end of if block						
                        else if(teamArray[a] == main.data[b].matches[c].team2.code){
                            mp++;
                            gs = gs +  main.data[b].matches[c].score2 ;
                            gc = gc + main.data[b].matches[c].score1;

                            if( main.data[b].matches[c].score2 > main.data[b].matches[c].score1  ){
                                w++;
                            } else if( main.data[b].matches[c].score2 <  main.data[b].matches[c].score1 ){
                                l++;
                            } else {
                                d++;
                            }									
                        } //end of else if block

                    }		//end of third loop			
                }//end of second loop
                pt = (w*3) + (d*1) + (l*0);
                //console.log(teamArray[a] +" - Matches Played : " + mp + " - Goals Scored : " +gs + " - Goals Conceded : " +gc + " Wins : "+w + " Loss : "+l + " Draw : "+ d + "  Points : "+ pt);
                main.jsonArr.team.push({
                    "teamName": teamArray[a],
                    "matches" : mp,
                    "Win"    : w,
                    "Drawn"  : d,
                    "Loss"   : l,
                    "goalsScored" : gs,
                    "goalsAgainst": gc,
                    "points":pt						
                });

                mp = 0; gs = 0; gc =0; w=0; l=0; d=0; pt = 0;					
            }	//end of first loop
            console.log(main.jsonArr.team);


        }, function errorCallback(response){
            console.log("HTTP Request failed. request data not received . ");			
        });
    };// end loadHighlights

}]); // end controller


//--------------------------------Page-2 : All matches in a Season ----------------------------------------
//----This controller function will prepare data of all matches played in a season-------------------------

app.controller('engPreLea', ['$http', '$routeParams', function($http, $routeParams){
    var main = this;
    this.data = [];
    this.url = 'https://raw.githubusercontent.com/openfootball/football.json/master';
    //-----------parameter sent by the link is tested and then full url is made
    if($routeParams.type == 'epl_15_16'){
        this.type = '/2015-16/en.1.json';
        this.url = this.url + this.type;
        this.type = 'epl_15_16';

    } else if($routeParams.type == 'epl_16_17'){
        this.type = '/2016-17/en.1.json';
        this.url = this.url + this.type;
        this.type = 'epl_16_17';
    }
    //-----this function is to get all relevant data for display in page leagueMatches.html
    this.showAllMatches = function(){
        $http({
            method:'GET',
            url : main.url				
        }).then(function successCallback(response){//--------when request is successful
            main.data = response.data.rounds;

            for(var i in response.data.rounds){
                for(var j in response.data.rounds[i].matches){
                    main.date = response.data.rounds[i].matches[j];
                    main.team1Code = response.data.rounds[i].matches[j].team1.code;
                    main.team2Code = response.data.rounds[i].matches[j].team2.code;								
                }						
            }				
        } , function errorCallback(response){	// ---if request fails		
            console.log("request data could not be obtained");				
        })			
    };		
}]); //----end of controller function---------

//------------------------------------- Single Match Results ---------------------------------------------
//---This controller function written to display a single match results--------------------------
app.controller('singleMatch', ['$http', '$routeParams', function($http, $routeParams){
    var main = this; //creating context
    this.data = []; //array will hold  response data 
    this.date = $routeParams.date; //recd as parameter
    this.t1Code = $routeParams.team1Code;//recd as parameter
    this.t2Code = $routeParams.team2Code;//recd as parameter

    this.url = 'https://raw.githubusercontent.com/openfootball/football.json/master';

    //variables to hold info recd in response
    this.matchDay; 
    this.t1;
    this.t2;
    this.s1;
    this.s2;
    this.winner;
    //--to make url complete -- season received as parameter
    if($routeParams.type == "epl_15_16"){
        this.type = '/2015-16/en.1.json';
    } else if($routeParams.type == "epl_16_17"){
        this.type = '/2016-17/en.1.json';
    } 
    //complete url
    this.url = this.url + this.type;
    //function written to get all details in http request and decide winner
    this.decideWinner = function(){
        console.log("inside decideWinner");
        $http({
            method:'GET',
            url : main.url				
        }).then(function successCallback(response){//when request is successful
            main.data = response.data.rounds;
            console.log("inside function successCallback");
            for( var i in main.data){ //loop through to get info inside matches array
                for(var j in main.data[i].matches){
                    if( main.data[i].matches[j].date ==  main.date &&
                        main.data[i].matches[j].team1.code  == main.t1Code  &&
                        main.data[i].matches[j].team2.code  == main.t2Code ){

                        console.log("inside inner if block");
                        main.s1 = main.data[i].matches[j].score1;
                        main.s2 = main.data[i].matches[j].score2;
                        main.matchDay = main.data[i].name;
                        //main.matchDay = main.datas[i].name;
                        main.t1 = main.data[i].matches[j].team1.name;
                        main.t2 = main.data[i].matches[j].team2.name;
                        console.log(main.t1);
                        console.log(main.t2);

                        //test - to decide winner
                        if( main.s1 > main.s2){
                            main.winner = main.t1 + "  Won";
                        } else if( main.s2 > main.s1){
                            main.winner = main.t2 + "  Won";
                            //console.log(main.winner);
                        } else {
                            main.winner = "Match Drawn";
                        }								
                    }	//end of if clause	
                }// end of 2nd for loop
            }	// end of 1st for loop

        } , function errorCallback(response){ // if request fails			
            console.log("request data could not be obtained");				
        })			
    };		
}]);//end of controller function
//--------------------------------------------------------------------------------------------------------------------------



//---------------------------------Single Team Performance in a Season -------------------------------------------------------
//----this controller function written to show matches played by a team against others -----------------------------------

app.controller('singleTeam',[ '$http', '$routeParams', function($http , $routeParams){
    var main = this;
    this.data = [];

    this.session = $routeParams.session;
    this.teamCode = $routeParams.teamCode;
    //-----------a json object containing array to store data relating single team
    this.jsonArr = { 
        teams:[]
    };


    this.url ='https://raw.githubusercontent.com/openfootball/football.json/master';		
    //----------test parameter got and complete the url
    if($routeParams.session == 'epl_15_16'){
        this.type = '/2015-16/en.1.json';
        this.url = this.url + this.type;
        this.type = 'epl_15_16';
        this.title = '2015-16';
    } else if($routeParams.session == 'epl_16_17'){
        this.type = '/2016-17/en.1.json';
        this.url = this.url + this.type;
        this.type = 'epl_16_17';
        this.title = '2016-17';
    }		
    console.log(this.url);

    //--function to prepare data relating single team and store as objects in an array of json object
    this.getSingleTeamMatchesDetails = function(){
        $http({
            method : 'GET',
            url    : main.url					
        }).then(function successCallback(response){//if request successful
            console.log("http request is successful");
            main.data = response.data.rounds;
            for( var i in main.data ){
                for(var j in main.data[i].matches ){
                    if(main.data[i].matches[j].team1.code == main.teamCode  || main.data[i].matches[j].team2.code == main.teamCode ){
                        main.jsonArr.teams.push
                        main.jsonArr.teams.push({
                            "team1Code" : main.data[i].matches[j].team1.code,
                            "team2Code" : main.data[i].matches[j].team2.code,
                            "team1Name" : main.data[i].matches[j].team1.name,
                            "team2Name" : main.data[i].matches[j].team2.name,
                            "team1Score" : main.data[i].matches[j].score1,
                            "team2Score" : main.data[i].matches[j].score2,
                            "match"     : main.data[i].name,
                            "date"      : main.data[i].matches[j].date													
                        });										
                    } 	//end of inner else				
                } //end of inner for loop
            }//end of outer for loop				
        }, function errorCallback(){ //if request fails
            console.log("http request is failed");					
        });	//end of http request	
    }; //end of function getSingleTeamMatchesDetails		
}]);//end of controller function 


//----------------------------------------Season Summary----------------------------------------------
//------------------this controller function writtent to prepare summary of the season---------------
app.controller('seasonSummary', ['$http', '$routeParams', function ($http, $routeParams){
    var main = this;//creating context
    this.data = [];	//creating array to hold response data
    this.url = 'https://raw.githubusercontent.com/openfootball/football.json/master';
    //some temporary variables
    var mp = 0; //matches played
    var gs = 0; //goals scored
    var gc = 0; //goals conceded
    var w = 0;  // total wins 
    var l = 0;  // total losses
    var d = 0;  // total draw
    var pt = 0; //points

    //declaring an array to store  json values of objects
    this.jsonArr = { team : [] };
    //to test parameter and get full url
    if( $routeParams.type == 'epl_15_16'){			
        this.type = '/2015-16/en.1.json';
        this.url = this.url + this.type;
        console.log(this.url);
        this.type='epl_15_16';
        this.title = '2015-16';
    } else if($routeParams.type == 'epl_16_17'){
        this.type = '/2016-17/en.1.json';
        this.url = this.url + this.type;
        console.log(this.url);
        this.type = 'epl_16_17';
        this.title = '2016-17';
    }
    //function to prepare summary 
    this.prepareSummary = function(){
        console.log("ok inside function prepareSummary");

        var teamArray = []; //will hold unique team values
        var array_with_duplcates = []; //will store  merged data of all teams played in all matches 
        //ofcourse duplicate values  to be weeded out later


        $http({
            method:'GET',
            url : main.url			
        }).then( function successCallback(response){
            main.data = response.data.rounds;
            console.log("request successful");
            //making array of teams played in all matchdays since
            //every team is not presumed to play on each Matchday
            //array will have duplicate values
            for(var i in main.data){
                for(var j in main.data[i].matches){
                    var a = main.data[i].matches[j].team1.code;
                    array_with_duplcates.push(a);
                    var b = main.data[i].matches[j].team2.code;
                    array_with_duplcates.push(b);						
                }
            }
            //removing duplicate names using following function
            teamArray = removeDuplicates(array_with_duplcates);				

            function removeDuplicates(arr){
                let unique_array = [];
                for(let i = 0;i < arr.length; i++){
                    if(unique_array.indexOf(arr[i]) == -1){
                        unique_array.push(arr[i])
                    }
                }
                return unique_array
            }

            console.log(teamArray); 
            for(var a in teamArray){ //each team data will be sorted in this loop
                for(var b in main.data){ 
                    for(var c in main.data[b].matches){
                        if( teamArray[a] == main.data[b].matches[c].team1.code){ //if matches with our unique value with team-1
                            mp++; //in each pass of loop add one match played
                            gs = gs + main.data[b].matches[c].score1; //add score in goals scored
                            gc = gc + main.data[b].matches[c].score2; //add score in goals against
                            if( main.data[b].matches[c].score1 > main.data[b].matches[c].score2  ){
                                w++; //add one  in win if goals scored is higher
                            } else if( main.data[b].matches[c].score1 <  main.data[b].matches[c].score2 ){
                                l++; //add one in loss if goals against is higher
                            } else {
                                d++; //otherwise add in draw
                            }
                        }		//end of if block	 - same logic as above					
                        else if(teamArray[a] == main.data[b].matches[c].team2.code){
                            mp++;
                            gs = gs +  main.data[b].matches[c].score2 ;
                            gc = gc + main.data[b].matches[c].score1;

                            if( main.data[b].matches[c].score2 > main.data[b].matches[c].score1  ){
                                w++;
                            } else if( main.data[b].matches[c].score2 <  main.data[b].matches[c].score1 ){
                                l++;
                            } else {
                                d++;
                            }									
                        } //end of else if block

                    }		//end of third loop			
                }//end of second loop
                pt = (w*3) + (d*1) + (l*0); // 3 points for each win , 0 for loss and 1 for draw.
                //console.log(teamArray[a] +" - Matches Played : " + mp + " - Goals Scored : " +gs + " - Goals Conceded : " +gc + " Wins : "+w + " Loss : "+l + " Draw : "+ d + "  Points : "+ pt);
                main.jsonArr.team.push({
                    "teamName": teamArray[a],
                    "matches" : mp,
                    "Win"    : w,
                    "Loss"   : l,
                    "goalsScored" : gs,
                    "goalsAgainst": gc,
                    "points":pt						
                });

                mp = 0; gs = 0; gc =0; w=0; l=0; d=0; pt = 0;	// again set values of temp variables as zero for next pass of loop				
            }	//end of first loop
            console.log(main.jsonArr.team);
        }, function errorCallback(response){  //if request fails
            console.log("HTTP Request failed. request data not received . ");			
        });//end of http request
    };//end of function

}]);//end of controller function 
