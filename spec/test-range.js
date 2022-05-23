var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test range", function()
{
	it("range(1, 5)", function()
	{
		var result = Canal.of(Canal.range(1, 5)).collect();
		expect(result).to.eql([ 1, 2, 3, 4 ]);
	});

	it("range(1, 5, 2)", function()
	{
		var result = Canal.of(Canal.range(1, 5, 2)).collect();
		expect(result).to.eql([ 1, 3 ]);
	});

	it("range(1, 5, -1)", function()
	{
		var result = Canal.of(Canal.range(1, 5, -1)).collect();
		expect(result).to.eql([ ]);
	});

	it("range(5, 1, -1)", function()
	{
		var result = Canal.of(Canal.range(5, 1, -1)).collect();
		expect(result).to.eql([ 5, 4, 3, 2 ]);
	});

	it("range(5, 1, -2)", function()
	{
		var result = Canal.of(Canal.range(5, 1, -2)).collect();
		expect(result).to.eql([ 5, 3 ]);
	});

	it("range(5, 1, 1)", function()
	{
		var result = Canal.of(Canal.range(5, 1, 1)).collect();
		expect(result).to.eql([ ]);
	});
	
	it("range(5, 1, 0)", function()
	{
		var result = Canal.of(Canal.range(5, 1, 0)).collect();
		expect(result).to.eql([ ]);
	});
});
