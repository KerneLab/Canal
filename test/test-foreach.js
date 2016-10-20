QUnit.test("foreach() 1 2 3", function(assert)
{
	var buffer = [];
	var result = Canal.of([ 1, 2, 3 ]).foreach(function(d)
	{
		buffer.push(d + 0.5);
	}).collect();
	assert.propEqual(result, [ 1, 2, 3 ]);
	assert.propEqual(buffer, [ 1.5, 2.5, 3.5 ]);
});

QUnit.test("foreach() 1", function(assert)
{
	var buffer = [];
	var result = Canal.of([ 1 ]).foreach(function(d)
	{
		buffer.push(d + 0.2);
	}).collect();
	assert.propEqual(result, [ 1 ]);
	assert.propEqual(buffer, [ 1.2 ]);
});

QUnit.test("foreach() empty", function(assert)
{
	var buffer = [];
	var result = Canal.of([]).foreach(function(d)
	{
		buffer.push(d + 0.5);
	}).collect();
	assert.propEqual(result, []);
	assert.propEqual(buffer, []);
});
