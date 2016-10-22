QUnit.test("fold()", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).fold({}, function(res, dat)
	{
		res[dat + "."] = dat;
		return res;
	});
	assert.propEqual(result, {
		"1." : 1,
		"2." : 2,
		"3." : 3
	});
});

QUnit.test("fold() 1", function(assert)
{
	var result = Canal.of([ 1 ]).fold({}, function(res, dat)
	{
		res[dat + "."] = dat;
		return res;
	});
	assert.propEqual(result, {
		"1." : 1
	});
});

QUnit.test("fold() empty", function(assert)
{
	var result = Canal.of([]).fold({}, function(res, dat)
	{
		res[dat + "."] = dat;
		return res;
	});
	assert.propEqual(result, {});
});
