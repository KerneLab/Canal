var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test mapValues", function()
{
	it("mapValues()", function()
	{
		var result = Canal.of([ [ "K1", [ 1, 2 ] ], [ "K2", [ 4 ] ] ]) //
		.mapValues(function(array)
		{
			var sum = 0;
			for ( var i in array)
			{
				sum += array[i];
			}
			return sum;
		}).collect();

		expect(result).to.eql([ [ "K1", 3 ], [ "K2", 4 ] ]);
	});
});
