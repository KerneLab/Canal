var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test off", function(){

it("off() Array", function()
{
	Canal.on(Array);

	var result = [ 1, 2, 3 ].canal().count();

	expect(result).to.eql(3);

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

	expect(other).to.eql(2);
});

it("off() Array key", function()
{
	Canal.on(Array, "$");

	var result = [ 1, 2, 3 ].$().count();

	expect(result).to.eql(3);

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

	expect(other).to.eql(2);
});

});
