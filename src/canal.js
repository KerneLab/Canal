/**
 * Functional Programming Framework of Calculation in Javascript.
 * https://github.com/KerneLab/Canal
 */
(function()
{
	var ROOT = (typeof global === "object" && global) || this;

	// Constant of an empty array which MUST not be changed.
	var emptyArray = [];

	// Default key of a pair is the 1st element of Array[2]
	var keyOfPair = function(p)
	{
		return p[0];
	};

	// Default value of a pair is the 2nd element of Array[2]
	var valOfPair = function(p)
	{
		return p[1];
	};

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
	Grouper.prototype.keyOf = keyOfPair;
	Grouper.prototype.valOf = valOfPair;
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

	function Joiner()
	{
		this.keyR = keyOfPair;
		this.valR = valOfPair;
	}
	Joiner.prototype = new Grouper();
	Joiner.prototype.canal = function()
	{
		return undefined;
	};
	Joiner.prototype.base = function(left, right)
	{
		return undefined;
	};
	Joiner.prototype.join = function(down, key, lefts, rights)
	{
		return false; // Do not join any more
	};
	Joiner.prototype.done = function()
	{
		if (this.downstream != null)
		{
			var left = this.settle();
			var rights = this.canal() //
			.groupByKey(this.keyR, this.valR) //
			.collect();
			var right = {};
			for (i in rights)
			{
				var d = rights[i];
				right[d[0]] = d[1];
			}

			var base = this.base(left, right);
			var down = this.downstream;

			for (k in base)
			{
				if (!this.join(down, k, left[k], right[k]))
				{
					break;
				}
			}

			down.done();
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
			return a === b ? 0 : 1;
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
		key = key != null ? key : keyOfPair;
		val = val != null ? val : valOfPair;
		function GroupPond()
		{
		}
		GroupPond.prototype = new Grouper();
		GroupPond.prototype.keyOf = function(d)
		{
			return key(d);
		};
		GroupPond.prototype.valOf = function(d)
		{
			return val(d);
		};

		this.newPond = function()
		{
			return new GroupPond();
		};
	}
	GroupOp.prototype = new Operator();

	function JoinOp(canal, keyL, keyR, valL, valR)
	{
		keyL = keyL != null ? keyL : keyOfPair;
		keyR = keyR != null ? keyR : keyOfPair;
		valL = valL != null ? valL : valOfPair;
		valR = valR != null ? valR : valOfPair;

		function JoinPond()
		{
		}
		JoinPond.prototype = new Joiner();
		JoinPond.prototype.keyOf = function(d)
		{
			return keyL(d);
		};
		JoinPond.prototype.valOf = function(d)
		{
			return valL(d);
		};
		JoinPond.prototype.canal = function()
		{
			return canal;
		};
		JoinPond.prototype.base = function(left, right)
		{
			return left;
		};
		JoinPond.prototype.join = function(down, key, lefts, rights)
		{
			if (lefts != null && rights != null)
			{
				for (l in lefts)
				{
					for (r in rights)
					{
						if (!down.accept([ key, [ lefts[l], rights[r] ] ]))
						{
							return false;
						}
					}
				}
			}
			return true;
		};

		this.newPond = function()
		{
			var pond = new JoinPond();
			pond.keyR = keyR;
			pond.valR = valR;
			return pond;
		};
	}
	JoinOp.prototype = new Operator();

	function LeftJoinOp(canal, keyL, keyR, valL, valR)
	{
		keyL = keyL != null ? keyL : keyOfPair;
		keyR = keyR != null ? keyR : keyOfPair;
		valL = valL != null ? valL : valOfPair;
		valR = valR != null ? valR : valOfPair;

		function LeftJoinPond()
		{
		}
		LeftJoinPond.prototype = new Joiner();
		LeftJoinPond.prototype.keyOf = function(d)
		{
			return keyL(d);
		};
		LeftJoinPond.prototype.valOf = function(d)
		{
			return valL(d);
		};
		LeftJoinPond.prototype.canal = function()
		{
			return canal;
		};
		LeftJoinPond.prototype.base = function(left, right)
		{
			return left;
		};
		LeftJoinPond.prototype.join = function(down, key, lefts, rights)
		{
			if (lefts != null)
			{
				if (rights != null)
				{
					for (l in lefts)
					{
						for (r in rights)
						{
							if (!down.accept([ key,
									[ lefts[l], Optional.Some(rights[r]) ] ]))
							{
								return false;
							}
						}
					}
				}
				else
				{
					for (l in lefts)
					{
						if (!down.accept([ key, [ lefts[l], Optional.None ] ]))
						{
							return false;
						}
					}
				}
			}
			return true;
		};

		this.newPond = function()
		{
			var pond = new LeftJoinPond();
			pond.keyR = keyR;
			pond.valR = valR;
			return pond;
		};
	}
	LeftJoinOp.prototype = new Operator();

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

	function MapValuesOp(fn, key, val) // ([val..]) -> Value
	{
		key = key != null ? key : keyOfPair;
		val = val != null ? val : valOfPair;

		function MapValuesPond()
		{
		}
		MapValuesPond.prototype = new Pond();
		MapValuesPond.prototype.accept = function(d)
		{
			return this.downstream.accept([ key(d), fn(val(d)) ]);
		};

		this.newPond = function()
		{
			return new MapValuesPond();
		};
	}
	MapValuesOp.prototype = new Operator();

	function RightJoinOp(canal, keyL, keyR, valL, valR)
	{
		keyL = keyL != null ? keyL : keyOfPair;
		keyR = keyR != null ? keyR : keyOfPair;
		valL = valL != null ? valL : valOfPair;
		valR = valR != null ? valR : valOfPair;

		function RightJoinPond()
		{
		}
		RightJoinPond.prototype = new Joiner();
		RightJoinPond.prototype.keyOf = function(d)
		{
			return keyL(d);
		};
		RightJoinPond.prototype.valOf = function(d)
		{
			return valL(d);
		};
		RightJoinPond.prototype.canal = function()
		{
			return canal;
		};
		RightJoinPond.prototype.base = function(left, right)
		{
			return right;
		};
		RightJoinPond.prototype.join = function(down, key, lefts, rights)
		{
			if (rights != null)
			{
				if (lefts != null)
				{
					for (r in rights)
					{
						for (l in lefts)
						{
							if (!down.accept([ key,
									[ Optional.Some(lefts[l]), rights[r] ] ]))
							{
								return false;
							}
						}
					}
				}
				else
				{
					for (r in rights)
					{
						if (!down.accept([ key, [ Optional.None, rights[r] ] ]))
						{
							return false;
						}
					}
				}
			}
			return true;
		};

		this.newPond = function()
		{
			var pond = new RightJoinPond();
			pond.keyR = keyR;
			pond.valR = valR;
			return pond;
		};
	}
	RightJoinOp.prototype = new Operator();

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

		this.groupByKey = function()
		{
			return this.add(new GroupOp(arguments[0], arguments[1]));
		};

		this.join = function(canal)
		{
			return this.add(new JoinOp(canal, arguments[1], arguments[2],
					arguments[3], arguments[4]));
		};

		this.leftJoin = function(canal)
		{
			return this.add(new LeftJoinOp(canal, arguments[1], arguments[2],
					arguments[3], arguments[4]));
		};

		this.map = function(fn)
		{
			return this.add(new MapOp(fn));
		};

		this.mapValues = function(fn)
		{
			return this.add(new MapValuesOp(fn, arguments[1], arguments[2]));
		};

		this.rightJoin = function(canal)
		{
			return this.add(new RightJoinOp(canal, arguments[1], arguments[2],
					arguments[3], arguments[4]));
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

	function Optional()
	{
	}
	Optional.prototype.get = function()
	{
		return undefined;
	};
	Optional.prototype.or = function(other)
	{
		return undefined;
	};
	Optional.prototype.orNull = function()
	{
		return undefined;
	};
	Optional.prototype.given = function()
	{
		return undefined;
	};
	Optional.prototype.canal = function()
	{
		return undefined;
	};

	function Some(val)
	{
		this.val = val;
	}
	Some.prototype = new Optional();
	Some.prototype.get = function()
	{
		return this.val;
	};
	Some.prototype.or = function(other)
	{
		return this.get();
	};
	Some.prototype.orNull = function()
	{
		return this.get();
	};
	Some.prototype.given = function()
	{
		return true;
	};
	Some.prototype.canal = function()
	{
		return new Canal().source([ this.get() ]);
	};

	Optional.Some = function(val)
	{
		return new Some(val);
	};

	function None()
	{
	}
	None.prototype = new Optional();
	None.prototype.or = function(other)
	{
		return other;
	};
	None.prototype.orNull = function()
	{
		return null;
	};
	None.prototype.given = function()
	{
		return false;
	};
	None.prototype.canal = function()
	{
		return new Canal().source(emptyArray);
	};

	Optional.None = new None();

	ROOT.Canal = Canal;

}.call(this));
