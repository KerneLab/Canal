var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test mapWithState", function()
{
	var mapper = function(d, st)
	{
		try
		{
			return [ d / 2, st[0] ];
		}
		finally
		{
			st[0] = d;
		}
	};

	it("mapWithState() 1 2 3", function()
	{
		var result = Canal.of([ 1, 2, 3 ]) //
		.mapWithState([ null ], mapper).collect();
		expect(result).to.eql([ [ 0.5, null ], [ 1, 1 ], [ 1.5, 2 ] ]);
	});

	it("mapWithState() 1 2 3 produce", function()
	{
		var result = Canal.of([ 1, 2, 3 ]) //
		.mapWithState(function()
		{
			return [ null ];
		}, mapper).collect();
		expect(result).to.eql([ [ 0.5, null ], [ 1, 1 ], [ 1.5, 2 ] ]);
	});

	it("mapWithState() 1", function()
	{
		var result = Canal.of([ 1 ]) //
		.mapWithState([ null ], mapper).collect();
		expect(result).to.eql([ [ 0.5, null ] ]);
	});

	it("mapWithState() empty", function()
	{
		var result = Canal.of([]) //
		.mapWithState([ null ], mapper).collect();
		expect(result).to.eql([]);
	});
});
