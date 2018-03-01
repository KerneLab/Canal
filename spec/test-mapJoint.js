var Canal = require('../canal');

describe("Test mapJoint", function(){

it("mapJoint()", function()
{
	var result = Canal.of([ [ "key", [ "L", "0" ] ] ]).mapJoint(function(l, r, k)
	{
		return k + ":" + "(" + l + "," + r + ")";
	}).collect();
	expect(result).toEqual([ "key:(L,0)" ]);
});

});
