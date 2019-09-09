"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cache = new Map();
function safeGet(start, get) {
    var fnText = get.toString();
    var propChain;
    if (cache.has(fnText)) {
        propChain = cache.get(fnText);
    }
    else {
        propChain = parseAccessChain(fnText);
        propChain = propChain.slice(1);
        cache.set(fnText, propChain);
    }
    var res = start;
    for (var _i = 0, propChain_1 = propChain; _i < propChain_1.length; _i++) {
        var key = propChain_1[_i];
        if (res === null || res === undefined) {
            return undefined;
        }
        res = res[key];
    }
    return res;
}
exports.safeGet = safeGet;
function parseAccessChain(fnText) {
    var indexOfOpeningCurlyBrace = fnText.indexOf('{');
    var indexOfArrow = fnText.indexOf('=>');
    var chainText = '';
    if (indexOfOpeningCurlyBrace > -1) {
        var indexOfClosingCurlyBrace = fnText.indexOf('}');
        chainText = fnText.slice(indexOfOpeningCurlyBrace + 1, indexOfClosingCurlyBrace);
    }
    else if (indexOfArrow > -1) {
        chainText = fnText.slice(indexOfArrow + 2);
    }
    chainText = chainText.trim();
    if (chainText.startsWith("return ")) {
        chainText = chainText.slice(7);
    }
    if (chainText.endsWith(";")) {
        chainText = chainText.slice(0, chainText.length - 1);
    }
    chainText = chainText.trim();
    var badSymbolsMatch = chainText.search(/\[|"|'|`|{|,|;|\\|\(|\)|\//g);
    if (badSymbolsMatch > -1) {
        throw Error("Found bad symbol " + chainText.slice(badSymbolsMatch, badSymbolsMatch + 3) + " in string " + fnText + ". Only x => x.a.b.c.d; supported.");
    }
    var chain = chainText
        .split('.')
        .map(function (x) { return x.trim(); })
        .filter(function (x) { return x.length > 0; });
    return chain;
}
exports.parseAccessChain = parseAccessChain;
//# sourceMappingURL=index.js.map