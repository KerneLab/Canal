var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test sortWith", function(){

it("sortWith() 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.sortWith().collect();
	expect(result).to.eql([ 1, 2, 3 ]);
});

it("sortWith() 3 2 1", function()
{
	var result = Canal.of([ 3, 2, 1 ]) //
	.sortWith().collect();
	expect(result).to.eql([ 1, 2, 3 ]);
});

it("sortWith(null,false) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.sortWith(null, false).collect();
	expect(result).to.eql([ 3, 2, 1 ]);
});

it("sortWith(cmp) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.sortWith(function(a, b)
	{
		return a - b;
	}).collect();
	expect(result).to.eql([ 1, 2, 3 ]);
});

it("sortWith(cmp,false) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.sortWith(function(a, b)
	{
		return a - b;
	}, false).collect();
	expect(result).to.eql([ 3, 2, 1 ]);
});

it("sortWith() empty", function()
{
	var result = Canal.of([]) //
	.sortWith().collect();
	expect(result).to.eql([]);
});

});
