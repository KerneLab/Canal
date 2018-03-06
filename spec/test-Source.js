var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test Source", function(){

it("Source", function()
{
	var result = Canal.of([ 0, 1, 2, 3 ]).collect();
	expect(result).to.eql([ 0, 1, 2, 3 ]);
});

it("Source begin", function()
{
	var result = Canal.of([ 0, 1, 2, 3 ], 1).collect();
	expect(result).to.eql([ 1, 2, 3 ]);
});

it("Source end", function()
{
	var result = Canal.of([ 0, 1, 2, 3 ], null, 3).collect();
	expect(result).to.eql([ 0, 1, 2 ]);
});

it("Source begin end", function()
{
	var result = Canal.of([ 0, 1, 2, 3 ], 1, 3).collect();
	expect(result).to.eql([ 1, 2 ]);
});

});
