var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test select", function()
{
	it("select()", function()
	{
		var f = Canal.col;
		
		var result = Canal.of([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00},
			{"id":"4","grp":"1","rnk":2,"sal":1300.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00}
		]).select("id",
				f("grp"),
				f("rnk").as("rank"),
				f(function(d){return d.sal+1000;}).as("salplus"),
				f(null).as("null")
		).collect();
		
		expect(result).to.eql([
			{"id":"1","grp":"1","rank":1,"salplus":2000.00,"null":null},
			{"id":"2","grp":"1","rank":1,"salplus":2100.00,"null":null},
			{"id":"3","grp":"1","rank":2,"salplus":2200.00,"null":null},
			{"id":"4","grp":"1","rank":2,"salplus":2300.00,"null":null},
			{"id":"5","grp":"1","rank":3,"salplus":2400.00,"null":null},
			{"id":"6","grp":"2","rank":1,"salplus":2500.00,"null":null},
			{"id":"7","grp":"2","rank":1,"salplus":2600.00,"null":null},
			{"id":"8","grp":"2","rank":2,"salplus":2700.00,"null":null}
		]);
	});
	
	it("select() with mapping", function()
	{
		var f = Canal.col;
		
		var result = Canal.of([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00},
			{"id":"4","grp":"1","rnk":2,"sal":1300.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00}
		]).select({
			"index":"id",
			"group":"grp",
			"rank":"rnk",
			"sales":"sal",
			"null":null
		}).collect();
		
		expect(result).to.eql([
			{"index":"1","group":"1","rank":1,"sales":1000.00,"null":null},
			{"index":"2","group":"1","rank":1,"sales":1100.00,"null":null},
			{"index":"3","group":"1","rank":2,"sales":1200.00,"null":null},
			{"index":"4","group":"1","rank":2,"sales":1300.00,"null":null},
			{"index":"5","group":"1","rank":3,"sales":1400.00,"null":null},
			{"index":"6","group":"2","rank":1,"sales":1500.00,"null":null},
			{"index":"7","group":"2","rank":1,"sales":1600.00,"null":null},
			{"index":"8","group":"2","rank":2,"sales":1700.00,"null":null}
		]);
	});
});
