var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test stratifyWith", function()
{

	it("stratifyWith()", function()
	{
		var result = Canal.of([ {
			"id" : 4
		}, {
			"id" : 3
		}, {
			"id" : 1
		}, {
			"id" : 3
		} ]).stratifyWith(function(a, b)
		{
			return a.id - b.id;
		}, false).collect();

		expect(result).to.eql([ [ {
			"id" : 4
		} ], [ {
			"id" : 3
		}, {
			"id" : 3
		} ], [ {
			"id" : 1
		} ] ]);
	});

	it("stratifyWith() partially 1", function()
	{
		var result = Canal.of([ {
			"id" : 4
		}, {
			"id" : 3
		}, {
			"id" : 1
		}, {
			"id" : 3
		} ]).stratifyWith(function(a, b)
		{
			return a.id - b.id;
		}, false).take(1);

		expect(result).to.eql([ [ {
			"id" : 4
		} ] ]);
	});

	it("stratifyWith() partially 2", function()
	{
		var result = Canal.of([ {
			"id" : 4
		}, {
			"id" : 3
		}, {
			"id" : 1
		}, {
			"id" : 3
		} ]).stratifyWith(function(a, b)
		{
			return a.id - b.id;
		}, false).take(2);

		expect(result).to.eql([ [ {
			"id" : 4
		} ], [ {
			"id" : 3
		}, {
			"id" : 3
		} ] ]);
	});

	it("stratifyWith(null)", function()
	{
		var result = Canal.of([ {
			"id" : 4
		}, {
			"id" : 3
		}, {
			"id" : 1
		}, {
			"id" : 3
		} ]).stratifyWith(null).collect();

		expect(result).to.eql([ [ {
			"id" : 4
		}, {
			"id" : 3
		}, {
			"id" : 1
		}, {
			"id" : 3
		} ] ]);
	});

});
