var mixpanelId = "d4ded1736e08606ad8767e9caa35c45b";
var analyticsId = "UA-82336125-1";
var heapId = "1979608557";

if(window.location.hostname == "dashboard.famepick.com") {
  // Prod
  console.log = function () {}
} else {
  // Dev
  console.log("Using development tracker");
  mixpanelId = "d4ded1736e08606ad8767e9caa35c45b";
  analyticsId = "UA-82336125-2";
}


<!-- start Mixpanel -->
(function (e, a) {
  if(!a.__SV) {
    var b = window;
    try {
      var c, l, i, j = b.location,
        g = j.hash;
      c = function (a, b) {
        return(l = a.match(RegExp(b + "=([^&]*)"))) ? l[1] : null
      };
      g && c(g, "state") && (i = JSON.parse(decodeURIComponent(c(g, "state"))),
        "mpeditor" === i.action && (b.sessionStorage.setItem("_mpcehash", g),
          history.replaceState(i.desiredHash || "", e.title, j.pathname + j
            .search)))
    } catch(m) {}
    var k, h;
    window.mixpanel = a;
    a._i = [];
    a.init = function (b, c, f) {
      function e(b, a) {
        var c = a.split(".");
        2 == c.length && (b = b[c[0]], a = c[1]);
        b[a] = function () {
          b.push([a].concat(Array.prototype.slice.call(arguments,
            0)))
        }
      }
      var d = a;
      "undefined" !== typeof f ? d = a[f] = [] : f = "mixpanel";
      d.people = d.people || [];
      d.toString = function (b) {
        var a = "mixpanel";
        "mixpanel" !== f && (a += "." + f);
        b || (a += " (stub)");
        return a
      };
      d.people.toString = function () {
        return d.toString(1) + ".people (stub)"
      };
      k =
        "disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user"
        .split(" ");
      for(h = 0; h < k.length; h++) e(d, k[h]);
      a._i.push([b, c, f])
    };
    a.__SV = 1.2;
    b = e.createElement("script");
    b.type = "text/javascript";
    b.async = !0;
    b.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ?
      MIXPANEL_CUSTOM_LIB_URL : "file:" === e.location.protocol &&
      "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ?
      "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js" :
      "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
    c = e.getElementsByTagName("script")[0];
    c.parentNode.insertBefore(b, c)
  }
})(document, window.mixpanel || []);
mixpanel.init(mixpanelId);
<!-- end Mixpanel -->

(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function () {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date();
  a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js',
  'ga');

ga('create', analyticsId, 'auto');
ga('send', 'pageview');

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if(d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
    fjs.parentNode.insertBefore(js, fjs);
  }
  (document, 'script', 'facebook-jssdk'));

window.heap = window.heap || [], heap.load = function (e, t) {
  window.heap.appid = e, window.heap.config = t = t || {};
  var r = t.forceSSL || "https:" === document.location.protocol,
    a = document.createElement("script");
  a.type = "text/javascript", a.async = !0, a.src = (r ? "https:" : "http:") +
    "//cdn.heapanalytics.com/js/heap-" + e + ".js";
  var n = document.getElementsByTagName("script")[0];
  n.parentNode.insertBefore(a, n);
  for(var o = function (e) {
      return function () {
        heap.push([e].concat(Array.prototype.slice.call(arguments, 0)))
      }
    }, p = ["addEventProperties", "addUserProperties",
      "clearEventProperties", "identify", "removeEventProperty",
      "setEventProperties", "track", "unsetEventProperty"], c = 0; c < p.length; c++)
    heap[p[c]] = o(p[c])
};
heap.load(heapId);


var FP = FP || {};

FP.analytics = {
  track: function (eventName, identifier, options) {
    if(!eventName || eventName.length === 0) {
      console.error("event name is missing when invoke analytics.track.");
    } else {
      console.log("sending analytics event: " + eventName);
      mixpanel.track(eventName);
      heap.track(eventName, {
        "identifier": identifier
      });
      ga('send', 'event', options.category, options.action, options.label,
        options.value);

      if(identifier && identifier.length > 0) {
        heap.identify(identifier);
        mixpanel.identify(identifier);
      }
    }
  }

};
