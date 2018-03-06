var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test collect", function(){

it("collect()", function()
{
	var result = Canal.of([ 1, 2, 3 ]).collect();
	expect(result).to.eql([ 1, 2, 3 ]);
});

it("collect() 1", function()
{
	var result = Canal.of([ 1 ]).collect();
	expect(result).to.eql([ 1 ]);
});

it("collect() empty", function()
{
	var result = Canal.of([]).collect();
	expect(result).to.eql([]);
});

});
