/*

 Quicksand 1.4

 Reorder and filter items with a nice shuffling animation.

 Copyright (c) 2010 Jacek Galanciak (razorjack.net) and agilope.com
 Big thanks for Piotr Petrus (riddle.pl) for deep code review and wonderful docs & demos.

 Dual licensed under the MIT and GPL version 2 licenses.
 http://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt
 http://github.com/jquery/jquery/blob/master/GPL-LICENSE.txt

 Project site: http://razorjack.net/quicksand
 Github site: http://github.com/razorjack/quicksand

 */

(function(e) {
    var t = function(e) {
        var t = e.clone();
        var n = e.find("canvas");
        if (n.length) {
            var r = t.find("canvas");
            r.each(function(e) {
                var t = this.getContext("2d");
                t.drawImage(n.get(e), 0, 0)
            })
        }
        return t
    };
    e.fn.quicksand = function(n, r) {
        var i = {
                duration: 750,
                easing: "swing",
                attribute: "data-id",
                adjustHeight: "auto",
                adjustWidth: "auto",
                useScaling: false,
                enhancement: function(e) {},
                selector: "> *",
                atomic: false,
                dx: 0,
                dy: 0,
                maxWidth: 0,
                retainExisting: true
            },
            s = function() {
                var e = "transform WebkitTransform MozTransform OTransform msTransform".split(" "),
                    t = document.createElement("div");
                for (var n = 0; n < e.length; n++) {
                    if (typeof t.style[e[n]] != "undefined") {
                        return true
                    }
                }
                return false
            }();
        e.extend(i, r);
        if (!s || typeof e.fn.scale == "undefined") {
            i.useScaling = false
        }
        var o;
        if (typeof arguments[1] == "function") {
            o = arguments[1]
        } else if (typeof(arguments[2] == "function")) {
            o = arguments[2]
        }
        return this.each(function(r) {
            var s;
            var u = [];
            var a;
            if (typeof i.attribute == "function") {
                a = e(n)
            } else {
                a = t(e(n).filter("[" + i.attribute + "]"))
            }
            var f = e(this);
            var l = e(this).css("height");
            var c = e(this).css("width");
            var h, p;
            var d = false;
            var v = false;
            var m = e(f).offset();
            var g = [];
            var y = e(this).find(i.selector);
            var b = e(y).innerWidth();
            if (navigator.userAgent.match(/msie [6]/i)) {
                f.html("").append(a);
                return
            }
            var w = 0;
            var E = function() {
                e(this).css("margin", "").css("position", "").css("top", "").css("left", "").css("opacity", "");
                if (!w) {
                    w = 1;
                    if (!i.atomic) {
                        var t = f.find(i.selector);
                        if (!i.retainExisting) {
                            f.prepend(C.find(i.selector));
                            t.remove()
                        } else {
                            var n = e([]);
                            C.find(i.selector).each(function(r) {
                                var s = e([]);
                                if (typeof i.attribute == "function") {
                                    var o = i.attribute(e(this));
                                    t.each(function() {
                                        if (i.attribute(this) == o) {
                                            s = e(this);
                                            return false
                                        }
                                    })
                                } else {
                                    s = t.filter("[" + i.attribute + '="' + e(this).attr(i.attribute) + '"]')
                                }
                                if (s.length > 0) {
                                    n = n.add(s);
                                    if (r === 0) {
                                        f.prepend(s)
                                    } else {
                                        s.insertAfter(f.find(i.selector).get(r - 1))
                                    }
                                }
                            });
                            t.not(n).remove()
                        }
                        if (d) {
                            f.css("height", h)
                        }
                        if (v) {
                            f.css("width", c)
                        }
                    }
                    i.enhancement(f);
                    if (typeof o == "function") {
                        o.call(this)
                    }
                }
                if (false === i.adjustHeight) {
                    f.css("height", "auto")
                }
                if (false === i.adjustWidth) {
                    f.css("width", "auto")
                }
            };
            var S = f.offsetParent();
            var x = S.offset();
            if (S.css("position") == "relative") {
                if (S.get(0).nodeName.toLowerCase() != "body") {
                    x.top += parseFloat(S.css("border-top-width")) || 0;
                    x.left += parseFloat(S.css("border-left-width")) || 0
                }
            } else {
                x.top -= parseFloat(S.css("border-top-width")) || 0;
                x.left -= parseFloat(S.css("border-left-width")) || 0;
                x.top -= parseFloat(S.css("margin-top")) || 0;
                x.left -= parseFloat(S.css("margin-left")) || 0
            }
            if (isNaN(x.left)) {
                x.left = 0
            }
            if (isNaN(x.top)) {
                x.top = 0
            }
            x.left -= i.dx;
            x.top -= i.dy;
            f.css("height", e(this).height());
            f.css("width", e(this).width());
            y.each(function(t) {
                g[t] = e(this).offset()
            });
            e(this).stop();
            var T = 0;
            var N = 0;
            y.each(function(t) {
                e(this).stop();
                var n = e(this).get(0);
                if (n.style.position == "absolute") {
                    T = -i.dx;
                    N = -i.dy
                } else {
                    T = i.dx;
                    N = i.dy
                }
                n.style.position = "absolute";
                n.style.margin = "0";
                if (!i.adjustWidth) {
                    n.style.width = b + "px"
                }
                n.style.top = g[t].top - parseFloat(n.style.marginTop) - x.top + N + "px";
                n.style.left = g[t].left - parseFloat(n.style.marginLeft) - x.left + T + "px";
                if (i.maxWidth > 0 && g[t].left > i.maxWidth) {
                    n.style.display = "none"
                }
            });
            var C = t(e(f));
            var k = C.get(0);
            k.innerHTML = "";
            k.setAttribute("id", "");
            k.style.height = "auto";
            k.style.width = f.width() + "px";
            C.append(a);
            C.insertBefore(f);
            C.css("opacity", 0);
            k.style.zIndex = -1;
            k.style.margin = "0";
            k.style.position = "absolute";
            k.style.top = m.top - x.top + "px";
            k.style.left = m.left - x.left + "px";
            if (i.adjustHeight === "dynamic") {
                f.animate({
                    height: C.height()
                }, i.duration, i.easing)
            } else if (i.adjustHeight === "auto") {
                h = C.height();
                if (parseFloat(l) < parseFloat(h)) {
                    f.css("height", h)
                } else {
                    d = true
                }
            }
            if (i.adjustWidth === "dynamic") {
                f.animate({
                    width: C.width()
                }, i.duration, i.easing)
            } else if (i.adjustWidth === "auto") {
                p = C.width();
                if (parseFloat(c) < parseFloat(p)) {
                    f.css("width", p)
                } else {
                    v = true
                }
            }
            y.each(function(t) {
                var n = [];
                if (typeof i.attribute == "function") {
                    s = i.attribute(e(this));
                    a.each(function() {
                        if (i.attribute(this) == s) {
                            n = e(this);
                            return false
                        }
                    })
                } else {
                    n = a.filter("[" + i.attribute + '="' + e(this).attr(i.attribute) + '"]')
                }
                if (n.length) {
                    if (!i.useScaling) {
                        u.push({
                            element: e(this),
                            dest: n,
                            style: {
                                top: e(this).offset().top,
                                left: e(this).offset().left,
                                opacity: ""
                            },
                            animation: {
                                top: n.offset().top - x.top,
                                left: n.offset().left - x.left,
                                opacity: 1
                            }
                        })
                    } else {
                        u.push({
                            element: e(this),
                            dest: n,
                            style: {
                                top: e(this).offset().top,
                                left: e(this).offset().left,
                                opacity: ""
                            },
                            animation: {
                                top: n.offset().top - x.top,
                                left: n.offset().left - x.left,
                                opacity: 1,
                                scale: "1.0"
                            }
                        })
                    }
                } else {
                    if (!i.useScaling) {
                        u.push({
                            element: e(this),
                            style: {
                                top: e(this).offset().top,
                                left: e(this).offset().left,
                                opacity: ""
                            },
                            animation: {
                                opacity: "0.0"
                            }
                        })
                    } else {
                        u.push({
                            element: e(this),
                            animation: {
                                opacity: "0.0",
                                style: {
                                    top: e(this).offset().top,
                                    left: e(this).offset().left,
                                    opacity: ""
                                },
                                scale: "0.0"
                            }
                        })
                    }
                }
            });
            a.each(function(n) {
                var r = [];
                var o = [];
                if (typeof i.attribute == "function") {
                    s = i.attribute(e(this));
                    y.each(function() {
                        if (i.attribute(this) == s) {
                            r = e(this);
                            return false
                        }
                    });
                    a.each(function() {
                        if (i.attribute(this) == s) {
                            o = e(this);
                            return false
                        }
                    })
                } else {
                    r = y.filter("[" + i.attribute + '="' + e(this).attr(i.attribute) + '"]');
                    o = a.filter("[" + i.attribute + '="' + e(this).attr(i.attribute) + '"]')
                }
                var l;
                if (r.length === 0 && o.length > 0) {
                    if (!i.useScaling) {
                        l = {
                            opacity: "1.0"
                        }
                    } else {
                        l = {
                            opacity: "1.0",
                            scale: "1.0"
                        }
                    }
                    var c = t(o);
                    var h = c.get(0);
                    h.style.position = "absolute";
                    h.style.margin = "0";
                    if (!i.adjustWidth) {
                        h.style.width = b + "px"
                    }
                    h.style.top = o.offset().top - x.top + "px";
                    h.style.left = o.offset().left - x.left + "px";
                    c.css("opacity", 0);
                    if (i.useScaling) {
                        c.scale(0)
                    }
                    c.appendTo(f);
                    if (i.maxWidth === 0 || o.offset().left < i.maxWidth) {
                        u.push({
                            element: e(c),
                            dest: o,
                            animation: l
                        })
                    }
                }
            });
            C.remove();
            if (!i.atomic) {
                i.enhancement(f);
                for (r = 0; r < u.length; r++) {
                    u[r].element.animate(u[r].animation, i.duration, i.easing, E)
                }
            } else {
                $toDelete = f.find(i.selector);
                f.prepend(C.find(i.selector));
                for (r = 0; r < u.length; r++) {
                    if (u[r].dest && u[r].style) {
                        var L = u[r].dest;
                        var A = L.offset();
                        L.css({
                            position: "relative",
                            top: u[r].style.top - A.top,
                            left: u[r].style.left - A.left
                        });
                        L.animate({
                            top: "0",
                            left: "0"
                        }, i.duration, i.easing, E)
                    } else {
                        u[r].element.animate(u[r].animation, i.duration, i.easing, E)
                    }
                }
                $toDelete.remove()
            }
        })
    }
})(jQuery);