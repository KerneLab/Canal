var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test fold", function()
{
	var folder = function(res, dat)
	{
		res[dat + "."] = dat;
		return res;
	};

	it("fold()", function()
	{
		var result = Canal.of([ 1, 2, 3 ]).fold({}, folder);
		expect(result).to.eql({
			"1." : 1,
			"2." : 2,
			"3." : 3
		});
	});

	it("fold() 1", function()
	{
		var result = Canal.of([ 1 ]).fold({}, folder);
		expect(result).to.eql({
			"1." : 1
		});
	});

	it("fold() empty", function()
	{
		var result = Canal.of([]).fold({}, folder);
		expect(result).to.eql({});
	});

	it("fold() until 1 2", function()
	{
		var result = Canal.of([ 1, 2, 3 ]).fold(function()
		{
			return {};
		}, folder, function(r)
		{
			return r["2."] != null;
		}).or("_");
		expect(result).to.eql({
			"1." : 1,
			"2." : 2
		});
	});

	it("fold() until empty", function()
	{
		var result = Canal.of([]).fold({}, folder, null);
		expect(result).to.eql({});
	});

	it("fold() until empty", function()
	{
		var result = Canal.of([ 1, 2, 3 ]).fold(function()
		{
			return {};
		}, folder, null).or("_");
		expect(result).to.eql({
			"1." : 1,
			"2." : 2,
			"3." : 3
		});
	});
});
