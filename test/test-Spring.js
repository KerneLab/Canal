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
	}, function()
	{
		console.log("closing");
		closed = true;
	}).collect();
	assert.propEqual(result, [ 0, 1, 2 ]);
	assert.propEqual(closed, true);
});
