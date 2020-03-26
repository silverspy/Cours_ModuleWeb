const chai = require('chai');
var expect = chai.expect;

const multiply = function(a, b){
    return a*b;
}

describe('multiply fonction', function() {
    it('should multiply 2 numbers', ()=>{
        const a = 3;
        const b = 2;
        const result = multiply(a, b);

        const expected = 6
        expect(result).to.equal(expected);
    })
})