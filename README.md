# Backend Test Solution

## How to run the program

1. To build the program:

```
build.sh
```

2. To run the program with a JSON input file:

```
run.sh test.json
```

or with Node:

```
node solution.js test.json
```

## Some factors to consider

1. A typical music festival has a limited list of acts to perform (around 5-10 bands a day). So I suppose that the size of any input would be fairly small which means the problem can be solved quite fast with a standard computer.

2. Accuracy and optimum should be the key aspect to consider when the program produce Sally's schedule. It shouldn't miss any event that has higher priority at any given time. For example, If Sally jumps from event A to event B due to higher priority and when event B has ended, the program should consider if after event B there is any event C that has higher priority than event A. If yes then Sally should jump directly to event C instead of going back to event A.

3. Because if two or more performances with same priority happen at the same time and either one can be included, the program can produce different results based on which performance is chosen. By checking the difference between the expected file and the result file it could produce wrong feedback, so I propose different approach to evaluate the program in the following Testing section.

## Approach to produce optimal schedule

Since this is an optimization problem, I decided to use Greedy algorithm approach to solve the problem by choosing the best next performance with highest priority within a time duration. Additionally, stack data structure was used to track the order of visited performances so that it can trace back to the previous ones when current attended performance has ended.

    *Programming Language used: Typescript/Javascript.

**General flow of the program algorithm**

1. Start with an input list of `events`, both empty `schedule` array and tracking `stack`.
2. If there is still any event in `events` and `stack` to process, then continue.
3. Find the next event to jump to:
   - If `stack` is empty, then find the closest event with highest priority.
   - Else find if there is any overlapping event that has higher priority.
4. Check if any next event found:
   - If there is, then push the next event to `stack` and if there is a previous one in `stack` then cut it short and add it to `schedule`.
   - Else pop latest event from `stack` and add it to `schedule` if its finish time is still after the last one in `schedule`.
5. Repeat steps 2, 3 and 4 until there is no more events to process.
6. Write the optimal `schedule` to output file.

## Testing strategy

In order to ensure future maintainability:

1. A good testing process is that it can detect high number of failed results as well as unknown cases that haven't included yet. So I came up with more test cases (in verifier folder) which have more complex timeline with more overlapping performances because the more test cases, the better.

2. The current way of evaluating results produced from the program is not sustainable as mentioned above since there could be more optimal schedules that the program can produce. Let's say we have an input below:

```json
[
  {
    "band": "Soundgarden",
    "start": "1993-05-25T02:00:00Z",
    "finish": "1993-05-25T02:10:00Z",
    "priority": 1
  },
  {
    "band": "Pearl Jam",
    "start": "1993-05-25T02:00:00Z",
    "finish": "1993-05-25T02:15:00Z",
    "priority": 1
  }
]
```

The first visited performance could be from Soundgarden or Pearl Jam because they start at the same time with same priority. Thus, the optimal schedule could be as follow:

```json
[
  {
    "band": "Pearl Jam",
    "start": "1993-05-25T02:00:00Z",
    "finish": "1993-05-25T02:15:00Z",
    "priority": 1
  }
]
```

or:

```json
[
  {
    "band": "Soundgarden",
    "start": "1993-05-25T02:00:00Z",
    "finish": "1993-05-25T02:10:00Z"
  },
  {
    "band": "Pearl Jam",
    "start": "1993-05-25T02:10:00Z",
    "finish": "1993-05-25T02:15:00Z"
  }
]
```

**Alternative testing approaches**

1. For every test case input, we should have a set of expected outputs that cover all possible optimal schedules, so that if there is a case where it can have more than one answer, the testing script wouldn't mark the produced schedule as a failed result.

2. Another way to evaluate the program is to iterate through the optimal schedule produced by the program to check for every time period of the visited performance if there is any performance that has higher priority within the start and finish range. If there is, then the schedule is not optimal, otherwise the schedule is optimal and the test case is passed.
