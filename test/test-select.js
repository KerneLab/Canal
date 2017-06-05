QUnit.test("select()", function(assert)
{
	var f = Canal.field;
	
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
			f("rnk","rank"),
			f(function(d){return d.sal+1000;},"salplus")
	).collect();
	
	assert.propEqual(result, [
		{"id":"1","grp":"1","rank":1,"salplus":2000.00},
		{"id":"2","grp":"1","rank":1,"salplus":2100.00},
		{"id":"3","grp":"1","rank":2,"salplus":2200.00},
		{"id":"4","grp":"1","rank":2,"salplus":2300.00},
		{"id":"5","grp":"1","rank":3,"salplus":2400.00},
		{"id":"6","grp":"2","rank":1,"salplus":2500.00},
		{"id":"7","grp":"2","rank":1,"salplus":2600.00},
		{"id":"8","grp":"2","rank":2,"salplus":2700.00}
	]);
});