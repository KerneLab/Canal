QUnit.test("collect()", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).collect();
	assert.propEqual(result, [ 1, 2, 3 ]);
});

QUnit.test("collect() empty", function(assert)
{
	var result = Canal.of([]).collect();
	assert.propEqual(result, []);
});
