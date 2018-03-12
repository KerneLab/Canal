var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test Errors", function()
{
	it("errors when loop relys", function()
	{
		var c1 = Canal.of([ 1, 2, 3 ]);

		var c2 = c1.map(function(d)
		{
			return d + 1;
		});

		c1.upstream(c2);

		var error = false;

		try
		{
			c2.collect();
		}
		catch (e)
		{
			error = true;
		}

		expect(error).to.be(true);
	});

	it("errors when adds null opr", function()
	{
		var c = Canal.of([ 1, 2, 3 ]);

		var error = false;

		try
		{
			c.add(null);
		}
		catch (e)
		{
			error = true;
		}

		expect(error).to.be(true);
	});

	it("errors when converges to null pond", function()
	{
		var c = new Canal();

		var error = false;

		try
		{
			c.converge(null, [ 1, 2, 3 ]);
		}
		catch (e)
		{
			error = true;
		}

		expect(error).to.be(true);
	});

	it("errors when converges from null data", function()
	{
		var c = new Canal();

		var error = false;

		try
		{
			c.converge({}, null);
		}
		catch (e)
		{
			error = true;
		}

		expect(error).to.be(true);
	});

	it("errors when evaluates null opr", function()
	{
		var c = Canal.of([ 1, 2, 3 ]);

		var error = false;

		try
		{
			c.evaluate(null);
		}
		catch (e)
		{
			error = true;
		}

		expect(error).to.be(true);
	});
});
