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

QUnit.test("window() row_number", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.row_number()
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.as("row_num")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() count", function(assert)
{
	var f = Canal.field;
	
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.count(f("id"))
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.as("count")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() count distinct", function(assert)
{
	var f = Canal.field;
	
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.count(f("rnk"), true)
			.partBy(function(d){return d.grp;})
			.as("count")
	).collect();

	assert.propEqual(result, [
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


QUnit.test("window() sum", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum partBy(null)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(null)
			.orderBy(function(d){return d.rnk;})
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum orderBy(null)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(null)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum partBy(null) orderBy(null)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(){return null;})
			.orderBy(function(){return null;})
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum rows(-1,1)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.rows().between(-1, 1)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum desc rows(-1,1)", function(assert)
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

	assert.propEqual(result, [
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

QUnit.test("window() sum rows(0,1)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy("rnk")
			.rows().between(0, 1)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum rows(0,null)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.rows().between(0, null)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum desc rows(0,null)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;}, false, function(d){return parseInt(d.id);})
			.rows().between(0, null)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum rows(-2,-1)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.rows().between(-2, -1)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum desc rows(-2,-1)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;}, false, function(d){return parseInt(d.id);})
			.rows().between(-2, -1)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum rows(-1,0)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.rows().between(-1, 0)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum desc rows(-1,0)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;}, false, function(d){return parseInt(d.id);})
			.rows().between(-1, 0)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum rows(null,0)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.rows().between(null, 0)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum desc rows(null,0)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;}, false, function(d){return parseInt(d.id);})
			.rows().between(null, 0)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum rows(1,2)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.rows().between(1, 2)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum desc rows(1,2)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;}, false, function(d){return parseInt(d.id);})
			.rows().between(1, 2)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum range(-1,1)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.range().between(-1, 1)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum desc range(-1,1)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;}, false)
			.range().between(-1, 1)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum range(-1,0)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.range().between(-1, 0)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum desc range(-1,0)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;}, false)
			.range().between(-1, 0)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum range(0,1)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.range().between(0, 1)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum desc range(0,1)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;}, false)
			.range().between(0, 1)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum range(0,null)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.range().between(0, null)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum desc range(0,null)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;}, false)
			.range().between(0, null)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum range(-1,null)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.range().between(-1, null)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum desc range(-1,null)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;}, false)
			.range().between(-1, null)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum range(null,0)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.range().between(null, 0)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum desc range(null,0)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;}, false)
			.range().between(null, 0)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum range(null,1)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.range().between(null, 1)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum desc range(null,1)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;}, false)
			.range().between(null, 1)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum range(1,2)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.range().between(1, 2)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum desc range(1,2)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;}, false)
			.range().between(1, 2)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum range(-2,-1)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.range().between(-2, -1)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() sum desc range(-2,-1)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.sum(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;}, false)
			.range().between(-2, -1)
			.as("sum_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() min part(grp) order(rnk)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.min(function(d){return d.sal;})
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk})
			.as("min_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() min part(grp,rnk)", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.min(function(d){return d.sal;})
			.partBy(function(d){return d.grp;}, function(d){return d.rnk})
			.as("min_sal")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() rank", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.rank()
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.as("rank")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() dense_rank", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.dense_rank()
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.as("rank")
	).collect();

	assert.propEqual(result, [
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

QUnit.test("window() percent_rank", function(assert)
{
	var result = Canal.of(dataSource).select()
	.window(
		Canal.wf.percent_rank()
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.rnk;})
			.as("pct_rnk")
	).collect();

	assert.propEqual(result, [
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
