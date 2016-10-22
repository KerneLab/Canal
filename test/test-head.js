QUnit.test("head()", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).head().or("_");
	assert.propEqual(result, 1);
});

QUnit.test("head() empty", function(assert)
{
	var result = Canal.of([]).head().or("_");
	assert.propEqual(result, "_");
});
