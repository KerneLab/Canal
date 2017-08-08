QUnit.test("having() 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).groupBy(function(d)
	{
		return d % 2;
	}).having(function(grp)
	{
		return grp.length > 1;
	}).values().flatMap().collect();
	assert.propEqual(result, [ 1, 3 ]);
});
