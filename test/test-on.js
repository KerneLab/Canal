QUnit.test("on() Array", function(assert)
{
	Canal.on(Array);

	var result = [ 1, 2, 3 ].canal().count();

	assert.propEqual(result, 3);
});

QUnit.test("on() Array key", function(assert)
{
	Canal.on(Array, "$");

	var result = [ 1, 2, 3 ].$().count();

	assert.propEqual(result, 3);
});

QUnit.test("on() Array .canal(args)", function(assert)
{
	Canal.on(Array);

	var result = [ 1, 2, 3, 4, 5 ].canal(1, 4).collect();

	assert.propEqual(result, [ 2, 3, 4 ]);
});
