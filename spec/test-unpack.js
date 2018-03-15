var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test unpack", function()
{
	var unpacker = function(a, b)
	{
		return a + b;
	};

	it("unpack() 3", function()
	{
		var result = Canal.of([ [ 1, 2 ], [ 2, 3 ], [ 3, 4 ] ]) //
		.unpack(unpacker).collect();
		expect(result).to.eql([ 3, 5, 7 ]);
	});

	it("unpack() 1", function()
	{
		var result = Canal.of([ [ 1, 2, 3 ] ]) //
		.unpack(function(a, b, c)
		{
			return a * b;
		}).collect();
		expect(result).to.eql([ 2 ]);
	});

	it("unpack() empty", function()
	{
		var result = Canal.of([]) //
		.unpack(unpacker).collect();
		expect(result).to.eql([]);
	});
});
