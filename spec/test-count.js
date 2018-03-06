var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test count", function(){

it("count()", function()
{
	var result = Canal.of([ 1, 2, 3 ]).count();
	expect(result).to.eql(3);
});

it("count() empty", function()
{
	var result = Canal.of([]).count();
	expect(result).to.eql(0);
});

});
