QUnit.test("stratifyWith()", function(assert)
{
	var result = Canal.of([ {
		"id" : 4
	}, {
		"id" : 3
	}, {
		"id" : 1
	}, {
		"id" : 3
	} ]).stratifyWith(function(a, b)
	{
		return a.id - b.id;
	}, false).collect();

	assert.propEqual(result, 
	[ 
	    [ {
			"id" : 4
		} ], 
		[ {
			"id" : 3
		}, {
			"id" : 3
		} ], 
		[ {
			"id" : 1
		} ] 
    ]);
});

QUnit.test("stratifyWith(null)", function(assert)
{
	var result = Canal.of([ {
		"id" : 4
	}, {
		"id" : 3
	}, {
		"id" : 1
	}, {
		"id" : 3
	} ]).stratifyWith(null).collect();

	assert.propEqual(result, 
	[ 
	    [ {
		"id" : 4
		}, {
			"id" : 3
		}, {
			"id" : 1
		}, {
			"id" : 3
		} ]
    ]);
});
