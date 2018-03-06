var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test keys", function(){

it("keys() 3", function()
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]).keys()
			.collect();
	expect(result).to.eql([ "a", "b", "c" ]);
});

it("keys() 1", function()
{
	var result = Canal.of([ [ "a", 1 ] ]).keys().collect();
	expect(result).to.eql([ "a" ]);
});

it("keys() empty", function()
{
	var result = Canal.of([]).keys().collect();
	expect(result).to.eql([]);
});

});
