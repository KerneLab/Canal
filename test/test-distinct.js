QUnit.test("distinct() 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).distinct().collect();
	assert.propEqual(result, [ 1, 2, 3 ]);
});

QUnit.test("distinct().take(2) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).distinct().take(2);
	assert.propEqual(result, [ 1, 2 ]);
});

QUnit.test("distinct().take(0) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).distinct().take(0);
	assert.propEqual(result, []);
});

QUnit.test("distinct() 1 2 2", function(assert)
{
	var result = Canal.of([ 1, 2, 2 ]).distinct().collect();
	assert.propEqual(result, [ 1, 2 ]);
});

QUnit.test("distinct().take(1) 1 2 2", function(assert)
{
	var result = Canal.of([ 1, 2, 2 ]).distinct().take(1);
	assert.propEqual(result, [ 1 ]);
});

QUnit.test("distinct() 1 1", function(assert)
{
	var result = Canal.of([ 1, 1 ]).distinct().collect();
	assert.propEqual(result, [ 1 ]);
});

QUnit.test("distinct() 1", function(assert)
{
	var result = Canal.of([ 1 ]).distinct().collect();
	assert.propEqual(result, [ 1 ]);
});

QUnit.test("distinct().take(1) 1", function(assert)
{
	var result = Canal.of([ 1 ]).distinct().take(1);
	assert.propEqual(result, [ 1 ]);
});

QUnit.test("distinct() empty", function(assert)
{
	var result = Canal.of([]).distinct().collect();
	assert.propEqual(result, []);
});
