var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test until", function(){

it("until(2) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.until(function(d){return d>=2;}).collect();
	expect(result).to.eql([ 1 ]);
});

it("until(4) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.until(function(d){return d>=4;}).collect();
	expect(result).to.eql([ 1, 2, 3 ]);
});

it("until(2,drop) 1 2 3", function()
{
	var drop = [];
	var result = Canal.of([ 1, 2, 3 ]) //
	.until(function(d){return d>=2;}, drop).collect();
	expect(result).to.eql([ 1 ]);
	expect(drop[0].get()).to.eql(2);
});

it("until(4,drop) 1 2 3", function()
{
	var drop = [];
	var result = Canal.of([ 1, 2, 3 ]) //
	.until(function(d){return d>=4;}, drop).collect();
	expect(result).to.eql([ 1, 2, 3 ]);
	expect(drop[0].given()).to.eql(false);
});

});
