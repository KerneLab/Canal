QUnit.test("window()", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() partBy(null)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() orderBy(null)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() partBy(null) orderBy(null)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() rows(-1,1)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
			.partBy("grp")
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

QUnit.test("window() desc rows(-1,1)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
			.partBy("grp")
			.orderBy("rnk", false, function(d){return parseInt(d.id);}, true)
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

QUnit.test("window() rows(0,1)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() rows(0,null)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() desc rows(0,null)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() rows(-2,-1)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() desc rows(-2,-1)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() rows(-1,0)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() desc rows(-1,0)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() rows(null,0)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() desc rows(null,0)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() rows(1,2)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() desc rows(1,2)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() range(-1,1)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() desc range(-1,1)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() range(-1,0)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() desc range(-1,0)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() range(0,1)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() desc range(0,1)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() range(0,null)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() desc range(0,null)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() range(-1,null)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() desc range(-1,null)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() range(null,0)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() desc range(null,0)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() range(null,1)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() desc range(null,1)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() range(1,2)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() desc range(1,2)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() range(-2,-1)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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

QUnit.test("window() desc range(-2,-1)", function(assert)
{
	function sum(mapper)
	{
		return [function(rows, begin, end)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		}];
	}

	var result = Canal.of([
		{"id":"1","grp":"1","rnk":1,"sal":1000.00},
		{"id":"2","grp":"1","rnk":1,"sal":1100.00},
		{"id":"3","grp":"1","rnk":2,"sal":1200.00},
		{"id":"4","grp":"1","rnk":2,"sal":1300.00},
		{"id":"5","grp":"1","rnk":3,"sal":1400.00},
		{"id":"6","grp":"2","rnk":1,"sal":1500.00},
		{"id":"7","grp":"2","rnk":1,"sal":1600.00},
		{"id":"8","grp":"2","rnk":2,"sal":1700.00}
	]).window(
		Canal.item(sum(function(d){return d.sal;}))
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
