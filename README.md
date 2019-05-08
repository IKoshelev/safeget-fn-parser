# safeget-fn-parser

Access long property chains like (x) => x.a.b.c.d; safely with null/undefined coalescing.
Works by parsing function text, can handle both classical JS functions and fat-arrow functions.

Available via NPM:

`npm install safeget-fn-parser`

```typescript
    const val = safeGet(test, (x) => x.a.b.c.d.e);
```

Will go through the chain while it can, will return `undefined` 
if property access on a `null` or `undefined` is attempted. 

This only makes sense for simple cases with `.` access, 
so no `[]` access is allowed.

# What is the point?

Why not just wrap function invocation into `try...catch`?
Exceptions are at-least 2 orders of magnitude slower than normal loop access (when they do throw).

Why not use generics and `keyof` like here?
https://stackoverflow.com/a/47223501/882936
```
export function nullSafe<T, 
    K0 extends keyof T, 
    K1 extends keyof T[K0],
    K2 extends keyof T[K0][K1],
    ...>
    (obj: T, k0: K0, k1?: K1, k2?: K2, ...) {
        ...
    });
```

That approach works fine, but has flaw - VSCode won't show you 
such access via 'Find all references' and similar commands.
For enterprise applications laden with business logic, this is bad.  