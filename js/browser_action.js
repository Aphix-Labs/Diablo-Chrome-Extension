// Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-31775114-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

// LocalStorage initialization
if (! localStorage["initiated"] ) {
  localStorage['frequency'] = 1;  // The display frequency, in minutes.
  localStorage['notification'] = 1;
  localStorage['showing'] = 5000;
  localStorage["serverDiablo"] = 'Americas';
  localStorage["initiated"] = true;
}


jQuery(document).ready(function($) {
  // Get the default server of the user
  var server = localStorage["serverDiablo"];

  // If the server was set => the default server option is update
  if(server !== undefined){
    $(".servers").val(server);
  }

  // Get the status of the server selected
  getStatus();

  $('.servers').change(function() {
    getStatus();
  });

});


/**
 * Core function that Fetch and Scrape the info, in order to generate and
 * create the DOM elements for the browser_action page, that showing the details
 * of the status of the server
 * @return void
 */
function getStatus() {

  var server = $('.servers option:selected').val();
  localStorage["serverDiablo"] = server;
  var statusServer = localStorage["statusServer"];
  $.ajax( {
    url : 'http://'+localStorage['url'],
    success: function(data) {

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

      // Get the DOM elements which class is '.server-list' and
      // contains the status of the server (first div), and the details of
      // the server(second div)
      var dataServer = $(data).find('.' + column + ' .server-list');

      var statusHTML = "";

      // Create the DOM elements that show the info of the server
      $.each(dataServer, function(index, value) {

        // The DOM elements that show the status and the action house text
        if (index === 0) {
          statusHTML += value.innerHTML;
          statusHTML += "<h4 class='subcategory'>"+ $(data).find('.column-3 h4').text() +"</h4>";

        } else{
          // Create the details of the server, where depending if the 'i' var is
          // even or odd, allow to create an stripped style adding an 'alt' class
          var i = 2;

          $.each( $(value).children(), function(i,v){
            if ( !$(v).hasClass('empty') ) {

              if (i % 2 === 0) {
                statusHTML += "<div class='server'>";
              } else {
                statusHTML += "<div class='server alt'>";
              }
              statusHTML += $(v).attr("class","server").html() +"</div>";
            }
            i++;
          });
       }

     } );

      // Put the HTML elements in the browser_action page
      $('#details-server').html( statusHTML);

      // Check if the previous info about the server was update or not, in order
      // to show the notification and change the icon of the extension
      var a = $(data).find('.'+column + ' .server:first > div:first' ).attr('class');
      var response = a.split(" ")[1];

      if(response != statusServer && localStorage['notification'] == 1 ){
        show(response);
      }

      localStorage["statusServer"] = response;

      if (response=='down') {
        changeDown();
      }
      if (response=='up') {
        changeUp();
      }
    }
  });
}

/**
 * Change the Icon of the extension to the up icon
 * Warning! : The same code exist in background.js
 * @return void
 */
function changeUp() {
  $('#status').text("Status: Up");
  chrome.browserAction.setIcon({path:"../../img/up.png"});
}

/**
 * Change the Icon of the extension to the down icon
 * Warning! : The same code exist in background.js
 * @return void
 */
function changeDown() {
  $('#status').text("Status: Down");
  chrome.browserAction.setIcon({path:"../../img/down.png"});
}


/**
 * Show the notification when the status change or the first time by T second, where T is defined in the options and is save in the 'showing' key in the localstorage.
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