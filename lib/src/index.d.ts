export declare function safeGet<TStart, TEnd>(start: TStart, get: (start: TStart) => TEnd): TEnd | undefined;
export declare function parseAccessChain(fnText: string): string[];
