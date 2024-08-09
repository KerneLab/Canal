var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test forall", function(){

it("forall(>0) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).forall(function(d){return d>0;});
	expect(result).to.eql(true);
});

it("forall(>1) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).forall(function(d){return d>1;});
	expect(result).to.eql(false);
});

it("forall(>1) empty", function()
{
	var result = Canal.of([ ]).forall();
	expect(result).to.eql(true);
});
});
