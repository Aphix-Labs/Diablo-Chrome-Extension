
window.addEventListener('load', function() {
  // Initialize the option controls.
  if (localStorage['notification']===0) {
    options.isActivated.checked = 0;
  } else {
    options.isActivated.checked = 1;
  }

  // The display activation.
  options.frequency.value = localStorage['frequency'];

  // The display frequency, in minutes.

  if (localStorage['showing'] == 5000) {
    options.showing.value = '5 seg';
  }
  if (localStorage['showing'] == 10000) {
    options.showing.value  = '10 seg';
  }
  if (localStorage['showing'] == 30000) {
    options.showing.value  = '30 seg';
  }
  if (localStorage['showing'] == 60000) {
    options.showing.value  = '1 min';
  }
  if (localStorage['showing'] == 300000) {
    options.showing.value  = '5 min';
  }
  if (localStorage['showing'] == 'Always') {
    options.showing.value  = 'Always';
  }


  var url = localStorage['url'];
  options.languageUser.value = url;
  if (url.indexOf('en') != -1) {
    options.languageUser.value = 'battle.net/d3/en/status';
  }

  if (url.indexOf('es') != -1) {
    options.languageUser.value = 'battle.net/d3/es/status';
  }

  if (url.indexOf('pt') != -1) {
    options.languageUser.value = 'battle.net/d3/pt/status';
  }

  // Set the display activation and frequency.
  options.isActivated.onchange = function() {
    if (options.isActivated.checked) {
      localStorage['notification'] = 1;
    } else {
      localStorage['notification'] = 0;
    }
  };

  options.frequency.onchange = function() {
    localStorage['frequency'] = options.frequency.value;
  };

  options.showing.onchange = function() {
    if (options.showing.value == '5 seg') {
      localStorage['showing'] = 5000;
    }
    if (options.showing.value == '10 seg') {
      localStorage['showing'] = 10000;
    }
    if (options.showing.value == '30 seg') {
      localStorage['showing'] = 30000;
    }
    if (options.showing.value == '1 min') {
      localStorage['showing'] = 60000;
    }
    if (options.showing.value == '5 min') {
      localStorage['showing'] = 300000;
    }
    if (options.showing.value == 'Always') {
      localStorage['showing'] = 'Always';
    }
  };


  options.languageUser.onchange = function() {
    var url = options.languageUser.value;
    var server = localStorage["serverDiablo"];
    if (url.indexOf('en') != -1 || url.indexOf('es') != -1 || url.indexOf('pt') != -1 ) {
      if (server == 'Americas') {
        url = 'us.'+url;
      }
      if (server == 'Europe') {
        url = 'eu.'+url;
      }
      if (server == 'Asia') {
        url = 'us.'+url;
      }
    }
    localStorage['url'] = url;
  };

});