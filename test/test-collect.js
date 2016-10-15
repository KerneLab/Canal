QUnit.test("collect", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).collect();
	assert.equal(result.length, 3);
	assert.equal(result[0], 1);
	assert.equal(result[1], 2);
	assert.equal(result[2], 3);
});
