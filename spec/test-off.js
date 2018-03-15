var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test off", function()
{
	it("off() Array", function()
	{
		Canal.on(Array);

		var result = [ 1, 2, 3 ].canal().count();

		expect(result).to.eql(3);

		Canal.off(Array);

		var other = 1;
		try
		{
			[ 1, 2, 3 ].canal().count();
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

		var other = 1;
		try
		{
			[ 1, 2, 3 ].$().count();
		}
		catch (e)
		{
			other = 2;
		}

		expect(other).to.eql(2);
	});
});
