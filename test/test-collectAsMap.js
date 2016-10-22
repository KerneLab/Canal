QUnit.test("collectAsMap()", function(assert)
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ])
			.collectAsMap();
	assert.propEqual(result, {
		"a" : 1,
		"b" : 2,
		"c" : 3
	});
});

QUnit.test("collectAsMap() 1", function(assert)
{
	var result = Canal.of([ [ "a", 1 ] ]).collectAsMap();
	assert.propEqual(result, {
		"a" : 1
	});
});

QUnit.test("collectAsMap() empty", function(assert)
{
	var result = Canal.of([]).collectAsMap();
	assert.propEqual(result, {});
});
