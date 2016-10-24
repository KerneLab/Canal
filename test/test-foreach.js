QUnit.test("foreach()", function(assert)
{
	var result = [];
	Canal.of([ 1, 2, 3 ]).foreach(function(d, i)
	{
		result.push(d + "-" + i);
	});
	assert.propEqual(result, [ "1-0", "2-1", "3-2" ]);
});

QUnit.test("foreach() 1", function(assert)
{
	var result = [];
	Canal.of([ 1 ]).foreach(function(d, i)
	{
		result.push(d + "-" + i);
	});
	assert.propEqual(result, [ "1-0" ]);
});

QUnit.test("foreach() empty", function(assert)
{
	var result = [];
	Canal.of([]).foreach(function(d, i)
	{
		result.push(d + "-" + i);
	});
	assert.propEqual(result, []);
});
