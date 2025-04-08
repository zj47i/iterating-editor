export function Hook<T>(hookFn: (this: T) => void) {
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
      const result = original.apply(this, args);
      hookFn.call(this);
      return result;
    } as unknown as F;
  };
}
