"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var index_1 = require("../src/index");
describe('safeGet', function () {
    var test = {
        a: {
            b: {
                c: {
                    d: {
                        e: 7
                    }
                }
            }
        }
    };
    it('can get deep inside', function () {
        var val = index_1.safeGet(test, function (x) { return x.a.b.c.d.e; });
        chai_1.expect(val).to.equal(7);
    });
    it('does not throw', function () {
        var test2 = {
            a: {
                b: {}
            }
        };
        var val = index_1.safeGet(test2, function (x) { return x.a.b.c.d.e; });
        chai_1.expect(val).to.equal(undefined);
    });
    it('can handle functions with no chain in them', function () {
        var val = index_1.safeGet(test, function (x) { return x; });
        chai_1.expect(val).to.equal(test);
    });
});
describe('parseAccessChain ', function () {
    it('can ahndle simple arrows', function () {
        var text = '(a) => a.b.c.d.e';
        var chain = index_1.parseAccessChain(text);
        chai_1.expect(chain.toString()).to.equal('a,b,c,d,e', text);
        text = 'a => a.b.c.d.e';
        chain = index_1.parseAccessChain(text);
        chai_1.expect(chain.toString()).to.equal('a,b,c,d,e', text);
        text = 'a => { return a.b.c.d.e }';
        chain = index_1.parseAccessChain(text);
        chai_1.expect(chain.toString()).to.equal('a,b,c,d,e', text);
        ;
        text = "(a) => \n        a.b.c.d.e";
        var chain = index_1.parseAccessChain(text);
        chai_1.expect(chain.toString()).to.equal('a,b,c,d,e', text);
        text = "a => \n        a.b.c.d.e";
        chain = index_1.parseAccessChain(text);
        chai_1.expect(chain.toString()).to.equal('a,b,c,d,e', text);
        text = "a => { \n            return a.b.c.d.e;\n        }";
        chain = index_1.parseAccessChain(text);
        chai_1.expect(chain.toString()).to.equal('a,b,c,d,e', text);
    });
    it('can ahndle fulll functions', function () {
        var text = 'function(a) {return a.b.c.d.e}';
        var chain = index_1.parseAccessChain(text);
        chai_1.expect(chain.toString()).to.equal('a,b,c,d,e', text);
        text = 'function(a) {return a.b.c.d.e;}';
        chain = index_1.parseAccessChain(text);
        chai_1.expect(chain.toString()).to.equal('a,b,c,d,e', text);
        text = "function(a) {\n            return a.b.c.d.e;\n        }";
        var chain = index_1.parseAccessChain(text);
        chai_1.expect(chain.toString()).to.equal('a,b,c,d,e', text);
    });
    it('rejects anything but dot access', function () {
        var text = '(a) => a["b"]c';
        chai_1.expect(function () { return index_1.parseAccessChain(text); }).to.throw();
        text = '(a) => a[\'b\']c';
        chai_1.expect(function () { return index_1.parseAccessChain(text); }).to.throw();
        text = '(a) => //g';
        chai_1.expect(function () { return index_1.parseAccessChain(text); }).to.throw();
        text = '(a) => \'';
        chai_1.expect(function () { return index_1.parseAccessChain(text); }).to.throw();
        text = '(a) => "';
        chai_1.expect(function () { return index_1.parseAccessChain(text); }).to.throw();
        text = '(a) => ;;';
        chai_1.expect(function () { return index_1.parseAccessChain(text); }).to.throw();
        text = '(a) => ,';
        chai_1.expect(function () { return index_1.parseAccessChain(text); }).to.throw();
    });
});
//# sourceMappingURL=index.test.js.map