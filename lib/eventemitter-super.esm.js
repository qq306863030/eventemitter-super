import EventEmitter3 from 'eventemitter3';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var EventEmitterSuper = /** @class */ (function (_super) {
    __extends(EventEmitterSuper, _super);
    function EventEmitterSuper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EventEmitterSuper.prototype.on = function (event, fn, context) {
        var _this = this;
        _super.prototype.on.call(this, event, fn, context);
        return function () {
            _this.off(event, fn, context);
        };
    };
    EventEmitterSuper.prototype.addListener = function (event, fn, context) {
        var _this = this;
        _super.prototype.addListener.call(this, event, fn, context);
        return function () {
            _this.removeListener(event, fn, context);
        };
    };
    EventEmitterSuper.prototype.once = function (event, fn, context) {
        var _this = this;
        _super.prototype.once.call(this, event, fn, context);
        return function () {
            _this.off(event, fn, context, true);
        };
    };
    // 添加防抖监听器
    EventEmitterSuper.prototype.onDebounce = function (event, fn, wait, context) {
        fn = this._debounce(fn, wait);
        return this.on(event, fn, context);
    };
    // 添加节流监听器
    EventEmitterSuper.prototype.onThrottle = function (event, fn, wait, context) {
        fn = this._throttle(fn, wait);
        return this.on(event, fn, context);
    };
    EventEmitterSuper.prototype.onDebounceHtmlEvent = function (htmlElement, type, fn, wait, opt) {
        fn = this._debounce(fn, wait);
        return this.addHtmlListener(htmlElement, type, fn, opt);
    };
    EventEmitterSuper.prototype.onThrottleHtmlEvent = function (htmlElement, type, fn, wait, opt) {
        fn = this._throttle(fn, wait);
        return this.addHtmlListener(htmlElement, type, fn, opt);
    };
    EventEmitterSuper.prototype.onHtmlEvent = function (htmlElement, type, fn, opt) {
        return this.addHtmlListener(htmlElement, type, fn, opt);
    };
    EventEmitterSuper.prototype.addHtmlListener = function (htmlElement, type, fn, opt) {
        htmlElement.addEventListener(type, fn, opt);
        return function () {
            htmlElement.removeEventListener(type, fn, opt);
        };
    };
    EventEmitterSuper.prototype.onceEvents = function (eventNames, fn, context) {
        return this.addOnceListeners(eventNames, fn, context);
    };
    EventEmitterSuper.prototype.addOnceListeners = function (eventNames, fn, context) {
        var _this = this;
        var arr = __spreadArray([], eventNames, true);
        // arr去重
        var arr_new = Array.from(new Set(arr));
        var destoryEvents = [];
        arr_new.forEach(function (eventName) {
            var destoryEvent = _this.on(eventName, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                arr.splice(arr.indexOf(eventName), 1);
                if (!arr.includes(eventName)) {
                    var i = destoryEvents.indexOf(destoryEvent);
                    if (i > -1) {
                        destoryEvents.splice(i, 1);
                    }
                    destoryEvent();
                }
                if (arr.length === 0) {
                    fn.apply(context || _this, args);
                }
            }, context);
            destoryEvents.push(destoryEvent);
        });
        return function () {
            destoryEvents.forEach(function (destoryEvent) {
                destoryEvent();
            });
        };
    };
    EventEmitterSuper.prototype.bindOnce = function (eventName, fn, context) {
        return this.once(eventName, fn, context);
    };
    EventEmitterSuper.prototype.bind = function (eventName, fn, context) {
        return this.on(eventName, fn, context);
    };
    EventEmitterSuper.prototype.fire = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, __spreadArray([eventName], args, false));
    };
    EventEmitterSuper.prototype.unbind = function (eventName, fn, context, once) {
        return _super.prototype.off.call(this, eventName, fn, context, once);
    };
    EventEmitterSuper.prototype.un = function (eventName, fn, context, once) {
        return _super.prototype.off.call(this, eventName, fn, context, once);
    };
    EventEmitterSuper.prototype.onceByExecCount = function (event, fn, execCount, context) {
        var _this = this;
        if (execCount === void 0) { execCount = 1; }
        var destroyEvent = this.on(event, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            execCount--;
            if (execCount === 0) {
                fn.apply(context || _this, args);
                destroyEvent();
            }
        }, context);
        return destroyEvent;
    };
    EventEmitterSuper.prototype.onceWithMaxWaitTime = function (event, fn, maxTime, context) {
        var _this = this;
        var timer = undefined;
        var fn_new = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            fn.apply(context || _this, args);
            if (timer) {
                clearTimeout(timer);
                timer = undefined;
            }
        };
        var destroyEvent = this.once(event, fn_new, context);
        timer = setTimeout(function () {
            if (destroyEvent) {
                destroyEvent();
                destroyEvent = undefined;
            }
            fn.apply(context || _this);
        }, maxTime);
        return function () {
            if (timer) {
                clearTimeout(timer);
                timer = undefined;
            }
            if (destroyEvent) {
                destroyEvent();
                destroyEvent = undefined;
            }
        };
    };
    EventEmitterSuper.prototype.addOnceListenersWithMaxWaitTime = function (eventNames, fn, maxTime, context) {
        var _this = this;
        var timer = undefined;
        var fn_new = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            fn.apply(context || _this, args);
            if (timer) {
                clearTimeout(timer);
                timer = undefined;
            }
        };
        var destroyEvent = this.addOnceListeners(eventNames, fn_new, context);
        timer = setTimeout(function () {
            if (destroyEvent) {
                destroyEvent();
                destroyEvent = undefined;
            }
            fn.apply(context || _this);
        }, maxTime);
        return function () {
            if (timer) {
                clearTimeout(timer);
                timer = undefined;
            }
            if (destroyEvent) {
                destroyEvent();
                destroyEvent = undefined;
            }
        };
    };
    EventEmitterSuper.prototype.onceEventsWithMaxWaitTime = function (eventNames, fn, maxTime, context) {
        return this.addOnceListenersWithMaxWaitTime(eventNames, fn, maxTime, context);
    };
    EventEmitterSuper.prototype.oncePromise = function (event, context) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.once(event, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                resolve(args);
            }, context);
        });
    };
    EventEmitterSuper.prototype.onceEventsPromise = function (eventNames, context) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.onceEvents(eventNames, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                resolve(args);
            }, context);
        });
    };
    EventEmitterSuper.prototype.onceByExecCountPromise = function (event, execCount, context) {
        var _this = this;
        if (execCount === void 0) { execCount = 1; }
        return new Promise(function (resolve) {
            _this.onceByExecCount(event, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                resolve(args);
            }, execCount, context);
        });
    };
    EventEmitterSuper.prototype.onceWithMaxWaitTimePromise = function (event, maxTime, context) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.onceWithMaxWaitTime(event, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                resolve(args);
            }, maxTime, context);
        });
    };
    EventEmitterSuper.prototype.onceEventsWithMaxWaitTimePromise = function (eventNames, maxTime, context) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.onceEventsWithMaxWaitTime(eventNames, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                resolve(args);
            }, maxTime, context);
        });
    };
    // 防抖
    EventEmitterSuper.prototype._debounce = function (fn, wait) {
        var _this = this;
        var timer = undefined;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (timer) {
                clearTimeout(timer);
                timer = undefined;
            }
            timer = setTimeout(function () {
                fn.apply(_this, args);
            }, wait);
        };
    };
    // 节流
    EventEmitterSuper.prototype._throttle = function (fn, wait) {
        var _this = this;
        var lastTime = 0;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var nowTime = Date.now();
            if (nowTime - lastTime >= wait) {
                fn.apply(_this, args);
                lastTime = nowTime;
            }
        };
    };
    return EventEmitterSuper;
}(EventEmitter3));

export { EventEmitterSuper, EventEmitterSuper as default };
