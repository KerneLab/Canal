QUnit.test("off() Array", function(assert)
{
	Canal.on(Array);

	var result = [ 1, 2, 3 ].canal().count();

	assert.propEqual(result, 3);

	Canal.off(Array);

	var other = null;
	try
	{
		[ 1, 2, 3 ].canal().count();
		other = 1;
	}
	catch (e)
	{
		other = 2;
	}

	assert.propEqual(other, 2);
});

QUnit.test("off() Array key", function(assert)
{
	Canal.on(Array, "$");

	var result = [ 1, 2, 3 ].$().count();

	assert.propEqual(result, 3);

	Canal.off(Array, "$");

	var other = null;
	try
	{
		[ 1, 2, 3 ].$().count();
		other = 1;
	}
	catch (e)
	{
		other = 2;
	}

	assert.propEqual(other, 2);
});
