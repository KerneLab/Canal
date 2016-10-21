QUnit.test("mapJoint()", function(assert)
{
	var result = Canal.of([ [ "key", [ "L", "0" ] ] ]).mapJoint(function(l, r, k)
	{
		return k + ":" + "(" + l + "," + r + ")";
	}).collect();
	assert.propEqual(result, [ "key:(L,0)" ]);
});
