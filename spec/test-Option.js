var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test Option", function()
{
	it("Some()", function()
	{
		var result = Canal.Some(1);

		expect(result.map(function(d)
		{
			return d + 1;
		}).collect()).to.eql([ 2 ]);

		expect(result.or(2)).to.eql(1);

		expect(result.given()).to.be(true);

		expect(result.orNull()).to.be(1);
	});

	it("None()", function()
	{
		var result = Canal.None();

		expect(result.collect()).to.eql([]);

		expect(result.or(2)).to.eql(2);

		expect(result.given()).to.be(false);

		expect(result.orNull()).to.be(null);
	});
});
