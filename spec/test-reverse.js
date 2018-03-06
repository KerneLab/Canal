var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test reverse", function(){

it("reverse() 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.reverse().collect();
	expect(result).to.eql([ 3, 2, 1 ]);
});

it("reverse() 1", function()
{
	var result = Canal.of([ 1 ]) //
	.reverse().collect();
	expect(result).to.eql([ 1 ]);
});

it("reverse() empty", function()
{
	var result = Canal.of([]) //
	.reverse().collect();
	expect(result).to.eql([]);
});

});
