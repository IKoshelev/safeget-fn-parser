const cache = new Map<string, string[]>();

export function safeGet<TStart, TEnd>(start: TStart, get: (start: TStart) => TEnd): TEnd | undefined {

    const fnText = get.toString();
    let propChain: string[];

    if (cache.has(fnText)) {
        propChain = <string[]>cache.get(fnText);
    } else {
        propChain = parseAccessChain(fnText);
        propChain = propChain.slice(1);
        cache.set(fnText, propChain);
    }

    let res: any = start;

    for (let key of propChain) {
        if (res === null || res === undefined) {
            return undefined;
        }
        res = res[key];
    }

    return res;
}

export function parseAccessChain(fnText: string): string[] {
    const indexOfOpeningCurlyBrace = fnText.indexOf('{');
    const indexOfArrow = fnText.indexOf('=>');

    let chainText = '';
    if (indexOfOpeningCurlyBrace > -1) {
        const indexOfClosingCurlyBrace = fnText.indexOf('}');
        chainText = fnText.slice(indexOfOpeningCurlyBrace + 1, indexOfClosingCurlyBrace);
    } else if (indexOfArrow > -1) {
        chainText = fnText.slice(indexOfArrow + 2);
    }

    chainText = chainText.trim();
    if(chainText.startsWith("return ")){
        chainText = chainText.slice(7);
    }

    if(chainText.endsWith(";")){
        chainText = chainText.slice(0, chainText.length - 1);
    }
    chainText = chainText.trim();

    const badSymbolsMatch = chainText.search(/\[|"|'|`|{|,|;|\\|\//g);
    if (badSymbolsMatch > -1) {
        throw Error(`Found bad symbol ${chainText.slice(badSymbolsMatch, badSymbolsMatch + 3)} in string ${fnText}. Only x => x.a.b.c.d; supported.`);
    }

    const chain = chainText
                    .split('.')
                    .map(x => x.trim())
                    .filter(x => x.length > 0);

    return chain;
}