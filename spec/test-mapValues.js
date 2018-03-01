var Canal = require('../canal');

describe("Test mapValues", function(){

it("mapValues()", function()
{
	var result = Canal.of([ [ "K1", [ 1, 2 ] ], [ "K2", [ 4 ] ] ]).mapValues(
			function(array)
			{
				var sum = 0;
				for ( var i in array)
				{
					sum += array[i];
				}
				return sum;
			}).collect();
	expect(result).toEqual([ [ "K1", 3 ], [ "K2", 4 ] ]);
});

});
