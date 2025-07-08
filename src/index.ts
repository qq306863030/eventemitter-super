import EventEmitter3 from "eventemitter3";

class EventEmitterSuper<Context extends any = any> extends EventEmitter3 {
  override on<T extends string | symbol>(
    event: T,
    fn: (...args: any[]) => void,
    context?: Context
  ): () => void {
    super.on(event, fn, context);
    return () => {
      this.off(event, fn, context);
    };
  }
  override addListener<T extends string | symbol>(
    event: T,
    fn: (...args: any[]) => void,
    context?: Context
  ): () => void {
    super.addListener(event, fn, context);
    return () => {
      this.removeListener(event, fn, context);
    };
  }
  override once<T extends string | symbol>(
    event: T,
    fn: (...args: any[]) => void,
    context?: Context
  ): () => void {
    super.once(event, fn, context);
    return () => {
      this.off(event, fn, context, true);
    };
  }
  // 添加防抖监听器
  onDebounce<T extends string | symbol>(
    event: T,
    fn: (...args: any[]) => void,
    wait: number,
    context?: Context
  ) {
    fn = this._debounce(fn, wait);
    return this.on(event, fn, context);
  }
  // 添加节流监听器
  onThrottle<T extends string | symbol>(
    event: T,
    fn: (...args: any[]) => void,
    wait: number,
    context?: Context
  ) {
    fn = this._throttle(fn, wait);
    return this.on(event, fn, context);
  }
  onDebounceHtmlEvent<K extends keyof HTMLElementEventMap>(
    htmlElement: HTMLElement,
    type: K,
    fn: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    wait: number,
    opt?: boolean | AddEventListenerOptions
  ): () => void {
    fn = this._debounce(fn, wait);
    return this.addHtmlListener(htmlElement, type, fn, opt);
  }
  onThrottleHtmlEvent<K extends keyof HTMLElementEventMap>(
    htmlElement: HTMLElement,
    type: K,
    fn: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    wait: number,
    opt?: boolean | AddEventListenerOptions
  ): () => void {
    fn = this._throttle(fn, wait);
    return this.addHtmlListener(htmlElement, type, fn, opt);
  }
  onHtmlEvent<K extends keyof HTMLElementEventMap>(
    htmlElement: HTMLElement,
    type: K,
    fn: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    opt?: boolean | AddEventListenerOptions
  ): () => void {
    return this.addHtmlListener(htmlElement, type, fn, opt);
  }
  addHtmlListener<K extends keyof HTMLElementEventMap>(
    htmlElement: HTMLElement,
    type: K,
    fn: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    opt?: boolean | AddEventListenerOptions
  ): () => void {
    htmlElement.addEventListener(type, fn, opt);
    return () => {
      htmlElement.removeEventListener(type, fn, opt);
    };
  }
  onceEvents<T extends string | symbol>(
    eventNames: T[],
    fn: (...args: any[]) => void,
    context?: Context
  ): () => void {
    return this.addOnceListeners(eventNames, fn, context);
  }
  addOnceListeners<T extends string | symbol>(
    eventNames: T[],
    fn: (...args: any[]) => void,
    context?: Context
  ): () => void {
    const arr = [...eventNames];
    // arr去重
    const arr_new = Array.from(new Set(arr));
    const destoryEvents: (() => void)[] = [];
    arr_new.forEach((eventName) => {
      const destoryEvent = this.on(
        eventName,
        (...args: any[]) => {
          arr.splice(arr.indexOf(eventName), 1);
          if (!arr.includes(eventName)) {
            const i = destoryEvents.indexOf(destoryEvent);
            if (i > -1) {
              destoryEvents.splice(i, 1);
            }
            destoryEvent();
          }
          if (arr.length === 0) {
            fn.apply(context || this, args);
          }
        },
        context
      );
      destoryEvents.push(destoryEvent);
    });
    return () => {
      destoryEvents.forEach((destoryEvent) => {
        destoryEvent();
      });
    };
  }
  bindOnce<T extends string | symbol>(
    eventName: T,
    fn: (...args: any[]) => void,
    context?: Context
  ) {
    return this.once(eventName, fn, context);
  }
  bind<T extends string | symbol>(
    eventName: T,
    fn: (...args: any[]) => void,
    context?: Context
  ) {
    return this.on(eventName, fn, context);
  }
  fire<T extends string | symbol>(eventName: T, ...args: any[]) {
    return super.emit(eventName, ...args);
  }
  unbind<T extends string | symbol>(
    eventName: T,
    fn: (...args: any[]) => void,
    context?: Context,
    once?: boolean
  ) {
    return super.off(eventName, fn, context, once);
  }
  un<T extends string | symbol>(
    eventName: T,
    fn: (...args: any[]) => void,
    context?: Context,
    once?: boolean
  ) {
    return super.off(eventName, fn, context, once);
  }
  onceByExecCount<T extends string | symbol>(
    event: T,
    fn: (...args: any[]) => void,
    execCount: number = 1,
    context?: Context
  ): () => void {
    const destroyEvent = this.on(
      event,
      (...args: any[]) => {
        execCount--;
        if (execCount === 0) {
          fn.apply(context || this, args);
          destroyEvent();
        }
      },
      context
    );
    return destroyEvent;
  }

  onceWithMaxWaitTime<T extends string | symbol>(
    event: T,
    fn: (...args: any[]) => void,
    maxTime: number,
    context?: Context
  ): () => void {
    let timer: any = undefined;
    const fn_new = (...args: any[]) => {
      fn.apply(context || this, args);
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
    };
    let destroyEvent: (() => void) | undefined = this.once(
      event,
      fn_new,
      context
    );
    timer = setTimeout(() => {
      if (destroyEvent) {
        destroyEvent();
        destroyEvent = undefined;
      }
      fn.apply(context || this);
    }, maxTime);
    return () => {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      if (destroyEvent) {
        destroyEvent();
        destroyEvent = undefined;
      }
    };
  }

  addOnceListenersWithMaxWaitTime<T extends string | symbol>(
    eventNames: T[],
    fn: (...args: any[]) => void,
    maxTime: number,
    context?: Context
  ): () => void {
    let timer: any = undefined;
    const fn_new = (...args: any[]) => {
      fn.apply(context || this, args);
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
    };
    let destroyEvent: (() => void) | undefined = this.addOnceListeners(
      eventNames,
      fn_new,
      context
    );
    timer = setTimeout(() => {
      if (destroyEvent) {
        destroyEvent();
        destroyEvent = undefined;
      }
      fn.apply(context || this);
    }, maxTime);
    return () => {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      if (destroyEvent) {
        destroyEvent();
        destroyEvent = undefined;
      }
    };
  }

  onceEventsWithMaxWaitTime<T extends string | symbol>(
    eventNames: T[],
    fn: (...args: any[]) => void,
    maxTime: number,
    context?: Context
  ): () => void {
    return this.addOnceListenersWithMaxWaitTime(
      eventNames,
      fn,
      maxTime,
      context
    );
  }

  oncePromise<T extends string | symbol>(
    event: T,
    context?: Context
  ): Promise<any[]> {
    return new Promise<any[]>((resolve) => {
      this.once(
        event,
        (...args: any[]) => {
          resolve(args);
        },
        context
      );
    });
  }

  onceEventsPromise<T extends string | symbol>(
    eventNames: T[],
    context?: Context
  ): Promise<any[]> {
    return new Promise<any[]>((resolve) => {
      this.onceEvents(
        eventNames,
        (...args: any[]) => {
          resolve(args);
        },
        context
      );
    });
  }

  onceByExecCountPromise<T extends string | symbol>(
    event: T,
    execCount: number = 1,
    context?: Context
  ): Promise<any[]> {
    return new Promise<any[]>((resolve) => {
      this.onceByExecCount(
        event,
        (...args: any[]) => {
          resolve(args);
        },
        execCount,
        context
      );
    });
  }

  onceWithMaxWaitTimePromise<T extends string | symbol>(
    event: T,
    maxTime: number,
    context?: Context
  ): Promise<any[]> {
    return new Promise<any[]>((resolve) => {
      this.onceWithMaxWaitTime(
        event,
        (...args: any[]) => {
          resolve(args);
        },
        maxTime,
        context
      );
    });
  }

  onceEventsWithMaxWaitTimePromise<T extends string | symbol>(
    eventNames: T[],
    maxTime: number,
    context?: Context
  ): Promise<any[]> {
    return new Promise<any[]>((resolve) => {
      this.onceEventsWithMaxWaitTime(
        eventNames,
        (...args: any[]) => {
          resolve(args);
        },
        maxTime,
        context
      );
    });
  }
  // 防抖
  private _debounce(fn: (...args: any[]) => void, wait: number) {
    let timer: any = undefined;
    return (...args: any[]) => {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, wait);
    }
  }
  // 节流
  private _throttle(fn: (...args: any[]) => void, wait: number) {
    let lastTime: number = 0;
    return (...args: any[]) => {
      const nowTime = Date.now();
      if (nowTime - lastTime >= wait) {
        fn.apply(this, args);
        lastTime = nowTime;
      }
    }
  }
}

export { EventEmitterSuper };
export default EventEmitterSuper;
