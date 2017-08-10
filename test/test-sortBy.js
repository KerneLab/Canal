QUnit.test("sortBy() desc", function(assert)
{
	var result = Canal.of([ {
		"id" : 3,
		"score" : 32
	}, {
		"id" : 1,
		"score" : 12
	}, {
		"id" : 2,
		"score" : 23
	}, {
		"id" : 1,
		"score" : 22
	} ]) //
	.sortBy(function(d)
	{
		return d.id;
	}, false).collect();

	assert.propEqual(result, [ {
		"id" : 3,
		"score" : 32
	}, {
		"id" : 2,
		"score" : 23
	}, {
		"id" : 1,
		"score" : 12
	}, {
		"id" : 1,
		"score" : 22
	} ]);
});

QUnit.test("sortBy() asc desc", function(assert)
{
	var result = Canal.of([ {
		"id" : 3,
		"score" : 32
	}, {
		"id" : 1,
		"score" : 12
	}, {
		"id" : 2,
		"score" : 23
	}, {
		"id" : 1,
		"score" : 22
	} ]) //
	.sortBy(function(d)
	{
		return d.id;
	}, function(d)
	{
		return d.score;
	}, false).collect();

	assert.propEqual(result, [ {
		"id" : 1,
		"score" : 22
	}, {
		"id" : 1,
		"score" : 12
	}, {
		"id" : 2,
		"score" : 23
	}, {
		"id" : 3,
		"score" : 32
	} ]);
});

QUnit.test("sortBy([asc desc])", function(assert)
{
	var result = Canal.of([ {
		"id" : 3,
		"score" : 32
	}, {
		"id" : 1,
		"score" : 12
	}, {
		"id" : 2,
		"score" : 23
	}, {
		"id" : 1,
		"score" : 22
	} ]) //
	.sortBy([function(d)
	{
		return d.id;
	}, function(d)
	{
		return d.score;
	}, false]).collect();

	assert.propEqual(result, [ {
		"id" : 1,
		"score" : 22
	}, {
		"id" : 1,
		"score" : 12
	}, {
		"id" : 2,
		"score" : 23
	}, {
		"id" : 3,
		"score" : 32
	} ]);
});
