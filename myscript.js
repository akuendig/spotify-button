(function ($, window, undefined) {
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  function trimPlus (text) {
    if (text === null || text === undefined || text.length === 0) {
      return "";
    }

    text = text.trim();

    var i = 0;

    while (i < text.length && text[i] === "+") {
      i += 1;
    }

    return text.substring(i);
  }

  function getTerm (link) {
    var first = link.substring(link.indexOf("http://itunes"))
    var keyVals = first.split("?")[1].split("&").map(function (keyVal) { return keyVal.split("="); });
    var term = keyVals.filter(function (keyVal) { return keyVal[0] === "term"; })[0]
    return term[1];
  }

  function addSpotify () {
    var original = $(".itunes a").prop('href');
    var term = trimPlus(getTerm(original));
    term = term.replace(/[!@#$%^&*()_+\[\]]/g, " ");
    term = encodeURIComponent(term);

    $(".itunes a").parent().parent().append('<a target="_blank" href="http://open.spotify.com/search/' + term + '"><div class="spotify"></div></a>');

    console.debug('Added spotify button');
  }

  addSpotify();

  // define a new observer
  var obs = new MutationObserver(function(mutations, observer) {
      mutations.forEach(function(mutation) {
        console.debug(mutation.target + ' has changed: ' + mutation);

        if (mutation.type === 'childList' && $('a div.spotify').size() === 0) {
          addSpotify();
        }
      });
  });

  // have the observer observe foo for changes in children
  obs.observe($('.titre-antenne .ontheair').get(0), {
    childList: true,
    subtree: true
  });

  console.debug('Spotify button intialized')
}) (jQuery, window)