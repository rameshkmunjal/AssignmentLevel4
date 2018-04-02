 angular.module('eplApp').config(function($routeProvider){
	$routeProvider
		.when('/',{   //routeParams         
        	templateUrl		: 'views/home.html',   //page to display     	 
            controller 		: 'homeController',     //controller       
        	controllerAs 	: 'home'               //alias of controller
        })
		.when('/:type/leagueDetails',{ //routeParams
			templateUrl : 'views/leagueMatches.html',//page to display
			controller  :'engPreLea',
			controllerAs:'EPL'			
		})
		.when('/:type/matchDetails/:date/:team1Code/:team2Code',{//routeParams
			templateUrl : 'views/singleMatch.html',//page to display
			controller  :'singleMatch',
			controllerAs:'single'			
		})
		.when('/:session/teamDetails/:teamCode',{ //routeParams
			templateUrl : 'views/teamDetails.html',//page to display
			controller  : 'singleTeam',
			controllerAs: 'singleT'
		})
		.when('/:type/league/Summary', { //routeParams
            templateUrl: 'views/seasonSummary.html',//page to display
            controller: 'seasonSummary',
            controllerAs: 'seasonS'
        })
		.otherwise({
            template   : '<h1>404 page not found</h1>' //if routeParams do not match any of above
        });	 
 });
 
 