export const memoise = (fn: () => unknown) => {
    let wasCalled = false;
    let result: unknown;
    return () => {
        if (wasCalled) return result;
        result = fn();
        wasCalled = true;
        return result;
    }
}