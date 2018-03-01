var Canal = require('../canal');

describe("Test groupByKey", function(){

it("groupByKey() 0:1 1:2 0:3", function()
{
	var result = Canal.of([ [ 0, 1 ], [ 1, 2 ], [ 0, 3 ] ]) //
	.groupByKey().collect();
	expect(result).toEqual([ [ "0", [ 1, 3 ] ], [ "1", [ 2 ] ] ]);
});

it("groupByKey() 0:1", function()
{
	var result = Canal.of([ [ 0, 1 ] ]) //
	.groupByKey().collect();
	expect(result).toEqual([ [ "0", [ 1 ] ] ]);
});

it("groupByKey() empty", function()
{
	var result = Canal.of([]) //
	.groupByKey().collect();
	expect(result).toEqual([]);
});

});
