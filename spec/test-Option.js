var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test Option", function(){

it("Some()", function()
{
	var result = Canal.Some(1).map(function(d)
	{
		return d + 1;
	}).collect();

	expect(result).to.eql([ 2 ]);
});

it("None()", function()
{
	var result = Canal.None().collect();

	expect(result).to.eql([]);
});

});
