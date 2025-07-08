# eventemitter-super
 ![QQ](https://img.shields.io/badge/QQ-306863030-green.svg) [![Gitee](https://img.shields.io/badge/Gitee-roman_123-blue.svg)](https://gitee.com/roman_123/eventemitter-super) [![GitHub](https://img.shields.io/badge/GitHub-roman_123-blue.svg)](https://github.com/qq306863030/eventemitter-super) [![NPM](https://img.shields.io/badge/NPM-roman_123-blue.svg)](https://www.npmjs.com/package/eventemitter-super)

> An event emitter/listener tool based on EventEmitter3.一个基于eventemitter3的事件发送监听工具

## Setup

### Node

```shell
npm install --save eventemitter-super
```

### Browser

```html
<script src="./lib/eventemitter-super.umd.js"></script>
```

## Usage

You can then use it as a window global or as an CommonJs module

```js
// plain javascript in browser
var eventBus = new EventTool.EventEmitterSuper()

// commonJs
const EventTool = require('eventemitter-super')
const eventBus = new EventTool.EventEmitterSuper()

// es6 module 使用ES6模块，需要在项目中集成webpack等打包工具
/**
 * If you want to use this library by esm, you must ensure that your project 
 * has used webpack, vite, rollup or other packaging tools.
 */
import { EventEmitterSuper } from 'eventemitter-super'

const eventBus = new EventEmitterSuper()
```

## Example

```js
// 扩展了常用方法的别名: bindOnce(once)、bind(on)、fire(emit)、unbind(off)、un(off)、addOnceListeners(onceEvents)
// Extend the alias of commonly used methods: bindOnce(once), bind(on), fire(emit), unbind(off), un(off), addOnceListeners(onceEvents)
```
### 示例1-返回一个销毁监听器的函数|Example1-Return a function that destroys the listener
```js
import EventEmitterSuper from 'eventemitter-super';
const eventBus = new EventEmitterSuper()
// 返回一个函数，调用该函数可以销毁监听器
// Returns a function, which can be called to destroy the listener
const destoryEvent = eventBus.on('event1', () => {
    console.log('event1执行')
})
destoryEvent() // 执行后，销毁监听器
```
### 示例2-html元素事件监听|Example2-HTML element event listener
```js
const eventBus = new EventEmitterSuper()
// 为htmlElement创建一个监听器，返回一个函数，调用该函数可以销毁监听器
// Create a listener for the htmlElement, and return a function, which can be called to destroy the listener
const div = document.getElementById('test-div')
const destoryEvent = eventBus.addHtmlListener(div, 'click', () => {})
destoryEvent() // 执行后，销毁监听器
```
### 示例3-添加防抖、节流监听器|Example3-Add debounce and throttle listeners
```js
// 防抖
const eventBus = new EventEmitterSuper()
const destoryEvent = eventBus.onDebounce('event1', function (){
  console.log('event1', arguments)
}, 1000, null) // 返回一个函数，调用该函数可以销毁监听器

const code = setInterval(() => {
  eventBus.fire('event1', 1, 2, 3)
}, 100)

setTimeout(() => {
  clearInterval(code) // 5秒后停止发送event1事件, 触发防抖监听器 // Stop sending event1 events after 5 seconds, and trigger the debounce listener
}, 5000)

// 节流
const eventBus = new EventEmitterSuper()
const destroy = eventBus.onThrottle('event1', function (){
  console.log('event1', arguments)
}, 1000, null)

const code = setInterval(() => {
  eventBus.fire('event1', 1, 2, 3)
}, 100)

setTimeout(() => {
  clearInterval(code)
}, 5000)
```
### 示例4-html元素事件防抖、节流|Example4-HTML element event debounce and throttle
```html
// 示例-html元素事件防抖
<body>
    <button id="btn">click me</button>
    <button id="btn2">stop listen</button>
    <script src="./lib/eventemitter-super.umd.js"></script>
    <script>
        const eventBus = new EventTool.EventEmitterSuper()
        const btn = document.getElementById('btn')
        const btn2 = document.getElementById('btn2')
        const destroyBtn = eventBus.onDebounceHtmlEvent(btn, 'click', () => {
            console.log('click btn')
        }, 1000, null)
        // 点击按钮2，销毁监听
        const destroyBtn2 = eventBus.onHtmlEvent(btn2, 'click', () => {
            destroyBtn()
        }, null)
    </script>
</body>

// 示例-html元素事件节流
<body>
    <button id="btn">click me</button>
    <button id="btn2">stop listen</button>
    <script src="./lib/eventemitter-super.umd.js"></script>
    <script>
        const eventBus = new EventTool.EventEmitterSuper()
        const btn = document.getElementById('btn')
        const btn2 = document.getElementById('btn2')
        const destroyBtn = eventBus.onThrottleHtmlEvent(btn, 'click', () => {
            console.log('click btn')
        }, 1000, null)
        // 点击按钮2，销毁监听
        const destroyBtn2 = eventBus.onHtmlEvent(btn2, 'click', () => {
            destroyBtn()
        }, null)
    </script>
</body>
```
### 示例5-一次监听多个事件，全部执行完毕后执行监听器回调函数|Example5-Listen to multiple events, and execute the callback function after all events are executed
```js
const eventBus = new EventEmitterSuper()
// onceEvents：所有事件执行完成后执行回调函数
// onceEvents: The callback function will be executed after all events are executed
eventBus.onceEvents(['event1', 'event2'], () => {
    console.log('event1 and event2')
})

setTimeout(() => {
    eventBus.emit('event2')
}, 1000)
setTimeout(() => {
    eventBus.emit('event1')
}, 2000)  // 两秒后打印event1 and event2 // event1 and event2 will be printed after 2 seconds
```
### 示例6-设置监听次数，达到次数后执行监听器回调函数|Example6-Set the number of times to listen, and execute the callback function when the number of times is reached
```js
const eventBus = new EventEmitterSuper()
eventBus.onceByExecCount('test', () => {
  console.log('event emitted')
}, 3)
eventBus.emit('test')
eventBus.emit('test')
eventBus.emit('test') // 在第3次执行时控制台打印"event emitted" // `event emitted` will be printed in the console after the third execution
```
### 示例7-设置最大等待时间，达到最大等待时间后未监听到事件，则自动执行监听器回调函数|Example7-Set the maximum waiting time, and execute the callback function automatically if the maximum waiting time is reached without listening to an event
```js
const eventBus = new EventEmitterSuper()
// exp1
eventBus.onceWithMaxWaitTime('test', () => {
  console.log('event emitted')
}, 3000) // 3秒后如果未监听到test事件，则自动触发回调函数，控制台打印"event emitted" // If the test event is not listened to after 3 seconds, the callback function will be triggered automatically, and "event emitted" will be printed in the console
// exp2
eventBus.onceEventsWithMaxWaitTime(['test1', 'test2'], () => {
  console.log('event emitted')
}, 3000) // 3秒后如果未监听到test1、test2事件，则自动触发回调函数，控制台打印"event emitted" // If the test1 and test2 events are not listened to after 3 seconds, the callback function will be triggered automatically, and "event emitted" will be printed in the console
// exp3
eventBus.onceEventsWithMaxWaitTime(['test1', 'test1'], () => {
  console.log('event emitted')
}, 3000) // 3秒后如果未监听到test1事件执行2次，则自动触发回调函数，控制台打印"event emitted" // If the test1 event is not executed twice after 3 seconds, the callback function will be triggered automatically, and "event emitted" will be printed in the console
```
### 示例8-Promise封装|Example8-Promise wrapper
```js
// 对一些方法进行封装，能够返回Promise对象
oncePromise<T extends string | symbol>(event: T, context?: Context): Promise<any[]>
onceEventsPromise<T extends string | symbol>(eventNames: T[], context?: Context): Promise<any[]>
onceByExecCountPromise<T extends string | symbol>(event: T, execCount: number, context?: Context): Promise<any[]>
onceWithMaxWaitTimePromise<T extends string | symbol>(event: T, maxTime: number, context?: Context): Promise<any[]>
onceEventsWithMaxWaitTimePromise<T extends string | symbol>(eventNames: T[], maxTime: number, context?: Context): Promise<any[]>

// exp1
async function test() {
  const res = await eventBus.oncePromise('test')
  console.log(res)
}
test()
// 3秒后发送test事件
setTimeout(() => {
  eventBus.emit('test', 'eventobj1', 'eventobj2')
}, 3000) // 3秒后打印["eventobj1", "eventobj2"] // After 3 seconds, the console will print ["eventobj1", "eventobj2"]

// exp2
async function test() {
  // 监听test1事件，最大等待时间设置为3秒
  const res = await eventBus.onceWithMaxWaitTimePromise('test1', 3000)
  console.log(res)
}
test()
// 1秒后发送test事件
setTimeout(() => {
  eventBus.emit('test1', 'eventobj1', 'eventobj1')
}, 1000) // 1秒后打印["eventobj1", "eventobj1"] // After 1 second, the console will print ["eventobj1", "eventobj1"]
```