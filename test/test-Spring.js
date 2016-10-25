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

QUnit.test("Spring close", function(assert)
{
	var closed = false;
	var number = 0;
	var result = Canal.of(function(index)
	{
		if (index < 5)
		{
			return index;
		}
		else
		{
			return Canal.eod();
		}
	}, function(n)
	{
		closed = true;
		number = n;
	}).take(2);
	assert.propEqual(result, [ 0, 1 ]);
	assert.propEqual(closed, true);
	assert.propEqual(number, 2);
});
