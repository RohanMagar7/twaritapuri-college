/*
 jQuery wookmark plugin
 @name jquery.wookmark.js
 @author Christoph Ono (chri@sto.ph or @gbks)
 @author Sebastian Helzle (sebastian@helzle.net or @sebobo)
 @version 1.4.7
 @date 05/18/2014
 @category jQuery plugin
 @copyright (c) 2009-2014 Christoph Ono (www.wookmark.com)
 @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
! function(t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery)
}(function(t) {
    function i(t) {
        n(function() {
            var i, e;
            for (i = 0; t.length > i; i++) e = t[i], e.obj.css(e.css)
        })
    }

    function e(i) {
        return t.trim(i).toLowerCase()
    }
    var s, h, o;
    o = function(t, i) {
        return function() {
            return t.apply(i, arguments)
        }
    }, h = {
        align: "center",
        autoResize: !1,
        comparator: null,
        container: t("body"),
        direction: void 0,
        ignoreInactiveItems: !0,
        itemWidth: 0,
        fillEmptySpace: !1,
        flexibleWidth: 0,
        offset: 2,
        outerOffset: 0,
        onLayoutChanged: void 0,
        possibleFilters: [],
        resizeDelay: 50,
        verticalOffset: void 0
    };
    var n = window.requestAnimationFrame || function(t) {
            t()
        },
        r = t(window);
    s = function() {
        function s(i, e) {
            this.handler = i, this.columns = this.containerWidth = this.resizeTimer = null, this.activeItemCount = 0, this.itemHeightsDirty = !0, this.placeholders = [], t.extend(!0, this, h, e), this.verticalOffset = this.verticalOffset || this.offset, this.update = o(this.update, this), this.onResize = o(this.onResize, this), this.onRefresh = o(this.onRefresh, this), this.getItemWidth = o(this.getItemWidth, this), this.layout = o(this.layout, this), this.layoutFull = o(this.layoutFull, this), this.layoutColumns = o(this.layoutColumns, this), this.filter = o(this.filter, this), this.clear = o(this.clear, this), this.getActiveItems = o(this.getActiveItems, this), this.refreshPlaceholders = o(this.refreshPlaceholders, this), this.sortElements = o(this.sortElements, this), this.updateFilterClasses = o(this.updateFilterClasses, this), this.updateFilterClasses(), this.autoResize && r.bind("resize.wookmark", this.onResize), this.container.bind("refreshWookmark", this.onRefresh)
        }
        return s.prototype.updateFilterClasses = function() {
            for (var t, i, s, h, o = 0, n = 0, r = 0, a = {}, l = this.possibleFilters; this.handler.length > o; o++)
                if (i = this.handler.eq(o), t = i.data("filterClass"), "object" == typeof t && t.length > 0)
                    for (n = 0; t.length > n; n++) s = e(t[n]), void 0 === a[s] && (a[s] = []), a[s].push(i[0]);
            for (; l.length > r; r++) h = e(l[r]), h in a || (a[h] = []);
            this.filterClasses = a
        }, s.prototype.update = function(i) {
            this.itemHeightsDirty = !0, t.extend(!0, this, i)
        }, s.prototype.onResize = function() {
            clearTimeout(this.resizeTimer), this.itemHeightsDirty = 0 !== this.flexibleWidth, this.resizeTimer = setTimeout(this.layout, this.resizeDelay)
        }, s.prototype.onRefresh = function() {
            this.itemHeightsDirty = !0, this.layout()
        }, s.prototype.filter = function(i, s, h) {
            var o, n, r, a, l, f = [],
                c = t();
            if (i = i || [], s = s || "or", h = h || !1, i.length) {
                for (n = 0; i.length > n; n++) l = e(i[n]), l in this.filterClasses && f.push(this.filterClasses[l]);
                if (o = f.length, "or" == s || 1 == o)
                    for (n = 0; o > n; n++) c = c.add(f[n]);
                else if ("and" == s) {
                    var u, d, m, p = f[0],
                        g = !0;
                    for (n = 1; o > n; n++) f[n].length < p.length && (p = f[n]);
                    for (p = p || [], n = 0; p.length > n; n++) {
                        for (d = p[n], g = !0, r = 0; f.length > r && g; r++)
                            if (m = f[r], p != m) {
                                for (a = 0, u = !1; m.length > a && !u; a++) u = m[a] == d;
                                g &= u
                            }
                        g && c.push(p[n])
                    }
                }
                h || this.handler.not(c).addClass("inactive")
            } else c = this.handler;
            return h || (c.removeClass("inactive"), this.columns = null, this.layout()), c
        }, s.prototype.refreshPlaceholders = function(i, e) {
            for (var s, h, o, n, r, a, l = this.placeholders.length, f = this.columns.length, c = this.container.innerHeight(); f > l; l++) s = t('<div class="wookmark-placeholder"/>').appendTo(this.container), this.placeholders.push(s);
            for (a = this.offset + 2 * parseInt(this.placeholders[0].css("borderLeftWidth"), 10), l = 0; this.placeholders.length > l; l++)
                if (s = this.placeholders[l], o = this.columns[l], l >= f || !o[o.length - 1]) s.css("display", "none");
                else {
                    if (!(h = o[o.length - 1])) continue;
                    n = c - (r = h.data("wookmark-top") + h.data("wookmark-height") + this.verticalOffset) - a, s.css({
                        position: "absolute",
                        display: n > 0 ? "block" : "none",
                        left: l * i + e,
                        top: r,
                        width: i - a,
                        height: n
                    })
                }
        }, s.prototype.getActiveItems = function() {
            return this.ignoreInactiveItems ? this.handler.not(".inactive") : this.handler
        }, s.prototype.getItemWidth = function() {
            var t = this.itemWidth,
                i = this.container.width() - 2 * this.outerOffset,
                e = this.handler.eq(0),
                s = this.flexibleWidth;
            if (void 0 === this.itemWidth || 0 === this.itemWidth && !this.flexibleWidth ? t = e.outerWidth() : "string" == typeof this.itemWidth && this.itemWidth.indexOf("%") >= 0 && (t = parseFloat(this.itemWidth) / 100 * i), s) {
                "string" == typeof s && s.indexOf("%") >= 0 && (s = parseFloat(s) / 100 * i);
                var h = i + this.offset,
                    o = ~~(.5 + h / (s + this.offset)),
                    n = ~~(h / (t + this.offset)),
                    r = Math.max(o, n),
                    a = Math.min(s, ~~((i - (r - 1) * this.offset) / r));
                t = Math.max(t, a), this.handler.css("width", t)
            }
            return t
        }, s.prototype.layout = function(t) {
            if (this.container.is(":visible")) {
                var i, e, s = this.getItemWidth() + this.offset,
                    h = this.container.width() - 2 * this.outerOffset,
                    o = ~~((h + this.offset) / s),
                    n = 0,
                    r = 0,
                    a = this.getActiveItems(),
                    l = a.length;
                if (this.itemHeightsDirty || !this.container.data("itemHeightsInitialized")) {
                    for (; l > r; r++) i = a.eq(r), i.data("wookmark-height", i.outerHeight());
                    this.itemHeightsDirty = !1, this.container.data("itemHeightsInitialized", !0)
                }
                o = Math.max(1, Math.min(o, l)), n = this.outerOffset, "center" == this.align && (n += ~~(h - (o * s - this.offset) + .5 >> 1)), this.direction = this.direction || ("right" == this.align ? "right" : "left"), e = t || null === this.columns || this.columns.length != o || this.activeItemCount != l ? this.layoutFull(s, o, n) : this.layoutColumns(s, n), this.activeItemCount = l, this.container.attr({
                    "data-min-height": this.container.attr("data-flexible-height") == '1' || this.container.attr("data-min-height") > parseInt(e) ? this.container.attr("data-min-height") : e
                }), this.container.css("height", this.container.attr("data-min-height") > parseInt(e) ? this.container.attr("data-min-height") + "px" : e), this.fillEmptySpace && this.refreshPlaceholders(s, n), void 0 !== this.onLayoutChanged && "function" == typeof this.onLayoutChanged && this.onLayoutChanged()
            }
        }, s.prototype.sortElements = function(t) {
            return "function" == typeof this.comparator ? t.sort(this.comparator) : t
        }, s.prototype.layoutFull = function(e, s, h) {
            var o, n, r = 0,
                a = 0,
                l = t.makeArray(this.getActiveItems()),
                f = l.length,
                c = null,
                u = null,
                d = [],
                m = [],
                p = "left" == this.align;
            for (this.columns = [], l = this.sortElements(l); s > d.length;) d.push(this.outerOffset), this.columns.push([]);
            for (; f > r; r++) {
                for (o = t(l[r]), c = d[0], u = 0, a = 0; s > a; a++) c > d[a] && (c = d[a], u = a);
                o.data("wookmark-top", c), n = h, (u > 0 || !p) && (n += u * e), (m[r] = {
                    obj: o,
                    css: {
                        position: "absolute",
                        top: c
                    }
                }).css[this.direction] = n, d[u] += o.data("wookmark-height") + this.verticalOffset, this.columns[u].push(o)
            }
            return i(m), Math.max.apply(Math, d)
        }, s.prototype.layoutColumns = function(t, e) {
            for (var s, h, o, n, r = [], a = [], l = 0, f = 0, c = 0; this.columns.length > l; l++) {
                for (r.push(this.outerOffset), h = this.columns[l], n = l * t + e, s = r[l], f = 0; h.length > f; f++, c++) o = h[f].data("wookmark-top", s), (a[c] = {
                    obj: o,
                    css: {
                        top: s
                    }
                }).css[this.direction] = n, s += o.data("wookmark-height") + this.verticalOffset;
                r[l] = s
            }
            return i(a), Math.max.apply(Math, r)
        }, s.prototype.clear = function() {
            clearTimeout(this.resizeTimer), r.unbind("resize.wookmark", this.onResize), this.container.unbind("refreshWookmark", this.onRefresh), this.handler.wookmarkInstance = null
        }, s
    }(), t.fn.wookmark = function(t) {
        return this.wookmarkInstance ? this.wookmarkInstance.update(t || {}) : this.wookmarkInstance = new s(this, t || {}), this.wookmarkInstance.layout(!0), this.show()
    }
});