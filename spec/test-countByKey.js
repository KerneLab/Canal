var Canal = require('../canal');

describe("Test countByKey", function(){

it("countByKey()", function()
{
	var result = Canal.of([ [ "a", 1 ], [ "a", 2 ], [ "b", 3 ] ]).countByKey();
	expect(result).toEqual({
		"a" : 2,
		"b" : 1
	});
});

it("countByKey() 1", function()
{
	var result = Canal.of([ [ "a", 1 ] ]).countByKey();
	expect(result).toEqual({
		"a" : 1
	});
});

it("countByKey() empty", function()
{
	var result = Canal.of([]).countByKey();
	expect(result).toEqual({});
});

});
