var Canal = require('../canal');

describe("Test Option", function(){

it("Some()", function()
{
	var result = Canal.Some(1).map(function(d)
	{
		return d + 1;
	}).collect();

	expect(result).toEqual([ 2 ]);
});

it("None()", function()
{
	var result = Canal.None().collect();

	expect(result).toEqual([]);
});

});
