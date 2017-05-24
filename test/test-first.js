QUnit.test("first()", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).first().or("_");
	assert.propEqual(result, 1);
});

QUnit.test("first() empty", function(assert)
{
	var result = Canal.of([]).first().or("_");
	assert.propEqual(result, "_");
});

QUnit.test("first(pred)", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).first(function(d)
	{
		return d > 2;
	}).or("_");
	assert.propEqual(result, 2);
});

QUnit.test("first(pred) empty", function(assert)
{
	var result = Canal.of([]).first(function(d)
	{
		return d > 2;
	}).or("_");
	assert.propEqual(result, "_");
});
