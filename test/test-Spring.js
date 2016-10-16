QUnit.test("Spring", function(assert)
{
	var result = Canal.of(function(index)
	{
		if (index < 3)
		{
			return index;
		}
		else
		{
			return Canal.eod();
		}
	}).collect();
	assert.propEqual(result, [ 0, 1, 2 ]);
});
