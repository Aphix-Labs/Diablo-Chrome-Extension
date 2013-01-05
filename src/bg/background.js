// NOTE: This code is very similar to the browser_action.js, and contains duplicate code

// LocalStorage initialization
var interval = 0;

if (!localStorage["initiated"]) {
  localStorage['frequency'] = 1;  // The display frequency, in minutes.
  localStorage['notificaciones'] = 1;
  localStorage['showing'] = 5000;
  localStorage["serverDiablo"] = 'Americas';
  localStorage["initiated"] = true;
  localStorage['url'] = 'us.battle.net/d3/en/status';
}

if (!localStorage['url']) {
  localStorage['url'] = 'us.battle.net/d3/en/status';
}

// Get the default server of the user
var server = localStorage["serverDiablo"];

getStatus();

// Background process
setInterval(function() {
  interval++;

  if (localStorage['frequency'] <= interval) {
    getStatus();
    interval=0;
  }

  }, 60000);


/**
 * Change the Icon of the extension to the up icon
 * Improve! : The same code exist in browser_action.js
 * @return void
 */
function changeUp() {
  $('#status').text("Status: Up");
  chrome.browserAction.setIcon({path:"../../img/up.png"});
}

/**
 * Change the Icon of the extension to the down icon
 * Improve! : The same code exist in browser_action.js
 * @return void
 */
function changeDown() {
  $('#status').text("Status: Down");
  chrome.browserAction.setIcon({path:"../../img/down.png"});
}

/**
 * Core function that Fetch and Scrape the info, in order to generate and
 * create the DOM elements for the browser_action page, that showing the details
 * of the status of the server.
 * Is almost the same to getStatus function in the browser_action. Only change
 * that this function handle when the server status change.
 * @return void
 */
function getStatus() {
  var change = 0;
  if (localStorage["serverDiablo"] != server) {
    change = 1;
  }

  server = localStorage["serverDiablo"];
  var statusServer = localStorage["statusServer"];

  // The value of the html class of each server in the BattleNet page
  var column;

  if (server === 'Americas') {
    column = 'column-1';
  }
  if (server === 'Europe') {
    column = 'column-2';
  }
  if (server === 'Asia') {
    column = 'column-3';
  }


  if (server !== undefined) {
    datas = "server="+ server;
    $.ajax({
      url : 'http://eu.battle.net/d3/en/status',
      data : datas,
      success: function(data) {

        var a = $(data).find('.'+column + ' .server:first > div:first' ).attr('class');
        var response = a.split(" ")[1];

        // Check if the previous info about the server was update or not, in order
        // to show the notification and change the icon of the extension
        if(response != statusServer && localStorage['notificaciones'] == 1 && change == 0) {
          show(response);
        }

        // Update localstorage
        localStorage["statusServer"] = response;

        // Depending of the response, update the icon
        if (response=='down') {
          changeDown();
        }

        if (response=='up') {
          changeUp();
        }
      }
    });
  }
}


/**
 * Show the notification when the status change or the first time by T second, where T is defined in the options and is save in the 'showing' key in the localstorage.
 * To Improve! : The same code exist in browser_action.js
 * @param  {String} status Contain the status, wich values are "up" or "down"
 * @return void
 */
function show(status) {
  var server = localStorage["serverDiablo"];
  if (server !== undefined) {
    if (server == 'column-1') {
      server = 'Americas';
    }
    if (server == 'column-2') {
      server = 'Europe';
    }
    if (server == 'column-3') {
      server = 'Asia';
    }

    var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
    var hour = time[1] % 12 || 12;               // The prettyprinted hour.
    var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
    var notification = window.webkitNotifications.createNotification(
      '../../icons/icondiablo3.png',               // The image.
      hour + time[2] + ' ' + period,               // The title.
      'The server ' + server + ' is ' + status     // The body.
      );

    notification.show();

    if (localStorage['showing'] != 'Always') {
      setTimeout( function() {
        notification.cancel();
      }, localStorage['showing']);
    }
  }
}