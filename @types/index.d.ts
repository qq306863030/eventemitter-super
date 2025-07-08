import type EventEmitter from "./eventemitter3";
declare class EventEmitterSuper<Context extends any = any> extends EventEmitter {
    /**
     * 事件监听|event listener
     * @param event 事件名称|event name
     * @param fn 事件执行的回调函数|callback function
     * @param context 回调函数内执行的上下文|context of callback function
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    on<T extends string | symbol>(event: T, fn: (...args: any[]) => void, context?: Context): () => void;
    /**
     * 事件监听|event listener
     * @param event 事件名称|event name
     * @param fn 事件执行的回调函数|callback function
     * @param context 回调函数内执行的上下文|context of callback function
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    addListener<T extends string | symbol>(event: T, fn: (...args: any[]) => void, context?: Context): () => void;
    /**
     * 一次事件监听|one time event listener
     * @param event 事件名称|event name
     * @param fn 事件执行的回调函数|callback function
     * @param context 回调函数内执行的上下文|context of callback function
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    once<T extends string | symbol>(event: T, fn: (...args: any[]) => void, context?: Context): () => void
    /**
     * 防抖监听器|debounce listener
     * @param event 事件名称|event name
     * @param fn 事件执行的回调函数|callback function
     * @param wait 防抖最大等待时间(ms)|max wait time of debounce(ms)
     * @param context 回调函数内执行的上下文|context of callback function
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    onDebounce<T extends string | symbol>(event: T, fn: (...args: any[]) => void, wait: number, context?: Context): () => void;
    /**
     * 节流监听器|throttle listener
     * @param event 事件名称|event name
     * @param fn 事件执行的回调函数|callback function
     * @param wait 防抖最大等待时间(ms)|max wait time of throttle(ms)
     * @param context 回调函数内执行的上下文|context of callback function
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    onThrottle<T extends string | symbol>(event: T, fn: (...args: any[]) => void, wait: number, context?: Context): () => void;
    /**
     * html事件监听器，返回一个销毁该监听器的函数|html event listener, return a function to destroy listener
     * @param htmlElement html元素|html element
     * @param type html事件类型|html event type
     * @param fn 触发事件|trigger event
     * @param opt html监听器的选项|html listener options
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    onHtmlEvent<K extends keyof HTMLElementEventMap>(htmlElement: HTMLElement, type: K, fn: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, opt?: boolean | AddEventListenerOptions): () => void;
    /**
     * html事件监听器(防抖)，返回一个销毁该监听器的函数|html event listener, return a function to destroy listener
     * @param htmlElement html元素|html element
     * @param type html事件类型|html event type
     * @param fn 触发事件|trigger event
     * @param wait 防抖最大等待时间(ms)|max wait time of debounce(ms)
     * @param opt html监听器的选项|html listener options
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    onDebounceHtmlEvent<K extends keyof HTMLElementEventMap>(htmlElement: HTMLElement, type: K, fn: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, wait: number, opt?: boolean | AddEventListenerOptions): () => void;
    /**
     * html事件监听器(节流)，返回一个销毁该监听器的函数|html event listener, return a function to destroy listener
     * @param htmlElement html元素|html element
     * @param type html事件类型|html event type
     * @param fn 触发事件|trigger event
     * @param wait 节流最大等待时间(ms)|max wait time of throttle(ms)
     * @param opt html监听器的选项|html listener options
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    onThrottleHtmlEvent<K extends keyof HTMLElementEventMap>(htmlElement: HTMLElement, type: K, fn: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, wait: number, opt?: boolean | AddEventListenerOptions): () => void;
    /**
     * html事件监听器，返回一个销毁该监听器的函数|html event listener, return a function to destroy listener
     * @param htmlElement html元素|html element
     * @param type html事件类型|html event type
     * @param fn 触发事件|trigger event
     * @param opt html监听器的选项|html listener options
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    addHtmlListener<K extends keyof HTMLElementEventMap>(htmlElement: HTMLElement, type: K, fn: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, opt?: boolean | AddEventListenerOptions): () => void;
    /**
     * 一次监听多个事件，所有事件执行完成后执行回调函数|one time event listener for multiple events, execute callback function after all events are triggered
     * @param eventNames 事件名称数组|event name array
     * @param fn 回调函数|callback function
     * @param context 回调函数内执行的上下文|context of callback function
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    onceEvents<T extends string | symbol>(eventNames: T[], fn: (...args: any[]) => void, context?: Context): () => void;
    /**
     * 一次监听多个事件，所有事件执行完成后执行回调函数|one time event listener for multiple events, execute callback function after all events are triggered
     * @param eventNames 事件名称数组|event name array
     * @param fn 回调函数|callback function
     * @param context 回调函数内执行的上下文|context of callback function
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    addOnceListeners<T extends string | symbol>(eventNames: T[], fn: (...args: any[]) => void, context?: Context): () => void;
    /**
     * 监听一个事件，在事件执行一定次数后执行回调函数|event listener for a certain number of executions, execute callback function after certain number of executions
     * @param event 事件名称|event name
     * @param fn 回调函数|callback function
     * @param execCount 事件执行的次数|number of executions of event
     * @param context 回调函数内执行的上下文|context of callback function
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    onceByExecCount<T extends string | symbol>(event: T, fn: (...args: any[]) => void, execCount?: number, context?: Context): () => void;
    /**
     * 监听一个事件，设置一个最大时间（毫秒），在一段时间之后事件还未执行，自动执行该回调函数|event listener with a maximum time, execute callback function after certain time if event is not executed
     * @param event 事件名称|event name
     * @param fn 回调函数|callback function
     * @param maxTime 最大等待时间（毫秒）|maximum waiting time (milliseconds)
     * @param context 回调函数内执行的上下文|context of callback function
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    onceWithMaxWaitTime<T extends string | symbol>(event: T, fn: (...args: any[]) => void, maxTime: number, context?: Context): () => void;
    /**
     * 一次监听多个事件，设置一个最大时间（毫秒），在一段时间之后监听的所有事件还未执行完成，自动执行该回调函数
     * @param event 事件名称|event name
     * @param fn 回调函数|callback function
     * @param maxTime 最大等待时间（毫秒）|maximum waiting time (milliseconds)
     * @param context 回调函数内执行的上下文|context of callback function
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    addOnceListenersWithMaxWaitTime<T extends string | symbol>(eventNames: T[], fn: (...args: any[]) => void,maxTime: number, context?:Context): () => void
    /**
     * 一次监听多个事件，设置一个最大时间（毫秒），在一段时间之后监听的所有事件还未执行完成，自动执行该回调函数
     * @param event 事件名称|event name
     * @param fn 回调函数|callback function
     * @param maxTime 最大等待时间（毫秒）|maximum waiting time (milliseconds)
     * @param context 回调函数内执行的上下文|context of callback function
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    onceEventsWithMaxWaitTime<T extends string | symbol>(eventNames: T[], fn: (...args: any[]) => void,maxTime: number, context?:Context): () => void
    /**
     * 一次事件监听|one time event listener
     * @param event 事件名称|event name
     * @param context 回调函数内执行的上下文|context of callback function
     * @returns 返回一个Promise对象，获取事件执行后发送的参数数组
     */
    oncePromise<T extends string | symbol>(event: T, context?: Context): Promise<any[]>
    onceEventsPromise<T extends string | symbol>(eventNames: T[], context?: Context): Promise<any[]>
    onceByExecCountPromise<T extends string | symbol>(event: T, execCount: number, context?: Context): Promise<any[]>
    onceWithMaxWaitTimePromise<T extends string | symbol>(event: T, maxTime: number, context?: Context): Promise<any[]>
    onceEventsWithMaxWaitTimePromise<T extends string | symbol>(eventNames: T[], maxTime: number, context?: Context): Promise<any[]>
    /**
     * 一次事件监听
     * @param event 事件名称|event name
     * @param fn 事件执行的回调函数|callback function
     * @param context 回调函数内执行的上下文|context of callback function
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    bindOnce<T extends string | symbol>(eventName: T, fn: (...args: any[]) => void, context?: Context): () => void;
    /**
     * 事件监听
     * @param event 事件名称|event name
     * @param fn 事件执行的回调函数|callback function
     * @param context 回调函数内执行的上下文|context of callback function
     * @returns 返回一个函数，调用该函数可以销毁监听器|return a function to destroy listener
     */
    bind<T extends string | symbol>(eventName: T, fn: (...args: any[]) => void, context?: Context): () => void;
    /**
     * 事件发送
     * @param eventName 事件名称|event name
     * @param args 回调函数执行时的参数|arguments of callback function
     */
    fire<T extends string | symbol>(eventName: T, ...args: any[]): boolean;
    /**
     * 事件销毁
     * @param eventName 事件名称|event name
     * @param fn 回调函数|callback function
     * @param context 回调函数内执行的上下文|context of callback function
     * @param once 是否是一次监听|is once listener
     */
    unbind<T extends string | symbol>(eventName: T, fn: (...args: any[]) => void, context?: Context, once?: boolean): this;
    /**
     * 事件销毁
     * @param eventName 事件名称|event name
     * @param fn 回调函数|callback function
     * @param context 回调函数内执行的上下文|context of callback function
     * @param once 是否是一次监听|is once listener
     */
    un<T extends string | symbol>(eventName: T, fn: (...args: any[]) => void, context?: Context, once?: boolean): this;
    
}
export { EventEmitterSuper };
export default EventEmitterSuper;