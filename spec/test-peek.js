var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test peek", function(){

it("peek() 1 2 3", function()
{
	var buffer = [];
	var result = Canal.of([ 1, 2, 3 ]).peek(function(d)
	{
		buffer.push(d + 0.5);
	}).collect();
	expect(result).to.eql([ 1, 2, 3 ]);
	expect(buffer).to.eql([ 1.5, 2.5, 3.5 ]);
});

it("peek() 1 2 3 take(2)", function()
{
	var buffer = [];
	var result = Canal.of([ 1, 2, 3 ]).peek(function(d)
	{
		buffer.push(d + 0.5);
	}).take(2);
	expect(result).to.eql([ 1, 2 ]);
	expect(buffer).to.eql([ 1.5, 2.5 ]);
});

it("peek() 1", function()
{
	var buffer = [];
	var result = Canal.of([ 1 ]).peek(function(d)
	{
		buffer.push(d + 0.2);
	}).collect();
	expect(result).to.eql([ 1 ]);
	expect(buffer).to.eql([ 1.2 ]);
});

it("peek() empty", function()
{
	var buffer = [];
	var result = Canal.of([]).peek(function(d)
	{
		buffer.push(d + 0.5);
	}).collect();
	expect(result).to.eql([]);
	expect(buffer).to.eql([]);
});

});
