QUnit.test("keys() 3", function(assert)
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]).keys()
			.collect();
	assert.propEqual(result, [ "a", "b", "c" ]);
});

QUnit.test("keys() 1", function(assert)
{
	var result = Canal.of([ [ "a", 1 ] ]).keys().collect();
	assert.propEqual(result, [ "a" ]);
});

QUnit.test("keys() empty", function(assert)
{
	var result = Canal.of([]).keys().collect();
	assert.propEqual(result, []);
});
