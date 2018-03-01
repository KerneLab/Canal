var Canal = require('../canal');

describe("Test off", function(){

it("off() Array", function()
{
	Canal.on(Array);

	var result = [ 1, 2, 3 ].canal().count();

	expect(result).toEqual(3);

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

	expect(other).toEqual(2);
});

it("off() Array key", function()
{
	Canal.on(Array, "$");

	var result = [ 1, 2, 3 ].$().count();

	expect(result).toEqual(3);

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

	expect(other).toEqual(2);
});

});
