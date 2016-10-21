QUnit.test("mergeByKey()", function(assert)
{
	var result = Canal.of([ [ "a", 1 ], [ "a", 2 ], [ "b", 4 ] ]).mergeByKey(
			function()
			{
				return 0;
			}, function(a, b)
			{
				return a + b;
			}).collect();
	assert.propEqual(result, [ [ "a", 3 ], [ "b", 4 ] ]);
});
