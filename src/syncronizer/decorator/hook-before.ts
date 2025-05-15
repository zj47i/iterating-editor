export function HookBefore<T>(hookFn: (this: T) => void) {
  return function <
    K extends keyof T,
    F extends (...args: any[]) => any
  >(
    _target: T,
    _propertyKey: K,
    descriptor: TypedPropertyDescriptor<F>
  ): void {
    const original = descriptor.value;
    if (!original) return;

    descriptor.value = function (this: T, ...args: Parameters<F>): ReturnType<F> {
      hookFn.call(this);
      const result = original.apply(this, args);
      return result;
    } as unknown as F;
  };
}
