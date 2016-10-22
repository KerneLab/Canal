QUnit.test("countByValue()", function(assert)
{
	var result = Canal.of([ 1, 2, 3, 3 ]).countByValue();
	assert.propEqual(result, {
		"1" : 1,
		"2" : 1,
		"3" : 2
	});
});

QUnit.test("countByValue() 1", function(assert)
{
	var result = Canal.of([ 1 ]).countByValue();
	assert.propEqual(result, {
		"1" : 1
	});
});

QUnit.test("countByValue() empty", function(assert)
{
	var result = Canal.of([]).countByValue();
	assert.propEqual(result, {});
});
