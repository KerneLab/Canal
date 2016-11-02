QUnit.test("values() 3", function(assert)
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]).values()
			.collect();
	assert.propEqual(result, [ 1, 2, 3 ]);
});

QUnit.test("values() 1", function(assert)
{
	var result = Canal.of([ [ "a", 1 ] ]).values().collect();
	assert.propEqual(result, [ 1 ]);
});

QUnit.test("values() empty", function(assert)
{
	var result = Canal.of([]).values().collect();
	assert.propEqual(result, []);
});
