var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test window", function()
{
	var dataSource = [
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":undefined},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00},
		{"id":"9","grp":"2","rnk":null,"sal":1800.00}
	];
	
	var dataSource1 = [
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1000.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	];
	
	it("window() row_number", function()
	{
		var rn = Canal.wf.row_number()
		.partBy(function(d){return d.grp;})
		.orderBy(function(d){return d.rnk;})
		.as("row_num");
		
		expect(typeof rn.partBy()).to.be("object");
		
		var result = Canal.of(dataSource).select()
		.window(
			rn
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"row_num":1},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"row_num":2},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"row_num":3},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"row_num":4},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"row_num":5},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"row_num":1},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"row_num":2},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"row_num":3},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"row_num":4}
		]);
	});
	
	it("window() count", function()
	{
		var f = Canal.col;
		
		var count = Canal.wf.count(f("id"))
		.partBy(function(d){return d.grp;})
		.orderBy(function(d){return d.rnk;})
		.as("count");
		
		expect(count.as()).to.be("count");
		
		var result = Canal.of(dataSource).select()
		.window(
			count
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"count":2},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"count":2},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"count":4},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"count":4},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"count":5},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"count":2},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"count":2},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"count":3},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"count":4}
		]);
	});
	
	it("window() count distinct", function()
	{
		var f = Canal.col;
		var distinct = Canal.wf.distinct;
		
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.count(distinct(f("sal")))
				.partBy(function(d){return d.grp;})
				.as("count")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"count":4},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"count":4},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"count":4},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"count":4},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"count":4},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"count":4},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"count":4},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"count":4},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"count":4}
		]);
	});

	it("window() count distinct sal", function()
	{
		var f = Canal.col;
		var distinct = Canal.wf.distinct;
		
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.count(distinct(f("sal")))
				.partBy(function(d){return d.grp;})
				.as("count")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"count":4},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"count":4},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"count":4},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"count":4},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"count":4},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"count":4},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"count":4},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"count":4},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"count":4}
		]);
	});
	
	it("window() fold part order", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.fold(function(){return [];},
						  function(last,data){
							last.push(data);
							return last;
						  },
						  function(d){
							return d.sal;
						  })
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.as("fold_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"fold_sal":[1000.00,1100.00]},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"fold_sal":[1000.00,1100.00]},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"fold_sal":[1000.00,1100.00,1200.00,undefined]},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"fold_sal":[1000.00,1100.00,1200.00,undefined]},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"fold_sal":[1000.00,1100.00,1200.00,undefined,1400.00]},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"fold_sal":[1500.00,1600.00]},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"fold_sal":[1500.00,1600.00]},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"fold_sal":[1500.00,1600.00,1700.00]},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"fold_sal":[1500.00,1600.00,1700.00,1800.00]}
		]);
	});
	
	it("window() fold part order desc", function()
	{
		var f = Canal.col;
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.fold(function(){return [];},
						  function(last,data){
							last.push(data);
							return last;
						  },
						  function(d){
							return d.sal;
						  })
				.partBy(function(d){return d.grp;})
				.orderBy(f(function(d){return d.rnk;}).nullsFirst())
				.as("fold_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"fold_sal":[1000.00,1100.00]},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"fold_sal":[1000.00,1100.00]},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"fold_sal":[1000.00,1100.00,1200.00,undefined]},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"fold_sal":[1000.00,1100.00,1200.00,undefined]},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"fold_sal":[1000.00,1100.00,1200.00,undefined,1400.00]},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"fold_sal":[1800.00]},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"fold_sal":[1800.00,1500.00,1600.00]},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"fold_sal":[1800.00,1500.00,1600.00]},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"fold_sal":[1800.00,1500.00,1600.00,1700.00]}
		]);
	});
	
	it("window() fold part", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.fold(function(){return [];},
						  function(last,data){
							last.push(data.sal);
							return last;
						  })
				.partBy(function(d){return d.grp;})
				.as("fold_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"fold_sal":[1000.00,1100.00,1200.00,undefined,1400.00]},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"fold_sal":[1000.00,1100.00,1200.00,undefined,1400.00]},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"fold_sal":[1000.00,1100.00,1200.00,undefined,1400.00]},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"fold_sal":[1000.00,1100.00,1200.00,undefined,1400.00]},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"fold_sal":[1000.00,1100.00,1200.00,undefined,1400.00]},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"fold_sal":[1500.00,1600.00,1700.00,1800.00]},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"fold_sal":[1500.00,1600.00,1700.00,1800.00]},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"fold_sal":[1500.00,1600.00,1700.00,1800.00]},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"fold_sal":[1500.00,1600.00,1700.00,1800.00]}
		]);
	});
	
	it("window() fold distinct", function()
	{
		var f = Canal.col;
		var distinct = Canal.wf.distinct;
		
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.fold(function(){return [];},
						function(last,data){
							last.push(data);
							return last;
					  	},
						distinct(f("rnk")))
				.partBy(function(d){return d.grp;})
				.as("fold_uniq")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"fold_uniq":[1,2,3]},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"fold_uniq":[1,2,3]},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"fold_uniq":[1,2,3]},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"fold_uniq":[1,2,3]},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"fold_uniq":[1,2,3]},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"fold_uniq":[1,2,null]},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"fold_uniq":[1,2,null]},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"fold_uniq":[1,2,null]},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"fold_uniq":[1,2,null]}
		]);
	});
	
	it("window() avg", function()
	{
		var avg = Canal.wf.avg(function(d){return d.sal;})
		.partBy(function(d){return d.grp;})
		.orderBy(function(d){return d.rnk;})
		.as("avg_sal");
		
		expect(typeof avg.orderBy()).to.be("object");
		
		var result = Canal.of(dataSource).select()
		.window(
			avg
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"avg_sal":1050.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"avg_sal":1050.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"avg_sal":1100.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"avg_sal":1100.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"avg_sal":1175.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"avg_sal":1550.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"avg_sal":1550.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"avg_sal":1600.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"avg_sal":1650.00}
		]);
	});
	
	it("window() avg distinct", function()
	{
		var f = Canal.col;
		var distinct = Canal.wf.distinct;
		
		var avg = Canal.wf.avg(distinct(f("sal")))
		.partBy(function(d){return d.grp;})
		.as("avg_sal");
		
		expect(typeof avg.orderBy()).to.be("object");
		
		var result = Canal.of(dataSource).select()
		.window(
			avg
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"avg_sal":1175.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"avg_sal":1175.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"avg_sal":1175.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"avg_sal":1175.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"avg_sal":1175.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"avg_sal":1650.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"avg_sal":1650.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"avg_sal":1650.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"avg_sal":1650.00}
		]);
	});
	
	it("window() avg distinct 1", function()
	{
		var f = Canal.col;
		var distinct = Canal.wf.distinct;
		
		var avg = Canal.wf.avg(distinct(f("sal")))
		.partBy(function(d){return d.grp;})
		.as("avg_sal");
		
		expect(typeof avg.orderBy()).to.be("object");
		
		var result = Canal.of(dataSource1).select()
		.window(
			avg
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"avg_sal":1225.00},
			{"id":"2","grp":"1","rnk":1,"sal":1000.00,"avg_sal":1225.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"avg_sal":1225.00},
			{"id":"4","grp":"1","rnk":2,"sal":1300.00,"avg_sal":1225.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"avg_sal":1225.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"avg_sal":1600.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"avg_sal":1600.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"avg_sal":1600.00}
		]);
	});
	
	it("window() sum", function()
	{
		var sum = Canal.wf.sum(function(d){return d.sal;})
		.partBy(function(d){return d.grp;})
		.orderBy(function(d){return d.rnk;})
		.as("sum_sal");
		
		expect(typeof sum.orderBy()).to.be("object");
		
		var result = Canal.of(dataSource).select()
		.window(
			sum
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2100.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3300.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":3300.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":4700.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3100.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":6600.00}
		]);
	});
	
	it("window() sum distinct", function()
	{
		var f = Canal.col;
		var distinct = Canal.wf.distinct;
		
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(distinct(f("rnk")))
				.partBy(function(d){return d.grp;})
				.as("sum_uniq")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_uniq":6},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_uniq":6},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_uniq":6},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_uniq":6},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_uniq":6},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_uniq":3},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_uniq":3},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_uniq":3},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_uniq":3}
		]);
	});
	
	it("window() sum partBy(null)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(null)
				.orderBy(function(d){return d.rnk;})
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":5200.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":5200.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":5200.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":5200.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":8100.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":8100.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":8100.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":9500.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":11300.00}
		]);
	});
	
	it("window() sum orderBy(null)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(null)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":4700.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":4700.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":4700.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":4700.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":4700.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":6600.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":6600.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":6600.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":6600.00}
		]);
	});
	
	it("window() sum partBy(null) orderBy(null)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(){return null;})
				.orderBy(function(){return null;})
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":11300.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":11300.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":11300.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":11300.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":11300.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":11300.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":11300.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":11300.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":11300.00}
		]);
	});
	
	it("window() sum rows(-1,1)", function()
	{
		var sum = Canal.wf.sum(function(d){return d.sal;})
		.partBy(function(d){return d.grp;})
		.orderBy(function(d){return d.rnk;})
		.rows().between(-1, 1)
		.as("sum_sal");
		
		expect(sum.between()).to.eql([ -1, 1 ]);
		
		var result = Canal.of(dataSource).select()
		.window(
			sum
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":3300.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2300.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":2600.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":5100.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":3500.00}
		]);
	});
	
	it("window() sum rows [-1,1]", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy([function(d){return d.grp;}])
				.orderBy([function(d){return d.rnk;}])
				.rows().between([-1, 1])
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":3300.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2300.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":2600.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":5100.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":3500.00}
		]);
	});
	
	it("window() sum desc rows(-1,1)", function()
	{
		var f = Canal.col;
		
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(f("grp"))
				.orderBy(f("rnk"), false, function(d){return parseInt(d.id);})
				.rows().between(-1, 1)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":2600.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2600.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":2200.00},
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2100.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3200.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4900.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":3400.00}
		]);
	});
	
	it("window() sum rows(0,1)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy("rnk")
				.rows().between(0, 1)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2300.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":1200.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":1400.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3300.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3500.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() sum rows(0,null)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.rows().between(0, null)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":4700.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":3700.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2600.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":1400.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":6600.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":5100.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3500.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() sum desc rows(0,null)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;}, false, function(d){return parseInt(d.id);})
				.rows().between(0, null)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":4700.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3300.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":2100.00},
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":1100.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":6600.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4900.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3400.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() sum rows(-2,-1)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.rows().between(-2, -1)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":undefined},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":1000.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2100.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":2300.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1200.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":undefined},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":1500.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3100.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":3300.00}
		]);
	});
	
	it("window() sum desc rows(-2,-1)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;}, false, function(d){return parseInt(d.id);})
				.rows().between(-2, -1)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":undefined},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":1400.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":2600.00},
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":1200.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":1000.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":undefined},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":1700.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3200.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":3100.00}
		]);
	});
	
	it("window() sum rows(null,0)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.rows().between(null, 0)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":1000.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2100.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3300.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":3300.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":4700.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":1500.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3100.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":6600.00}
		]);
	});
	
	it("window() sum desc rows(null,0)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;}, false, function(d){return parseInt(d.id);})
				.rows().between(null, 0)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2600.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":2600.00},
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":3600.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":4700.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":1700.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3200.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":6600.00}
		]);
	});
	
	it("window() sum rows(1,2)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.rows().between(1, 2)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2300.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":1200.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":1400.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":1400.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":undefined},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3300.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3500.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":1800.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":undefined}
		]);
	});
	
	it("window() sum desc rows(1,2)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;}, false, function(d){return parseInt(d.id);})
				.rows().between(1, 2)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1200.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":1000.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":2100.00},
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":1100.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":undefined},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3100.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3400.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":1800.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":undefined}
		]);
	});
	
	it("window() sum range(-1,1)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.range().between(-1, 1)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":3300.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":3300.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":4700.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":4700.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":2600.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() sum desc range(-1,1)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;}, false)
				.range().between(-1, 1)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":2600.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":4700.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":4700.00},
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":3300.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":3300.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() sum range(-1,0)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.range().between(-1, 0)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2100.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3300.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":3300.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":2600.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3100.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() sum desc range(-1,0)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;}, false)
				.range().between(-1, 0)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2600.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":2600.00},
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":3300.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":3300.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":1700.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() sum range(0,1)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.range().between(0, 1)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":3300.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":3300.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2600.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":2600.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":1700.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() sum desc range(0,1)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;}, false)
				.range().between(0, 1)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":2600.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3300.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":3300.00},
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2100.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3100.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() sum range(0,null)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.range().between(0, null)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":4700.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":4700.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2600.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":2600.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":6600.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":6600.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3500.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() sum desc range(0,null)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;}, false)
				.range().between(0, null)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":4700.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3300.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":3300.00},
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2100.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":6600.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4900.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4900.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() sum range(-1,null)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.range().between(-1, null)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":4700.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":4700.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":4700.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":4700.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":2600.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":6600.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":6600.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":6600.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() sum desc range(-1,null)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;}, false)
				.range().between(-1, null)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":4700.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":4700.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":4700.00},
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":3300.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":3300.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":6600.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":6600.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":6600.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() sum range(null,0)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.range().between(null, 0)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2100.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3300.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":3300.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":4700.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3100.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":6600.00}
		]);
	});
	
	it("window() sum desc range(null,0)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;}, false)
				.range().between(null, 0)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2600.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":2600.00},
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":4700.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":4700.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":1700.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":6600.00}
		]);
	});
	
	it("window() sum range(null,1)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.range().between(null, 1)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":3300.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":3300.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":4700.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":4700.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":4700.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":6600.00}
		]);
	});
	
	it("window() sum desc range(null,1)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;}, false)
				.range().between(null, 1)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":2600.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":4700.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":4700.00},
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":4700.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":4700.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":6600.00}
		]);
	});
	
	it("window() sum range(1,2)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.range().between(1, 2)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2600.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2600.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":1400.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":1400.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":undefined},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":1700.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":1700.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":undefined},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() sum desc range(1,2)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;}, false)
				.range().between(1, 2)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":3300.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2100.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":2100.00},
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":undefined},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":undefined},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3100.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":undefined},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":undefined},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() sum range(-2,-1)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.range().between(-2, -1)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":undefined},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":undefined},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2100.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":2100.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":3300.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":undefined},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":undefined},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3100.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() sum desc range(-2,-1)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.sum(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;}, false)
				.range().between(-2, -1)
				.as("sum_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":undefined},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":1400.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sum_sal":1400.00},
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2600.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2600.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":undefined},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":1700.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":1700.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sum_sal":1800.00}
		]);
	});
	
	it("window() max part(grp) order(rnk)", function()
	{
		var data = [
			{"id":"1","grp":"1","rnk":1,"sal":1100.00},
			{"id":"2","grp":"1","rnk":1,"sal":1000.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00},
			{"id":"4","grp":"1","rnk":2,"sal":1300.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00}
		];
		
		var result = Canal.of(data).select()
		.window(
			Canal.wf.max(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.rows().between(0,1)
				.as("max_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1100.00,"max_sal":1100.00},
			{"id":"2","grp":"1","rnk":1,"sal":1000.00,"max_sal":1200.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"max_sal":1300.00},
			{"id":"4","grp":"1","rnk":2,"sal":1300.00,"max_sal":1400.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"max_sal":1400.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"max_sal":1600.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"max_sal":1700.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"max_sal":1700.00}
		]);
	});
	
	it("window() min part(grp) order(rnk)", function()
	{
		var data = [
			{"id":"1","grp":"1","rnk":1,"sal":1100.00},
			{"id":"2","grp":"1","rnk":1,"sal":1000.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00},
			{"id":"4","grp":"1","rnk":2,"sal":1300.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00}
		];
		
		var result = Canal.of(data).select()
		.window(
			Canal.wf.min(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.as("min_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1100.00,"min_sal":1000.00},
			{"id":"2","grp":"1","rnk":1,"sal":1000.00,"min_sal":1000.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"min_sal":1000.00},
			{"id":"4","grp":"1","rnk":2,"sal":1300.00,"min_sal":1000.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"min_sal":1000.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"min_sal":1500.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"min_sal":1500.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"min_sal":1500.00}
		]);
	});
	
	it("window() min part(grp) order(rnk) between(-1,0)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.min(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.rows().between(-1,0)
				.as("min_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"min_sal":1000.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"min_sal":1000.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"min_sal":1100.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"min_sal":1200.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"min_sal":1400.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"min_sal":1500.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"min_sal":1500.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"min_sal":1600.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"min_sal":1700.00}
		]);
	});
	
	it("window() max part(grp) order(rnk) between(-1,0)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.max(function(d){return d.sal;})
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.rows().between(-1,0)
				.as("max_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"max_sal":1000.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"max_sal":1100.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"max_sal":1200.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"max_sal":1200.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"max_sal":1400.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"max_sal":1500.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"max_sal":1600.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"max_sal":1700.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"max_sal":1800.00}
		]);
	});
	
	it("window() min part(grp,rnk)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.min(function(d){return d.sal;})
				.partBy(function(d){return d.grp;}, function(d){return d.rnk;})
				.as("min_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"min_sal":1000.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"min_sal":1000.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"min_sal":1200.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"min_sal":1200.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"min_sal":1400.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"min_sal":1500.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"min_sal":1500.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"min_sal":1700.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"min_sal":1800.00}
		]);
	});
	
	it("window() max part(grp,rnk)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.max(function(d){return d.sal;})
				.partBy(function(d){return d.grp;}, function(d){return d.rnk;})
				.as("max_sal")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"max_sal":1100.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"max_sal":1100.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"max_sal":1200.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"max_sal":1200.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"max_sal":1400.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"max_sal":1600.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"max_sal":1600.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"max_sal":1700.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"max_sal":1800.00}
		]);
	});
	
	it("window() rank", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.rank()
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.as("rank")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"rank":1},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"rank":1},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"rank":3},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"rank":3},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"rank":5},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"rank":1},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"rank":1},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"rank":3},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"rank":4}
		]);
	});
	
	it("window() dense_rank", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.dense_rank()
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.as("rank")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"rank":1},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"rank":1},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"rank":2},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"rank":2},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"rank":3},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"rank":1},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"rank":1},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"rank":2},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"rank":3}
		]);
	});
	
	it("window() percent_rank", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.percent_rank()
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.as("pct_rnk")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"pct_rnk":0},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"pct_rnk":0},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"pct_rnk":0.5},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"pct_rnk":0.5},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"pct_rnk":1},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"pct_rnk":0},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"pct_rnk":0},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"pct_rnk":2/3},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"pct_rnk":1}
		]);
	});
	
	it("window() ntile(4)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.ntile(4)
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.as("ntle")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"ntle":1},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"ntle":1},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"ntle":2},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"ntle":3},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"ntle":4},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"ntle":1},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"ntle":2},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"ntle":3},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"ntle":4}
		]);
	});
	
	it("window() ntile(3)", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.ntile(3)
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.as("ntle")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"ntle":1},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"ntle":1},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"ntle":2},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"ntle":2},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"ntle":3},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"ntle":1},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"ntle":1},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"ntle":2},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"ntle":3}
		]);
	});
	
	it("window() lag()", function()
	{
		var result = Canal.of(dataSource).select()
		.window(
			Canal.wf.lag(function(d){return d.sal;}, 1, "N/A")
				.partBy(function(d){return d.grp;})
				.orderBy(function(d){return d.rnk;})
				.as("lg")
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"lg":"N/A"},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"lg":1000.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"lg":1100.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"lg":1200.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"lg":undefined},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"lg":"N/A"},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"lg":1500.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"lg":1600.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"lg":1700.00}
		]);
	});
	
	it("window() lead()", function()
	{
		var lead = Canal.wf.lead(function(d){return d.sal;}, 2, "N/A")
		.partBy(function(d){return d.grp;})
		.orderBy(function(d){return d.rnk;})
		.as("ld");
		
		expect(typeof lead.aggregator()).to.be("function");
		expect(typeof lead.expressor()).to.be("function");
		
		var result = Canal.of(dataSource).select()
		.window(
			lead
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"ld":1200.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"ld":undefined},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"ld":1400.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"ld":"N/A"},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"ld":"N/A"},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"ld":1700.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"ld":1800.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"ld":"N/A"},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"ld":"N/A"}
		]);
	});
	
	it("window() cume_dist()", function()
	{
		var cume_dist = Canal.wf.cume_dist()
		.partBy(function(d){return d.grp;})
		.orderBy(function(d){return d.rnk;})
		.as("cum_dst");
		
		expect(typeof cume_dist.updater()).to.be("function");
		
		var result = Canal.of(dataSource).select()
		.window(
			cume_dist
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"cum_dst":0.4},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"cum_dst":0.4},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"cum_dst":0.8},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"cum_dst":0.8},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"cum_dst":1.0},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"cum_dst":0.5},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"cum_dst":0.5},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"cum_dst":0.75},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"cum_dst":1.0}
		]);
	});
	
	it("window() map_part()", function()
	{
		var f = Canal.col;
		var map_part = Canal.wf.map_part(function(p){return p[1].sal;})
		.partBy(function(d){return d.grp;})
		.orderBy(f(function(d){return d.sal;}).nullsFirst())
		.as("sec_sal");
		
		expect(typeof map_part.aggregator()).to.be("function");
		expect(typeof map_part.updater()).to.be("function");
		expect(typeof map_part.expressor()).to.be("function");
		
		var result = Canal.of(dataSource).select()
		.window(
			map_part
		).collect();
	
		expect(result).to.eql([
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"sec_sal":1000.00},
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sec_sal":1000.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sec_sal":1000.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sec_sal":1000.00},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sec_sal":1000.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sec_sal":1600.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sec_sal":1600.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sec_sal":1600.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"sec_sal":1600.00}
		]);
	});
	
	it("window() first_value()", function()
	{
		var f = Canal.col;
		var first_value = Canal.wf.first_value(function(r){return r.sal;})
		.partBy(function(d){return d.grp;})
		.orderBy(f(function(d){return d.sal;}).desc().nullsLast())
		.as("first_sal");
		
		var result = Canal.of(dataSource).select()
		.window(
			first_value
		).collect();
	
		expect(result).to.eql([
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"first_sal":1400.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"first_sal":1400.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"first_sal":1400.00},
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"first_sal":1400.00},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"first_sal":1400.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"first_sal":1800.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"first_sal":1800.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"first_sal":1800.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"first_sal":1800.00}
		]);
	});
	
	it("window() last_value()", function()
	{
		var f = Canal.col;
		var last_value = Canal.wf.last_value(function(r){return r.sal;})
		.partBy(function(d){return d.grp;})
		.orderBy(f(function(d){return d.rnk;}).asc().nullsFirst())
		.as("last_sal");
		
		var result = Canal.of(dataSource).select()
		.window(
			last_value
		).collect();
	
		expect(result).to.eql([
			{"id":"1","grp":"1","rnk":1,"sal":1000.00,"last_sal":1100.00},
			{"id":"2","grp":"1","rnk":1,"sal":1100.00,"last_sal":1100.00},
			{"id":"3","grp":"1","rnk":2,"sal":1200.00,"last_sal":undefined},
			{"id":"4","grp":"1","rnk":2,"sal":undefined,"last_sal":undefined},
			{"id":"5","grp":"1","rnk":3,"sal":1400.00,"last_sal":1400.00},
			{"id":"9","grp":"2","rnk":null,"sal":1800.00,"last_sal":1800.00},
			{"id":"6","grp":"2","rnk":1,"sal":1500.00,"last_sal":1600.00},
			{"id":"7","grp":"2","rnk":1,"sal":1600.00,"last_sal":1600.00},
			{"id":"8","grp":"2","rnk":2,"sal":1700.00,"last_sal":1700.00}
		]);
	});
});
