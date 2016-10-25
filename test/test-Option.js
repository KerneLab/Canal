QUnit.test("Some()", function(assert)
{
	var result = Canal.Some(1).map(function(d)
	{
		return d + 1;
	}).collect();

	assert.propEqual(result, [ 2 ]);
});

QUnit.test("None()", function(assert)
{
	var result = Canal.None().collect();

	assert.propEqual(result, []);
});
