var Canal = require('../canal');

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
	expect(result).toEqual([ [ "a", 3 ], [ "b", 4 ] ]);
});

});
