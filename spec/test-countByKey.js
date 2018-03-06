var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test countByKey", function(){

it("countByKey()", function()
{
	var result = Canal.of([ [ "a", 1 ], [ "a", 2 ], [ "b", 3 ] ]).countByKey();
	expect(result).to.eql({
		"a" : 2,
		"b" : 1
	});
});

it("countByKey() 1", function()
{
	var result = Canal.of([ [ "a", 1 ] ]).countByKey();
	expect(result).to.eql({
		"a" : 1
	});
});

it("countByKey() empty", function()
{
	var result = Canal.of([]).countByKey();
	expect(result).to.eql({});
});

});
