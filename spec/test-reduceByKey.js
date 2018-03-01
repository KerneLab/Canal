var Canal = require('../canal');

describe("Test reduceByKey", function(){

it("reduceByKey()", function()
{
	var result = Canal.of([ [ "a", 1 ], [ "a", 2 ], [ "b", 4 ] ]) //
	.reduceByKey(function(a, b)
	{
		return a + b;
	}).collect();
	expect(result).toEqual([ [ "a", 3 ], [ "b", 4 ] ]);
});

});
