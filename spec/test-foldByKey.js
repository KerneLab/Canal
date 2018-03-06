var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test foldByKey", function(){

it("foldByKey()", function()
{
	var result = Canal.of([ [ "a", 1 ], [ "a", 2 ], [ "b", 4 ] ]).foldByKey(
			function()
			{
				return 0;
			}, function(a, b)
			{
				return a + b;
			}).collect();
	expect(result).to.eql([ [ "a", 3 ], [ "b", 4 ] ]);
});

});
