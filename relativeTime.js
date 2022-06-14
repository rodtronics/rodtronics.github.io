!(function (r, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : ((r =
        "undefined" != typeof globalThis
          ? globalThis
          : r || self).dayjs_plugin_relativeTime = e());
})(this, function () {
  "use strict";
  return function (r, e, t) {
    r = r || {};
    var n = e.prototype,
      o = {
        future: "in %s",
        past: "%s ago",
        s: "a few seconds",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years",
      };
    function i(r, e, t, o) {
      return n.fromToBase(r, e, t, o);
    }
    (t.en.relativeTime = o),
      (n.fromToBase = function (e, n, i, d, u) {
        for (
          var f,
            a,
            s,
            l = i.$locale().relativeTime || o,
            h = r.thresholds || [
              { l: "s", r: 44, d: "second" },
              { l: "m", r: 89 },
              { l: "mm", r: 44, d: "minute" },
              { l: "h", r: 89 },
              { l: "hh", r: 21, d: "hour" },
              { l: "d", r: 35 },
              { l: "dd", r: 25, d: "day" },
              { l: "M", r: 45 },
              { l: "MM", r: 10, d: "month" },
              { l: "y", r: 17 },
              { l: "yy", d: "year" },
            ],
            m = h.length,
            c = 0;
          c < m;
          c += 1
        ) {
          var y = h[c];
          y.d && (f = d ? t(e).diff(i, y.d, !0) : i.diff(e, y.d, !0));
          var p = (r.rounding || Math.round)(Math.abs(f));
          if (((s = f > 0), p <= y.r || !y.r)) {
            p <= 1 && c > 0 && (y = h[c - 1]);
            var v = l[y.l];
            u && (p = u("" + p)),
              (a = "string" == typeof v ? v.replace("%d", p) : v(p, n, y.l, s));
            break;
          }
        }
        if (n) return a;
        var M = s ? l.future : l.past;
        return "function" == typeof M ? M(a) : M.replace("%s", a);
      }),
      (n.to = function (r, e) {
        return i(r, e, this, !0);
      }),
      (n.from = function (r, e) {
        return i(r, e, this);
      });
    var d = function (r) {
      return r.$u ? t.utc() : t();
    };
    (n.toNow = function (r) {
      return this.to(d(this), r);
    }),
      (n.fromNow = function (r) {
        return this.from(d(this), r);
      });
  };
});
