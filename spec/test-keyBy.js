var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test keyBy", function()
{
	var kop = function(d)
	{
		return d + ".";
	};

	it("keyBy() 1 2 3", function()
	{
		var result = Canal.of([ 1, 2, 3 ]) //
		.keyBy(kop).collect();
		expect(result).to.eql([ [ "1.", 1 ], [ "2.", 2 ], [ "3.", 3 ] ]);
	});

	it("keyBy() 1", function()
	{
		var result = Canal.of([ 1 ]) //
		.keyBy(kop).collect();
		expect(result).to.eql([ [ "1.", 1 ] ]);
	});

	it("keyBy() empty", function()
	{
		var result = Canal.of([]) //
		.keyBy(kop).collect();
		expect(result).to.eql([]);
	});
});
