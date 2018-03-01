var Canal = require('../canal');

describe("Test fold", function(){

it("fold()", function()
{
	var result = Canal.of([ 1, 2, 3 ]).fold({}, function(res, dat)
	{
		res[dat + "."] = dat;
		return res;
	});
	expect(result).toEqual({
		"1." : 1,
		"2." : 2,
		"3." : 3
	});
});

it("fold() 1", function()
{
	var result = Canal.of([ 1 ]).fold({}, function(res, dat)
	{
		res[dat + "."] = dat;
		return res;
	});
	expect(result).toEqual({
		"1." : 1
	});
});

it("fold() empty", function()
{
	var result = Canal.of([]).fold({}, function(res, dat)
	{
		res[dat + "."] = dat;
		return res;
	});
	expect(result).toEqual({});
});

});
