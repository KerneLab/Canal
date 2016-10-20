QUnit.test("groupBy() 0:1 1:2 0:3", function(assert)
{
	var result = Canal.of([ [ 0, 1 ], [ 1, 2 ], [ 0, 3 ] ]) //
	.groupBy().collect();
	assert.propEqual(result, [ [ "0", [ 1, 3 ] ], [ "1", [ 2 ] ] ]);
});

QUnit.test("groupBy() 0:1", function(assert)
{
	var result = Canal.of([ [ 0, 1 ] ]) //
	.groupBy().collect();
	assert.propEqual(result, [ [ "0", [ 1 ] ] ]);
});

QUnit.test("groupBy() empty", function(assert)
{
	var result = Canal.of([]) //
	.groupBy().collect();
	assert.propEqual(result, []);
});
