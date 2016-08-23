
  angular.module('dynamicRouting').config([
    '$BaseAppsStateProvider',
    function(BaseAppsStateProvider) {
      BaseAppsStateProvider.registerDynamicRoutes([{"name":"voting","url":"/voting","title":"Voting","controller":"VotingController","animationIn":"slideInRight","animationOut":"slideOutLeft","path":"voting/voting.html"},{"name":"team","url":"/team/:id","title":"Team","controller":"TeamController","animationIn":"slideInRight","animationOut":"slideOutLeft","path":"teams/team.html"},{"name":"champions","url":"/champions","title":"Champions","animationIn":"slideInRight","animationOut":"slideOutLeft","path":"champions/champions.html"},{"name":"autodrafter","url":"/autodrafter?:count","title":"Auto Drafter","controller":"AutodrafterController","animationIn":"slideInRight","animationOut":"slideOutLeft","path":"autodrafter/autodrafter.html"},{"name":"account","url":"/account?:login&:logout","title":"Account","controller":"AccountController","animationIn":"slideInRight","animationOut":"slideOutLeft","path":"account/account.html"},{"name":"home","url":"/","title":"Home","controller":"HomeController","animationIn":"slideInRight","animationOut":"slideOutLeft","path":"home.html"}]);
    }
  ]);
  