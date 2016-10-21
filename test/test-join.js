QUnit.test("join()", function(assert)
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ], [ "c", 4 ] ])
			.join(Canal.of([ [ "b", 1 ], [ "c", 2 ], [ "d", 3 ] ])).collect();
	assert.propEqual(result, [ [ "b", [ 2, 1 ] ], [ "b", [ 3, 1 ] ],
			[ "c", [ 4, 2 ] ] ]);
});

QUnit.test("join() 1 vs empty", function(assert)
{
	var result = Canal.of([ [ "a", 1 ] ]).join(Canal.of([])).collect();
	assert.propEqual(result, []);
});

QUnit.test("join() empty vs 1", function(assert)
{
	var result = Canal.of([]).join(Canal.of([ [ "b", 1 ] ])).collect();
	assert.propEqual(result, []);
});

QUnit.test("join() empty vs empty", function(assert)
{
	var result = Canal.of([]).join(Canal.of([])).collect();
	assert.propEqual(result, []);
});
