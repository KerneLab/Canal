QUnit.test("flatMap() 1->2", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).flatMap(function(d)
	{
		return [ d, d + 0.5 ];
	}).collect();
	assert.propEqual(result, [ 1, 1.5, 2, 2.5, 3, 3.5 ]);
});

QUnit.test("flatMap() 1->1", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).flatMap(function(d)
	{
		return [ d + 0.5 ];
	}).collect();
	assert.propEqual(result, [ 1.5, 2.5, 3.5 ]);
});

QUnit.test("flatMap() 1->0", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).flatMap(function(d)
	{
		return [];
	}).collect();
	assert.propEqual(result, []);
});

QUnit.test("flatMap() empty", function(assert)
{
	var result = Canal.of([]).flatMap(function(d)
	{
		return [ d, d + 0.5 ];
	}).collect();
	assert.propEqual(result, []);
});
