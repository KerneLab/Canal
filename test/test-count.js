QUnit.test("count()", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).count();
	assert.propEqual(result, 3);
});

QUnit.test("count() empty", function(assert)
{
	var result = Canal.of([]).count();
	assert.propEqual(result, 0);
});
