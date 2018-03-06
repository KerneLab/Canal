var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test countByValue", function(){

it("countByValue()", function()
{
	var result = Canal.of([ 1, 2, 3, 3 ]).countByValue();
	expect(result).to.eql({
		"1" : 1,
		"2" : 1,
		"3" : 2
	});
});

it("countByValue() 1", function()
{
	var result = Canal.of([ 1 ]).countByValue();
	expect(result).to.eql({
		"1" : 1
	});
});

it("countByValue() empty", function()
{
	var result = Canal.of([]).countByValue();
	expect(result).to.eql({});
});

});
