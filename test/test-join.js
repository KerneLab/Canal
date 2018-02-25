QUnit.test("join()", function(assert)
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ], [ "c", 4 ] ]).join(
			Canal.of([ [ "b", 1 ], [ "c", 2 ], [ "d", 3 ] ])).collect();
	assert.propEqual(result, [ [ "b", [ 2, 1 ] ], [ "b", [ 3, 1 ] ], [ "c", [ 4, 2 ] ] ]);
});

QUnit.test("join() kop, vop", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.join(Canal.of([ {
		id : 1,
		name : "Mike"
	}, {
		id : 2,
		name : "John"
	}, {
		id : 3,
		name : "Rose"
	}, {
		id : 4,
		name : "Bob"
	} ]), Canal.unit, function(d)
	{
		return d.id;
	}, Canal.unit, Canal.unit).collect();

	assert.propEqual(result, [ [ "1", [ 1, {
		id : 1,
		name : "Mike"
	} ] ], [ "2", [ 2, {
		id : 2,
		name : "John"
	} ] ], [ "3", [ 3, {
		id : 3,
		name : "Rose"
	} ] ] ]);
});

QUnit.test("join() 1 vs empty", function(assert)
{
	var result = Canal.of([ [ "a", 1 ] ]).join(Canal.of([])).collect();
	assert.propEqual(result, []);
});

QUnit.test("join() empty vs 1", function(assert)
{
	var result = Canal.of([]).join(Canal.of([ [ "b", 1 ] ])).collect();
	assert.propEqual(result, []);
});

QUnit.test("join() empty vs empty", function(assert)
{
	var result = Canal.of([]).join(Canal.of([])).collect();
	assert.propEqual(result, []);
});
