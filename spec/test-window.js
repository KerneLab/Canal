var Canal = require('../canal');

describe("Test window", function(){

var dataSource = [
	{"id":"1","grp":"1","rnk":1,"sal":1000.00},
	{"id":"2","grp":"1","rnk":1,"sal":1100.00},
	{"id":"3","grp":"1","rnk":2,"sal":1200.00},
	{"id":"4","grp":"1","rnk":2,"sal":1300.00},
	{"id":"5","grp":"1","rnk":3,"sal":1400.00},
	{"id":"6","grp":"2","rnk":1,"sal":1500.00},
	{"id":"7","grp":"2","rnk":1,"sal":1600.00},
	{"id":"8","grp":"2","rnk":2,"sal":1700.00}
];

it("window() row_number", function()
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.row_number()
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.as("row_num")
	).collect();

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"row_num":1},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"row_num":2},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"row_num":3},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"row_num":4},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"row_num":5},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"row_num":1},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"row_num":2},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"row_num":3}
	]);
});

it("window() count", function()
{
	var f = Canal.field;
	
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.count(f("id"))
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.as("count")
	).collect();

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"count":2},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"count":2},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"count":4},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"count":4},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"count":5},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"count":2},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"count":2},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"count":3}
	]);
});

it("window() count distinct", function()
{
	var f = Canal.field;
	
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.count(f("rnk"), true)
			.partBy(function(d){return d.grp;})
			.as("count")
	).collect();

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"count":3},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"count":3},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"count":3},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"count":3},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"count":3},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"count":2},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"count":2},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"count":2}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"fold_sal":[1000.00,1100.00]},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"fold_sal":[1000.00,1100.00]},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"fold_sal":[1000.00,1100.00,1200.00,1300.00]},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"fold_sal":[1000.00,1100.00,1200.00,1300.00]},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"fold_sal":[1000.00,1100.00,1200.00,1300.00,1400.00]},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"fold_sal":[1500.00,1600.00]},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"fold_sal":[1500.00,1600.00]},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"fold_sal":[1500.00,1600.00,1700.00]}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"fold_sal":[1000.00,1100.00,1200.00,1300.00,1400.00]},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"fold_sal":[1000.00,1100.00,1200.00,1300.00,1400.00]},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"fold_sal":[1000.00,1100.00,1200.00,1300.00,1400.00]},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"fold_sal":[1000.00,1100.00,1200.00,1300.00,1400.00]},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"fold_sal":[1000.00,1100.00,1200.00,1300.00,1400.00]},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"fold_sal":[1500.00,1600.00,1700.00]},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"fold_sal":[1500.00,1600.00,1700.00]},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"fold_sal":[1500.00,1600.00,1700.00]}
	]);
});

it("window() sum", function()
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.as("sum_sal")
	).collect();

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":4600.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":4600.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":6000.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3100.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":5200.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":5200.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":5200.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":5200.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":9400.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":9400.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":9400.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":10800.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":6000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":6000.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":6000.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":6000.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":6000.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":10800.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":10800.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":10800.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":10800.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":10800.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":10800.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":10800.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":10800.00}
	]);
});

it("window() sum rows(-1,1)", function()
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.rows().between(-1, 1)
			.as("sum_sal")
	).collect();

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":3300.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3600.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":3900.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":2700.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3300.00}
	]);
});

it("window() sum rows(-1,1)", function()
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy([function(d){return d.grp;}])
			.orderBy([function(d){return d.rnk;}])
			.rows().between([-1, 1])
			.as("sum_sal")
	).collect();

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":3300.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3600.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":3900.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":2700.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3300.00}
	]);
});

it("window() sum desc rows(-1,1)", function()
{
	var f = Canal.field;
	
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(f("grp"))
			.orderBy(f("rnk"), false, function(d){return parseInt(d.id);}, true)
			.rows().between(-1, 1)
			.as("sum_sal")
	).collect();

	expect(result).toEqual([
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":2600.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3900.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":3500.00},
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":3400.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2100.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3200.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3100.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2300.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2500.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":2700.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3300.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":1700.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":6000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":5000.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3900.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":2700.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3300.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":1700.00}
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

	expect(result).toEqual([
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":6000.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":4600.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":3400.00},
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":1100.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":1600.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":undefined},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":1000.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2100.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":2300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":2500.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":undefined},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":1500.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3100.00}
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

	expect(result).toEqual([
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":undefined},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":1400.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":2600.00},
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2500.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2300.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":undefined},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":1700.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3200.00}
	]);
});

it("window() sum rows(-1,0)", function()
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.rows().between(-1, 0)
			.as("sum_sal")
	).collect();

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2300.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":2500.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":2700.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3100.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3300.00}
	]);
});

it("window() sum desc rows(-1,0)", function()
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;}, false, function(d){return parseInt(d.id);})
			.rows().between(-1, 0)
			.as("sum_sal")
	).collect();

	expect(result).toEqual([
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2600.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":2500.00},
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2300.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2100.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":1700.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3200.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3100.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3300.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":4600.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":6000.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3100.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00}
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

	expect(result).toEqual([
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2600.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":3900.00},
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":4900.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":6000.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":1700.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3200.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2300.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2500.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2700.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":1400.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":undefined},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3300.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":1700.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":undefined}
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

	expect(result).toEqual([
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":2500.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2300.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":2100.00},
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":1100.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":undefined},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3100.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":1600.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":undefined}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":4600.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":4600.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":6000.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":6000.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":3900.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00}
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

	expect(result).toEqual([
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":3900.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":6000.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":6000.00},
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":4600.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":4600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":4600.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":4600.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":3900.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3100.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00}
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

	expect(result).toEqual([
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3900.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":3900.00},
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":4600.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":4600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":1700.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":4600.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":4600.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3900.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":3900.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":1700.00}
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

	expect(result).toEqual([
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":3900.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":4600.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":4600.00},
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2100.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3100.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":6000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":6000.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3900.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":3900.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":1700.00}
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

	expect(result).toEqual([
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":6000.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":4600.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":4600.00},
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2100.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3100.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":6000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":6000.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":6000.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":6000.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":3900.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00}
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

	expect(result).toEqual([
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":6000.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":6000.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":6000.00},
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":4600.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":4600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":2100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":4600.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":4600.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":6000.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":3100.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00}
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

	expect(result).toEqual([
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":1400.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3900.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":3900.00},
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":6000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":6000.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":1700.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":4600.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":4600.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":6000.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":6000.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":6000.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00}
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

	expect(result).toEqual([
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":3900.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":6000.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":6000.00},
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":6000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":6000.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":4800.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":4800.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":3900.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":3900.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":1400.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":1400.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":undefined},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":1700.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":1700.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":undefined}
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

	expect(result).toEqual([
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":4600.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2100.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":2100.00},
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":undefined},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":undefined},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3100.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":undefined},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":undefined}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":undefined},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":undefined},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":2100.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":2100.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":4600.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":undefined},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":undefined},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3100.00}
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

	expect(result).toEqual([
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":undefined},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":1400.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":1400.00},
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":3900.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":3900.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":undefined},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":1700.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":1700.00}
	]);
});

it("window() max part(grp) order(rnk)", function()
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.max(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.rows().between(0,1)
			.as("max_sal")
	).collect();

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"max_sal":1100.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"max_sal":1200.00},
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
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.min(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.as("min_sal")
	).collect();

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"min_sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"min_sal":1000.00},
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"min_sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"min_sal":1000.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"min_sal":1100.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"min_sal":1200.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"min_sal":1300.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"min_sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"min_sal":1500.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"min_sal":1600.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"min_sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"min_sal":1000.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"min_sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"min_sal":1200.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"min_sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"min_sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"min_sal":1500.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"min_sal":1700.00}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"rank":1},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"rank":1},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"rank":3},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"rank":3},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"rank":5},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"rank":1},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"rank":1},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"rank":3}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"rank":1},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"rank":1},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"rank":2},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"rank":2},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"rank":3},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"rank":1},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"rank":1},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"rank":2}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"pct_rnk":0},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"pct_rnk":0},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"pct_rnk":0.5},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"pct_rnk":0.5},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"pct_rnk":1},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"pct_rnk":0},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"pct_rnk":0},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"pct_rnk":1}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"ntle":1},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"ntle":1},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"ntle":2},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"ntle":3},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"ntle":4},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"ntle":1},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"ntle":2},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"ntle":3}
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

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"ntle":1},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"ntle":1},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"ntle":2},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"ntle":2},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"ntle":3},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"ntle":1},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"ntle":2},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"ntle":3}
	]);
});

it("window() lag()", function()
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.lag(function(d){return d.sal;}, 2, "N/A")
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.as("lg")
	).collect();

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"lg":"N/A"},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"lg":"N/A"},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"lg":1000.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"lg":1100.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"lg":1200.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"lg":"N/A"},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"lg":"N/A"},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"lg":1500.00}
	]);
});

it("window() lead()", function()
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.lead(function(d){return d.sal;}, 2, "N/A")
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.as("ld")
	).collect();

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"ld":1200.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"ld":1300.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"ld":1400.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"ld":"N/A"},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"ld":"N/A"},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"ld":1700.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"ld":"N/A"},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"ld":"N/A"}
	]);
});

it("window() cume_dist()", function()
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.cume_dist()
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.as("cum_dst")
	).collect();

	expect(result).toEqual([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00,"cum_dst":0.4},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00,"cum_dst":0.4},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00,"cum_dst":0.8},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00,"cum_dst":0.8},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00,"cum_dst":1.0},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00,"cum_dst":2/3},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00,"cum_dst":2/3},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00,"cum_dst":1.0}
	]);
});

});
