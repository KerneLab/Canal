QUnit.test("flatten() [1 2]", function(assert)
{
	var result = Canal.of([ [ 1, 2 ], [ 2, 3 ], [ 3, 4 ] ]) //
	.flatten().collect();
	assert.propEqual(result, [ [ 1, 2 ], [ 2, 3 ], [ 3, 4 ] ]);
});

QUnit.test("flatten() [1 [2 3]]", function(assert)
{
	var result = Canal
			.of([ [ 1, [ 2, 3 ] ], [ 2, [ 3, 4 ] ], [ 3, [ 4, 5 ] ] ]) //
			.flatten().collect();
	assert.propEqual(result, [ [ 1, 2, 3 ], [ 2, 3, 4 ], [ 3, 4, 5 ] ]);
});

QUnit.test("flatten() [1 [2 3] 4]", function(assert)
{
	var result = Canal.of(
			[ [ 1, [ 2, 3 ], 4 ], [ 2, [ 3, 4 ], 5 ], [ 3, [ 4, 5 ], 6 ] ]) //
	.flatten().collect();
	assert
			.propEqual(result,
					[ [ 1, 2, 3, 4 ], [ 2, 3, 4, 5 ], [ 3, 4, 5, 6 ] ]);
});

QUnit.test("flatten() [1 [2 [3]]]", function(assert)
{
	var result = Canal.of(
			[ [ 1, [ 2, [ 3 ] ] ], [ 2, [ 3, [ 4 ] ] ], [ 3, [ 4, [ 5 ] ] ] ]) //
	.flatten().collect();
	assert.propEqual(result, [ [ 1, 2, 3 ], [ 2, 3, 4 ], [ 3, 4, 5 ] ]);
});

QUnit.test("flatten(1) [1 [2 [3]]]", function(assert)
{
	var result = Canal.of(
			[ [ 1, [ 2, [ 3 ] ] ], [ 2, [ 3, [ 4 ] ] ], [ 3, [ 4, [ 5 ] ] ] ]) //
	.flatten(1).collect();
	assert.propEqual(result, [ [ 1, 2, [ 3 ] ], [ 2, 3, [ 4 ] ],
			[ 3, 4, [ 5 ] ] ]);
});

QUnit.test("flatten() [[[1] 2] 3]", function(assert)
{
	var result = Canal.of(
			[ [ [ [ 1 ], 2 ], 3 ], [ [ [ 2 ], 3 ], 4 ], [ [ [ 3 ], 4 ], 5 ] ]) //
	.flatten().collect();
	assert.propEqual(result, [ [ 1, 2, 3 ], [ 2, 3, 4 ], [ 3, 4, 5 ] ]);
});

QUnit.test("flatten(1) [[[1] 2] 3]", function(assert)
{
	var result = Canal.of(
			[ [ [ [ 1 ], 2 ], 3 ], [ [ [ 2 ], 3 ], 4 ], [ [ [ 3 ], 4 ], 5 ] ]) //
	.flatten(1).collect();
	assert.propEqual(result, [ [ [ 1 ], 2, 3 ], [ [ 2 ], 3, 4 ],
			[ [ 3 ], 4, 5 ] ]);
});
