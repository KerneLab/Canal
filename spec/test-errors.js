var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test Errors", function()
{
	it("throws loop exception", function()
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
});
