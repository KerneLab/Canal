/**
 * Functional Programming Framework of Calculation in Javascript.
 * https://github.com/KerneLab/Canal
 */
(function()
{
	var ROOT = (typeof global === "object" && global) || this;

	function Pond()
	{
		this.downstream = null;
	}
	Pond.prototype.begin = function() // Void
	{
		if (this.downstream != null)
		{
			this.downstream.begin();
		}
	};
	Pond.prototype.accept = function(data) // Boolean
	{
	};
	Pond.prototype.done = function() // Void
	{
		if (this.downstream != null)
		{
			this.downstream.done();
		}
	};

	function Desilter()
	{
		this.sediment = undefined;
	}
	Desilter.prototype = new Pond();
	Desilter.prototype.settling = null; // () -> new Sediment
	Desilter.prototype.begin = function()
	{
		if (this.settling != null)
		{
			this.settle(this.settling());
		}
		if (this.downstream != null)
		{
			this.downstream.begin();
		}
	};
	Desilter.prototype.settle = function() // access Sediment
	{
		if (arguments.length > 0)
		{
			this.sediment = arguments[0];
			return this;
		}
		else
		{
			return this.sediment;
		}
	};

	function Grouper()
	{
	}
	Grouper.prototype = new Desilter();
	Grouper.prototype.settling = function()
	{
		return {};
	};
	Grouper.prototype.keyOf = function(d)
	{
	};
	Grouper.prototype.valOf = function(d)
	{
		return d;
	};
	Grouper.prototype.accept = function(d)
	{
		var key = this.keyOf(d);
		var settle = this.settle();
		var group = settle[key];
		if (group == null)
		{
			group = [];
			settle[key] = group;
		}
		group.push(this.valOf(d));
		return true;
	};
	Grouper.prototype.done = function()
	{
		if (this.downstream != null)
		{
			var settle = this.settle();

			for (group in settle)
			{
				if (!this.downstream.accept([ group, settle[group] ]))
				{
					break;
				}
			}

			this.downstream.done();
		}
	};

	// Operators

	function Operator()
	{
		this.upstream = null;
	}
	Operator.prototype.newPond = function() // () -> Pond
	{
		return new Pond();
	};

	// Intermediate Operators

	function DistinctOp(cmp)
	{
		cmp = cmp != null // (a,b) -> 0(=)
		? cmp : function(a, b)
		{
			return a == b ? 0 : 1;
		};

		function DistinctPond()
		{
		}
		DistinctPond.prototype = new Desilter();
		DistinctPond.prototype.settling = function()
		{
			return [];
		};
		DistinctPond.prototype.accept = function(d)
		{
			var found = false;
			var settle = this.settle();
			for (i in settle)
			{
				if (cmp(settle[i], d) == 0)
				{
					found = true;
					break;
				}
			}
			if (!found)
			{
				settle.push(d);
			}
			return true;
		};
		DistinctPond.prototype.done = function()
		{
			if (this.downstream != null)
			{
				var settle = this.settle();
				for (i in settle)
				{
					if (!this.downstream.accept(settle[i]))
					{
						break;
					}
				}
				this.downstream.done();
			}
		};

		this.newPond = function()
		{
			return new DistinctPond();
		};
	}
	DistinctOp.prototype = new Operator();

	function FilterOp(pred)
	{
		function FilterPond()
		{
		}
		FilterPond.prototype = new Pond();
		FilterPond.prototype.accept = function(d)
		{
			if (pred(d))
			{
				return this.downstream.accept(d);
			}
			else
			{
				return true;
			}
		};

		this.newPond = function()
		{
			return new FilterPond();
		};
	}
	FilterOp.prototype = new Operator();

	function FlatMapOp(fn)
	{
		function FlatMapPond()
		{
		}
		FlatMapPond.prototype = new Pond();
		FlatMapPond.prototype.accept = function(d)
		{
			var data = fn(d);
			if (data instanceof Array)
			{
				for (i in data)
				{
					if (!this.downstream.accept(data[i]))
					{
						return false;
					}
				}
				return true;
			}
			else
			{
				return this.downstream.accept(data);
			}
		};

		this.newPond = function()
		{
			return new FlatMapPond();
		};
	}
	FlatMapOp.prototype = new Operator();

	function ForeachOp(fn) // (data) -> Void
	{
		function ForeachPond()
		{
		}
		ForeachPond.prototype = new Pond();
		ForeachPond.prototype.accept = function(d)
		{
			fn(d);
			return this.downstream.accept(d);
		};

		this.newPond = function()
		{
			return new ForeachPond();
		}
	}
	ForeachOp.prototype = new Operator();

	function GroupOp(key, val) // (data) -> key, [(data) -> val]
	{
		function GroupPond()
		{
		}
		GroupPond.prototype = new Grouper();
		GroupPond.prototype.keyOf = function(d)
		{
			return key == null ? d[0] : key(d);
		};
		GroupPond.prototype.valOf = function(d)
		{
			return val == null ? d[1] : val(d);
		};

		this.newPond = function()
		{
			return new GroupPond();
		};
	}
	GroupOp.prototype = new Operator();

	function JoinOp(canal, keyL, keyR)
	{
		keyL = keyL != null ? keyL : function(d)
		{
			return d[0];
		};
		keyR = keyR != null ? keyR : function(d)
		{
			return d[0];
		};

		function JoinPond()
		{

		}
		JoinPond.prototype = new Grouper();
		JoinPond.prototype.keyOf = function(d)
		{
			return keyL(d);
		};
		JoinPond.prototype.valOf = function(d)
		{
			return d[1];
		};
		JoinPond.prototype.done = function()
		{
			if (this.downstream != null)
			{
				var left = this.settle();
				var rightData = canal.groupBy(keyR, null).collect();
				var right = {};
				for (i in rightData)
				{
					var d = rightData[i];
					right[d[0]] = d[1];
				}

				out: for (k in left)
				{
					var ls = left[k];
					if (ls != null)
					{
						var rs = right[k];
						if (rs != null)
						{
							for (l in ls)
							{
								for (r in rs)
								{
									if (!this.downstream
											.accept([ ls[l], rs[r] ]))
									{
										break out;
									}
								}
							}
						}
					}
				}

				this.downstream.done();
			}
		};

		this.newPond = function()
		{
			return new JoinPond();
		};
	}
	JoinOp.prototype = new Operator();

	function MapOp(fn)
	{
		function MapPond()
		{
		}
		MapPond.prototype = new Pond();
		MapPond.prototype.accept = function(d)
		{
			return this.downstream.accept(fn(d));
		};

		this.newPond = function()
		{
			return new MapPond();
		};
	}
	MapOp.prototype = new Operator();

	function MapValuesOp(fn) // ([val..]) -> Value
	{
		function MapValuesPond()
		{
		}
		MapValuesPond.prototype = new Pond();
		MapValuesPond.prototype.accept = function(d)
		{
			return this.downstream.accept([ d[0], fn(d[1]) ]);
		};

		this.newPond = function()
		{
			return new MapValuesPond();
		};
	}
	MapValuesOp.prototype = new Operator();

	function SortOp(cmp) // (a,b) -> 0(=) -1(<) 1(>)
	{
		function SortPond()
		{
		}
		SortPond.prototype = new Desilter();
		SortPond.prototype.settling = function()
		{
			return [];
		};
		SortPond.prototype.accept = function(d)
		{
			this.settle().push(d);
			return true;
		};
		SortPond.prototype.done = function(d)
		{
			if (this.downstream != null)
			{
				var settle = this.settle();
				if (cmp != null)
				{
					settle.sort(cmp);
				}
				else
				{
					settle.sort();
				}
				for (i in settle)
				{
					if (!this.downstream.accept(settle[i]))
					{
						break;
					}
				}
				this.downstream.done();
			}
		};

		this.newPond = function()
		{
			return new SortPond();
		};
	}
	SortOp.prototype = new Operator();

	// Terminate Operators

	function Terminal()
	{
	}
	Terminal.prototype = new Desilter();
	Terminal.prototype.get = function()
	{
		return this.settle();
	};

	function CollectOp()
	{
		function CollectPond()
		{
		}
		CollectPond.prototype = new Terminal();
		CollectPond.prototype.settling = function()
		{
			return [];
		}
		CollectPond.prototype.accept = function(d)
		{
			this.settle().push(d);
			return true;
		};

		this.newPond = function()
		{
			return new CollectPond();
		}
	}
	CollectOp.prototype = new Operator();

	function ReduceOp(init, reducer) // (res,data) -> res
	{
		function ReducePond()
		{
		}
		ReducePond.prototype = new Terminal();
		ReducePond.prototype.settling = function()
		{
			return init;
		};
		ReducePond.prototype.accept = function(d)
		{
			this.settle(reducer(this.settle(), d));
			return true;
		};

		this.newPond = function()
		{
			return new ReducePond();
		};
	}
	ReduceOp.prototype = new Operator();

	function TakeOp(num)
	{
		function TakePond()
		{
		}
		TakePond.prototype = new Terminal();
		TakePond.prototype.settling = function()
		{
			return [];
		};
		TakePond.prototype.accept = function(d)
		{
			if (this.settle().length < num)
			{
				this.settle().push(d);
				return true;
			}
			else
			{
				return false;
			}
		};

		this.newPond = function()
		{
			return new TakePond();
		};
	}
	TakeOp.prototype = new Operator();

	function Canal()
	{
		var self = this;
		var tail = null;
		var data = null;

		var chain = function(pond)
		{
			for (prev = tail; prev != null; prev = prev.upstream)
			{
				var temp = prev.newPond();
				temp.downstream = pond;
				pond = temp;
			}
			return pond;
		};

		var calc = function(entr, data)
		{
			entr.begin();

			for (i in data)
			{
				if (!entr.accept(data[i]))
				{
					break;
				}
			}

			entr.done();
		};

		this.evaluate = function(op) // T -> Value
		{
			if (op != null)
			{
				var data = arguments.length > 1 ? arguments[1] : this.source();

				if (data != null)
				{
					var pond = op.newPond();

					calc(chain(pond), data);

					return pond.get();
				}
				else
				{
					return undefined;
				}
			}
			else
			{
				return undefined;
			}
		};

		this.add = function(op)
		{
			op.upstream = tail;
			tail = op;
			return self;
		};

		this.source = function() // access data
		{
			if (arguments.length > 0)
			{
				data = arguments[0];
				return self;
			}
			else
			{
				return data;
			}
		};

		// Intermediate Operations

		this.distinct = function()
		{
			return this.add(new DistinctOp(arguments[0]));
		}

		this.filter = function(pred)
		{
			return this.add(new FilterOp(pred));
		};

		this.flatMap = function(fn)
		{
			return this.add(new FlatMapOp(fn));
		};

		this.foreach = function(fn)
		{
			return this.add(new ForeachOp(fn));
		};

		this.groupBy = function()
		{
			return this.add(new GroupOp(arguments[0], arguments[1]));
		};

		this.join = function(canal)
		{
			return this.add(new JoinOp(canal, arguments[1], arguments[2]));
		};

		this.map = function(fn)
		{
			return this.add(new MapOp(fn));
		};

		this.mapValues = function(fn)
		{
			return this.add(new MapValuesOp(fn));
		};

		this.sort = function()
		{
			return this.add(new SortOp(arguments.length > 0 ? arguments[0]
					: null));
		};

		// Terminate Operations

		this.collect = function()
		{
			return this.evaluate(new CollectOp());
		};

		this.count = function()
		{
			return this.map(function(d)
			{
				return 1;
			}).evaluate(new ReduceOp(0, function(res, dat)
			{
				return res + dat;
			}));
		};

		this.reduce = function(init, reducer)
		{
			return this.evaluate(new ReduceOp(init, reducer));
		};

		this.take = function(num)
		{
			return this.evaluate(new TakeOp(num));
		};
	}

	Canal.of = function(data)
	{
		return new Canal().source(data);
	};

	ROOT.Canal = Canal;

}.call(this));
