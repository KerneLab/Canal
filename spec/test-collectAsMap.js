var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test collectAsMap", function(){

it("collectAsMap()", function()
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ])
			.collectAsMap();
	expect(result).to.eql({
		"a" : 1,
		"b" : 2,
		"c" : 3
	});
});

it("collectAsMap() 1", function()
{
	var result = Canal.of([ [ "a", 1 ] ]).collectAsMap();
	expect(result).to.eql({
		"a" : 1
	});
});

it("collectAsMap() empty", function()
{
	var result = Canal.of([]).collectAsMap();
	expect(result).to.eql({});
});

});
