QUnit.test("groupByKey() 0:1 1:2 0:3", function(assert)
{
	var result = Canal.of([ [ 0, 1 ], [ 1, 2 ], [ 0, 3 ] ]) //
	.groupByKey().collect();
	assert.propEqual(result, [ [ "0", [ 1, 3 ] ], [ "1", [ 2 ] ] ]);
});

QUnit.test("groupByKey() 0:1", function(assert)
{
	var result = Canal.of([ [ 0, 1 ] ]) //
	.groupByKey().collect();
	assert.propEqual(result, [ [ "0", [ 1 ] ] ]);
});

QUnit.test("groupByKey() empty", function(assert)
{
	var result = Canal.of([]) //
	.groupByKey().collect();
	assert.propEqual(result, []);
});
