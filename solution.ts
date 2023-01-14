import Stack from "./stack";
import fs from "fs";
import path from "path";

const isNextEvent = (event, selectedEvent) =>
  !selectedEvent ||
  event.start < selectedEvent.start ||
  (event.start.getTime() === selectedEvent.start.getTime() &&
    event.priority > selectedEvent.priority);

const isOverlappingEvent = (event, currentEvent) =>
  event.start >= currentEvent.start &&
  event.start <= currentEvent.finish &&
  event.priority > currentEvent.priority;

const findNextEventIdx = (events, stack) => {
  let selectedEvent;
  let nextEventIdx = -1;
  const currentEvent = stack.isEmpty() ? events[0] : stack.peek();

  for (let idx = 0; idx < events.length; idx++) {
    const event = events[idx];

    if (
      (stack.isEmpty() && isNextEvent(event, selectedEvent)) ||
      (isOverlappingEvent(event, currentEvent) &&
        isNextEvent(event, selectedEvent))
    ) {
      nextEventIdx = idx;
      selectedEvent = event;
    }
  }

  return nextEventIdx;
};

const filePath = process.argv.slice(2)[0];
const input = JSON.parse(fs.readFileSync(filePath, "utf8"));

let events = input.map((event) => ({
  ...event,
  strStart: event.start,
  strFinish: event.finish,
  start: new Date(event.start),
  finish: new Date(event.finish),
}));

let schedule = [];
let stack = new Stack();

while (events.length > 0 || !stack.isEmpty()) {
  const nextEventIdx = findNextEventIdx(events, stack);

  if (nextEventIdx >= 0) {
    const nextEvent = events.splice(nextEventIdx, 1)[0];
    const latestVisitedEvent: any = schedule[schedule.length - 1];

    if (
      !stack.isEmpty() &&
      (!latestVisitedEvent || latestVisitedEvent.finish < nextEvent.start)
    ) {
      const currentEvent = stack.peek();
      const addedEvent = {
        ...currentEvent,
        start:
          latestVisitedEvent && latestVisitedEvent.finish > currentEvent.start
            ? latestVisitedEvent.finish
            : currentEvent.start,
        strStart:
          latestVisitedEvent && latestVisitedEvent.finish > currentEvent.start
            ? latestVisitedEvent.strFinish
            : currentEvent.strStart,
        finish: nextEvent.start,
        strFinish: nextEvent.strStart,
      };

      schedule.push(addedEvent);
    }

    if (latestVisitedEvent && latestVisitedEvent.finish > nextEvent.start) {
      nextEvent.start = latestVisitedEvent.finish;
      nextEvent.strStart = latestVisitedEvent.strFinish;
    }

    stack.push(nextEvent);
  } else {
    const addedEvent = stack.pop();
    const latestVisitedEvent =
      schedule.length > 0
        ? schedule[schedule.length - 1]
        : { finish: new Date(0) };

    if (!addedEvent || latestVisitedEvent.finish >= addedEvent.finish) continue;
    if (addedEvent.start < latestVisitedEvent.finish) {
      addedEvent.start = latestVisitedEvent.finish;
      addedEvent.strStart = latestVisitedEvent.strFinish;
    }

    schedule.push(addedEvent);
  }
}

schedule = schedule.map((event) => ({
  band: event.band,
  start: event.strStart,
  finish: event.strFinish,
}));

fs.writeFileSync(
  `${path.dirname(filePath)}/${path.parse(filePath).name}.optimal.json`,
  JSON.stringify(schedule)
);
