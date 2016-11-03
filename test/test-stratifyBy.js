QUnit.test("stratifyBy()", function(assert)
{
	var result = Canal.of([ {
		"id" : 4
	}, {
		"id" : 3
	}, {
		"id" : 1
	}, {
		"id" : 3
	} ]).stratifyBy(function(d)
	{
		return d.id;
	}, true).collect();

	assert.propEqual(result, 
	[ 
	    [ {
			"id" : 1
		} ], 
		[ {
			"id" : 3
		}, {
			"id" : 3
		} ], 
		[ {
			"id" : 4
		} ] 
    ]);
});
