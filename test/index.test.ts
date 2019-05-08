import * as mocha from 'mocha';
import { expect } from 'chai';
import { parseAccessChain, safeGet } from '../src/index'

describe('safeGet', () => {

    let test = {
        a:{
            b:{
                c:{
                    d:{
                        e: 7
                    }
                }
            }
        }
    }

    it('speedtest', function() {

        let test2: typeof test = {
            a:{
                b:<typeof test.a.b>{

                }
            }
        }

        function safeGetClassical <TEnd>(get: () => TEnd): TEnd | undefined {
            try {
                return get();
            } catch (ex) {
                return undefined;
            }
        }

        this.timeout(5 * 60 * 1000);

        console.time("classical throw");
        for(let count = 1000 * 1000; count > 0; count--){
            safeGetClassical(() => test2.a.b.c.d.e);
        }
        console.timeEnd('classical throw');

        console.time("classical happy");
        for(let count = 1000 * 1000; count > 0; count--){
            safeGetClassical(() => test.a.b.c.d.e);
        }
        console.timeEnd('classical happy');

        console.time("parser throw");
        for(let count = 1000 * 1000; count > 0; count--){
            safeGet(test2, (x) => x.a.b.c.d.e);
        }
        console.timeEnd('parser throw');

        console.time("parser happy");
        for(let count = 1000 * 1000; count > 0; count--){
            safeGet(test, (x) => x.a.b.c.d.e);
        }
        console.timeEnd('parser happy');


    });

    it('can get deep inside', () => {

        const val = safeGet(test, (x) => x.a.b.c.d.e);
    
        expect(val).to.equal(7);
    });

    it('does not throw', () => {

        let test2: typeof test = {
            a:{
                b:<typeof test.a.b>{

                }
            }
        }

        const val = safeGet(test2, (x) => x.a.b.c.d.e);
    
        expect(val).to.equal(undefined);
    });

    it('can handle functions with no chain in them', () => {

        const val = safeGet(test, (x) => x);
    
        expect(val).to.equal(test);
    });

});

describe('parseAccessChain ', () => {

    it('can ahndle simple arrows', () => {

        let text = '(a) => a.b.c.d.e';

        var chain = parseAccessChain(text);

        expect(chain.toString()).to.equal('a,b,c,d,e', text);

        text = 'a => a.b.c.d.e';

        chain = parseAccessChain(text);

        expect(chain.toString()).to.equal('a,b,c,d,e', text);

        text = 'a => { return a.b.c.d.e }';

        chain = parseAccessChain(text);

        expect(chain.toString()).to.equal('a,b,c,d,e', text);;

        text = `(a) => 
        a.b.c.d.e`;

        var chain = parseAccessChain(text);

        expect(chain.toString()).to.equal('a,b,c,d,e', text);

        text = `a => 
        a.b.c.d.e`;

        chain = parseAccessChain(text);

        expect(chain.toString()).to.equal('a,b,c,d,e', text);

        text = `a => { 
            return a.b.c.d.e;
        }`;

        chain = parseAccessChain(text);

        expect(chain.toString()).to.equal('a,b,c,d,e', text);
    });

    it('can ahndle fulll functions', () => {

        let text = 'function(a) {return a.b.c.d.e}';

        var chain = parseAccessChain(text);

        expect(chain.toString()).to.equal('a,b,c,d,e', text);

        text = 'function(a) {return a.b.c.d.e;}';

        chain = parseAccessChain(text);

        expect(chain.toString()).to.equal('a,b,c,d,e', text);

        text = `function(a) {
            return a.b.c.d.e;
        }`;

        var chain = parseAccessChain(text);

        expect(chain.toString()).to.equal('a,b,c,d,e', text);
    });
   
    it('rejects anything but dot access', () => {

        let text = '(a) => a["b"]c';

        expect(() => parseAccessChain(text)).to.throw()

        text = '(a) => a[\'b\']c';

        expect(() => parseAccessChain(text)).to.throw();

        text = '(a) => //g';

        expect(() => parseAccessChain(text)).to.throw();

        text = '(a) => \'';

        expect(() => parseAccessChain(text)).to.throw();

        text = '(a) => "';

        expect(() => parseAccessChain(text)).to.throw();

        text = '(a) => ;;';

        expect(() => parseAccessChain(text)).to.throw();

        text = '(a) => ,';

        expect(() => parseAccessChain(text)).to.throw();
    });

});