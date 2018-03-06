var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test mapJoint", function(){

it("mapJoint()", function()
{
	var result = Canal.of([ [ "key", [ "L", "0" ] ] ]).mapJoint(function(l, r, k)
	{
		return k + ":" + "(" + l + "," + r + ")";
	}).collect();
	expect(result).to.eql([ "key:(L,0)" ]);
});

});
