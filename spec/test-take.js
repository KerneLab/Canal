var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test take", function(){

it("take(1) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).take(1);
	expect(result).to.eql([ 1 ]);
});

it("take(3) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).take(3);
	expect(result).to.eql([ 1, 2, 3 ]);
});

it("take(4) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).take(4);
	expect(result).to.eql([ 1, 2, 3 ]);
});

it("take(0) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).take(0);
	expect(result).to.eql([]);
});

it("take(1) empty", function()
{
	var result = Canal.of([]).take(1);
	expect(result).to.eql([]);
});

});
