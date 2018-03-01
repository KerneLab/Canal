var Canal = require('../canal');

describe("Test collectAsMap", function(){

it("collectAsMap()", function()
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ])
			.collectAsMap();
	expect(result).toEqual({
		"a" : 1,
		"b" : 2,
		"c" : 3
	});
});

it("collectAsMap() 1", function()
{
	var result = Canal.of([ [ "a", 1 ] ]).collectAsMap();
	expect(result).toEqual({
		"a" : 1
	});
});

it("collectAsMap() empty", function()
{
	var result = Canal.of([]).collectAsMap();
	expect(result).toEqual({});
});

});
