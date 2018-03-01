var Canal = require('../canal');

describe("Test Spring", function(){

it("Spring", function()
{
	var result = Canal.of(function(index)
	{
		if (index < 3)
		{
			return index;
		}
		else
		{
			return Canal.eod();
		}
	}).collect();
	expect(result).toEqual([ 0, 1, 2 ]);
});

it("Spring close", function()
{
	var closed = false;
	var number = 0;
	var result = Canal.of(function(index)
	{
		if (index < 5)
		{
			return index;
		}
		else
		{
			return Canal.eod();
		}
	}, function(n)
	{
		closed = true;
		number = n;
	}).take(2);
	expect(result).toEqual([ 0, 1 ]);
	expect(closed).toBe(true);
	expect(number).toBe(2);
});

});
