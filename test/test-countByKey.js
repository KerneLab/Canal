QUnit.test("countByKey()", function(assert)
{
	var result = Canal.of([ [ "a", 1 ], [ "a", 2 ], [ "b", 3 ] ]).countByKey();
	assert.propEqual(result, {
		"a" : 2,
		"b" : 1
	});
});

QUnit.test("countByKey() 1", function(assert)
{
	var result = Canal.of([ [ "a", 1 ] ]).countByKey();
	assert.propEqual(result, {
		"a" : 1
	});
});

QUnit.test("countByKey() empty", function(assert)
{
	var result = Canal.of([]).countByKey();
	assert.propEqual(result, {});
});
