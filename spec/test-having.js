var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test having", function(){

it("having() 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).groupBy(function(d)
	{
		return d % 2;
	}).having(function(grp)
	{
		return grp.length > 1;
	}).values().flatMap().collect();
	expect(result).to.eql([ 1, 3 ]);
});

});
