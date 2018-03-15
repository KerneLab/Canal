var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test Item", function()
{
	it("aggr", function()
	{
		var result = Canal.wf.lead(function(d)
		{
			return d.data;
		});

		expect(typeof result.aggregator()).to.be("function");
	});

	it("expr", function()
	{
		var result = Canal.wf.lead(function(d)
		{
			return d.data;
		});

		expect(typeof result.expressor()).to.be("function");
	});

	it("updt", function()
	{
		var result = Canal.wf.cume_dist();

		expect(typeof result.updater()).to.be("function");
	});

	it("alias", function()
	{
		var result = Canal.wf.count().as("cnt");

		expect(result.as()).to.be("cnt");
	});

	it("partBy", function()
	{
		var result = Canal.wf.max(function(d)
		{
			return d.val;
		}).partBy(function(d)
		{
			return d.id;
		}, function(d)
		{
			return d.grp;
		});

		expect(typeof result.partBy()).to.be("object");
	});

	it("orderBy", function()
	{
		var result = Canal.wf.max(function(d)
		{
			return d.val;
		}).orderBy(function(d)
		{
			return d.score;
		}, function(d)
		{
			return d.sales;
		}, false);

		expect(typeof result.orderBy()).to.be("object");
	});

	it("between", function()
	{
		var result = Canal.wf.max(function(d)
		{
			return d.val;
		}).rows().between(-1, 2);

		expect(result.between()).to.eql([ -1, 2 ]);
	});
});
