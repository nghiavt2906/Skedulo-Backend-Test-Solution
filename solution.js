"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var stack_1 = __importDefault(require("./stack"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var isNextEvent = function (event, selectedEvent) {
    return !selectedEvent ||
        event.start < selectedEvent.start ||
        (event.start.getTime() === selectedEvent.start.getTime() &&
            event.priority > selectedEvent.priority);
};
var isOverlappingEvent = function (event, currentEvent) {
    return event.start >= currentEvent.start &&
        event.start <= currentEvent.finish &&
        event.priority > currentEvent.priority;
};
var findNextEventIdx = function (events, stack) {
    var selectedEvent;
    var nextEventIdx = -1;
    var currentEvent = stack.isEmpty() ? events[0] : stack.peek();
    for (var idx = 0; idx < events.length; idx++) {
        var event_1 = events[idx];
        if ((stack.isEmpty() && isNextEvent(event_1, selectedEvent)) ||
            (isOverlappingEvent(event_1, currentEvent) &&
                isNextEvent(event_1, selectedEvent))) {
            nextEventIdx = idx;
            selectedEvent = event_1;
        }
    }
    return nextEventIdx;
};
var filePath = process.argv.slice(2)[0];
var input = JSON.parse(fs_1["default"].readFileSync(filePath, "utf8"));
var events = input.map(function (event) { return (__assign(__assign({}, event), { strStart: event.start, strFinish: event.finish, start: new Date(event.start), finish: new Date(event.finish) })); });
var stack = new stack_1["default"]();
var schedule = [];
while (events.length > 0 || !stack.isEmpty()) {
    var nextEventIdx = findNextEventIdx(events, stack);
    if (nextEventIdx >= 0) {
        var nextEvent = events.splice(nextEventIdx, 1)[0];
        var latestVisitedEvent = schedule[schedule.length - 1];
        if (!stack.isEmpty() &&
            (!latestVisitedEvent || latestVisitedEvent.finish < nextEvent.start)) {
            var currentEvent = stack.peek();
            var addedEvent = __assign(__assign({}, currentEvent), { start: latestVisitedEvent && latestVisitedEvent.finish > currentEvent.start
                    ? latestVisitedEvent.finish
                    : currentEvent.start, strStart: latestVisitedEvent && latestVisitedEvent.finish > currentEvent.start
                    ? latestVisitedEvent.strFinish
                    : currentEvent.strStart, finish: nextEvent.start, strFinish: nextEvent.strStart });
            schedule.push(addedEvent);
        }
        if (latestVisitedEvent && latestVisitedEvent.finish > nextEvent.start) {
            nextEvent.start = latestVisitedEvent.finish;
            nextEvent.strStart = latestVisitedEvent.strFinish;
        }
        stack.push(nextEvent);
    }
    else {
        var addedEvent = stack.pop();
        var latestVisitedEvent = schedule.length > 0
            ? schedule[schedule.length - 1]
            : { finish: new Date(0) };
        if (!addedEvent || latestVisitedEvent.finish >= addedEvent.finish)
            continue;
        if (addedEvent.start < latestVisitedEvent.finish) {
            addedEvent.start = latestVisitedEvent.finish;
            addedEvent.strStart = latestVisitedEvent.strFinish;
        }
        schedule.push(addedEvent);
    }
}
schedule = schedule.map(function (event) { return ({
    band: event.band,
    start: event.strStart,
    finish: event.strFinish
}); });
fs_1["default"].writeFileSync("".concat(path_1["default"].dirname(filePath), "/").concat(path_1["default"].parse(filePath).name, ".optimal.json"), JSON.stringify(schedule));
