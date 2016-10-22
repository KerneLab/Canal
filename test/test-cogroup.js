QUnit.test("cogroup()", function(assert)
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ], [ "c", 4 ] ])
			.cogroup(Canal.of([ [ "b", 1 ], [ "c", 2 ] ])).collect();
	console.log(JSON.stringify(result));
	assert.propEqual(result, [ [ "a", [ [ 1 ], [] ] ],
			[ "b", [ [ 2, 3 ], [ 1 ] ] ], [ "c", [ [ 4 ], [ 2 ] ] ] ]);
});

QUnit.test("cogroup() 1 vs empty", function(assert)
{
	var result = Canal.of([ [ "a", 1 ] ]).cogroup(Canal.of([])).collect();
	assert.propEqual(result, [ [ "a", [ [ 1 ], [] ] ] ]);
});

QUnit.test("cogroup() empty vs 1", function(assert)
{
	var result = Canal.of([]).cogroup(Canal.of([ [ "a", 1 ] ])).collect();
	assert.propEqual(result, [ [ "a", [ [], [ 1 ] ] ] ]);
});

QUnit.test("cogroup() 2 vs 3 vs 1", function(assert)
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ] ]).cogroup(
			Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ] ]),
			Canal.of([ [ "c", 4 ] ])).collect();
	assert.propEqual(result, [ [ "a", [ [ 1 ], [ 1 ], [] ] ],
			[ "b", [ [ 2 ], [ 2, 3 ], [] ] ], [ "c", [ [], [], [ 4 ] ] ] ]);
});

QUnit.test("cogroup() empty vs empty", function(assert)
{
	var result = Canal.of([]).cogroup(Canal.of([])).collect();
	assert.propEqual(result, []);
});
