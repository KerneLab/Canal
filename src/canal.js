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

	// Default equality
	var equality = function(a, b)
	{
		return a === b;
	}

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

	function Wheel()
	{
		this.index = undefined;
	}
	Wheel.prototype = new Pond();
	Wheel.prototype.begin = function() // Void
	{
		if (this.index === undefined)
		{
			this.index = 0;
		}
		if (this.downstream != null)
		{
			this.downstream.begin();
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
		if (this.settle() === undefined && this.settling != null)
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

	function Heaper()
	{
	}
	Heaper.prototype = new Desilter();
	Heaper.prototype.settling = function()
	{
		return [];
	};
	Heaper.prototype.accept = function(d)
	{
		this.settle().push(d);
		return true;
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

	function Dam()
	{
		this.branch = undefined;
	}
	Dam.prototype = new Pond();
	Dam.prototype.tributary = function()
	{
		return undefined;
	};
	Dam.prototype.begin = function()
	{
		if (this.branch === undefined)
		{
			this.branch = this.tributary().collect();
		}
		if (this.downstream != null)
		{
			this.downstream.begin();
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
			var right = Canal.mapOfPairs(this.canal() //
			.groupBy(this.keyR, this.valR).collect());

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
	}
	Operator.prototype.newPond = function() // () -> Pond
	{
		return new Pond();
	};

	// Intermediate Operators

	function CartesianOp(canal)
	{
		function CartesianPond()
		{
			this.mate = undefined;
		}
		CartesianPond.prototype = new Pond();
		CartesianPond.prototype.begin = function()
		{
			if (this.mate === undefined)
			{
				this.mate = canal.collect();
			}
			if (this.downstream != null)
			{
				this.downstream.begin();
			}
		};
		CartesianPond.prototype.accept = function(d)
		{
			var mate = this.mate;
			for (i in mate)
			{
				if (!this.downstream.accept([ d, mate[i] ]))
				{
					return false;
				}
			}
			return true;
		};

		this.newPond = function()
		{
			return new CartesianPond();
		};
	}
	CartesianOp.prototype = new Operator();

	function DistinctOp(eq)
	{
		eq = eq != null ? eq : equality;

		function DistinctPond()
		{
		}
		DistinctPond.prototype = new Heaper();
		DistinctPond.prototype.accept = function(d)
		{
			var found = false;
			var settle = this.settle();
			for (i in settle)
			{
				if (eq(d, settle[i]))
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

	function FirstOp(num)
	{
		if (num == null)
		{
			num = 1;
		}

		function FirstPond()
		{
		}
		FirstPond.prototype = new Wheel();
		FirstPond.prototype.accept = function(d)
		{
			if (this.index < num)
			{
				this.index++;
				return this.downstream.accept(d);
			}
			else
			{
				return false;
			}
		};

		this.newPond = function()
		{
			return new FirstPond();
		};
	}
	FirstOp.prototype = new Operator();

	function FlatMapOp(fn)
	{
		function FlatMapPond()
		{
		}
		FlatMapPond.prototype = new Wheel();
		FlatMapPond.prototype.accept = function(d)
		{
			var data = fn(d, this.index++);
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

	function ForeachOp(fn) // (data[,index]) -> Void
	{
		function ForeachPond()
		{
		}
		ForeachPond.prototype = new Wheel();
		ForeachPond.prototype.accept = function(d)
		{
			fn(d, this.index++);
			return this.downstream.accept(d);
		};

		this.newPond = function()
		{
			return new ForeachPond();
		};
	}
	ForeachOp.prototype = new Operator();

	function IntersectionOp(canal, eq)
	{
		eq = eq != null ? eq : equality;

		function IntersectionPond()
		{
		}
		IntersectionPond.prototype = new Dam();
		IntersectionPond.prototype.tributary = function()
		{
			return canal;
		};
		IntersectionPond.prototype.accept = function(d)
		{
			var branch = this.branch;

			for (i in branch)
			{
				if (eq(d, branch[i]))
				{
					return this.downstream.accept(d);
				}
			}

			return true;
		};

		this.newPond = function()
		{
			return new IntersectionPond();
		};
	}
	IntersectionOp.prototype = new Operator();

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
									[ lefts[l], Option.Some(rights[r]) ] ]))
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
						if (!down.accept([ key, [ lefts[l], Option.None ] ]))
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

	function MapOp(fn) // (data [, index]) -> Value
	{
		function MapPond()
		{
		}
		MapPond.prototype = new Wheel();
		MapPond.prototype.accept = function(d)
		{
			return this.downstream.accept(fn(d, this.index++));
		};

		this.newPond = function()
		{
			return new MapPond();
		};
	}
	MapOp.prototype = new Operator();

	function MapJointOp(fn) // (left,right,key) -> Value
	{
		function MapJointPond()
		{
		}
		MapJointPond.prototype = new Pond();
		MapJointPond.prototype.accept = function(d)
		{
			var joint = d[1];
			return this.downstream.accept(fn(joint[0], joint[1], d[0]));
		};

		this.newPond = function()
		{
			return new MapJointPond();
		};
	}
	MapJointOp.prototype = new Operator();

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

	function ReverseOp()
	{
		function ReversePond()
		{
		}
		ReversePond.prototype = new Heaper();
		ReversePond.prototype.done = function()
		{
			if (this.downstream != null)
			{
				var settle = this.settle();
				settle.reverse();
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
			return new ReversePond();
		};
	}
	ReverseOp.prototype = new Operator();

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
									[ Option.Some(lefts[l]), rights[r] ] ]))
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
						if (!down.accept([ key, [ Option.None, rights[r] ] ]))
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

	function SkipOp(num)
	{
		function SkipPond()
		{
		}
		SkipPond.prototype = new Wheel();
		SkipPond.prototype.accept = function(d)
		{
			if (this.index >= num)
			{
				return this.downstream.accept(d);
			}
			else
			{
				this.index++;
				return true;
			}
		};

		this.newPond = function()
		{
			return new SkipPond();
		};
	}
	SkipOp.prototype = new Operator();

	function SortOp(cmp, asc) // cmp: (a,b) -> 0(=) -1(<) 1(>)
	{
		asc = asc != null ? asc : true;

		var comp = cmp;
		if (cmp != null && !asc)
		{
			comp = function(a, b)
			{
				return cmp(b, a);
			}
		}

		function SortPond()
		{
		}
		SortPond.prototype = new Heaper();
		SortPond.prototype.done = function(d)
		{
			if (this.downstream != null)
			{
				var settle = this.settle();
				if (comp != null)
				{
					settle.sort(comp);
				}
				else
				{
					settle.sort();
					if (!asc)
					{
						settle.reverse();
					}
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

	function SubtractOp(canal, eq)
	{
		eq = eq != null ? eq : equality;

		function SubtractPond()
		{
		}
		SubtractPond.prototype = new Dam();
		SubtractPond.prototype.tributary = function()
		{
			return canal;
		};
		SubtractPond.prototype.accept = function(d)
		{
			var found = false;
			var branch = this.branch;
			for (i in branch)
			{
				if (eq(d, branch[i]))
				{
					found = true;
					break;
				}
			}
			if (!found)
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
			return new SubtractPond();
		};
	}
	SubtractOp.prototype = new Operator();

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
		};
		CollectPond.prototype.accept = function(d)
		{
			this.settle().push(d);
			return true;
		};

		this.newPond = function()
		{
			return new CollectPond();
		};
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
			var res = reducer(this.settle(), d);
			if (res !== undefined)
			{
				this.settle(res);
			}
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

	function UnionOp(other)
	{
		function UnionPond()
		{
		}
		UnionPond.prototype = new Pond();
		UnionPond.prototype.accept = function(d)
		{
			return this.downstream.accept(d);
		};
		UnionPond.prototype.done = function()
		{
			if (this.downstream != null)
			{
				other.execute(this.downstream);
			}
		};

		this.newPond = function()
		{
			return new UnionPond();
		};
	}
	UnionOp.prototype = new Operator();

	function Option()
	{
	}
	Option.prototype.get = function()
	{
		return undefined;
	};
	Option.prototype.or = function(other)
	{
		return undefined;
	};
	Option.prototype.orNull = function()
	{
		return undefined;
	};
	Option.prototype.given = function()
	{
		return undefined;
	};
	Option.prototype.canal = function()
	{
		return undefined;
	};

	function Some(val)
	{
		this.val = val;
	}
	Some.prototype = new Option();
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

	Option.Some = function(val)
	{
		return new Some(val);
	};

	function None()
	{
	}
	None.prototype = new Option();
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

	Option.None = new None();

	function Iterator()
	{
	}
	Iterator.prototype.hasNext = function()
	{
		return undefined;
	};
	Iterator.prototype.next = function()
	{
		return undefined;
	};

	function Iterable()
	{
	}
	Iterable.prototype.iterator = function()
	{
		return undefined;
	};

	function Source(array)
	{
		var length = array.length;

		function SourceIterator()
		{
			this.index = 0;
		}
		SourceIterator.prototype = new Iterator();
		SourceIterator.prototype.hasNext = function()
		{
			return this.index < length;
		};
		SourceIterator.prototype.next = function()
		{
			return array[this.index++];
		};

		this.iterator = function()
		{
			return new SourceIterator();
		};
	}
	Source.prototype = new Iterable();

	function Spring(gen)
	{
		function SpringIterator()
		{
			this.index = 0;
		}
		SpringIterator.prototype = new Iterator();
		SpringIterator.prototype.hasNext = function()
		{
			return true;
		};
		SpringIterator.prototype.next = function()
		{
			return gen(this.index++);
		};

		this.iterator = function()
		{
			return new SpringIterator();
		};
	}
	Spring.prototype = new Iterable();

	function Canal()
	{
		var self = this;
		var upstream = null;
		var operator = null;
		var data = null;

		var chain = function(pond)
		{
			for (prev = self; //
			prev != null && prev.operator() != null; //
			prev = prev.upstream())
			{
				var temp = prev.operator().newPond();
				temp.downstream = pond;
				pond = temp;
			}
			return pond;
		};

		var calc = function(entr, data)
		{
			entr.begin();

			var iter = data.iterator();

			while (iter.hasNext())
			{
				if (!entr.accept(iter.next()))
				{
					break;
				}
			}

			entr.done();
		};

		var check = function()
		{
			var slow = self, fast = self;

			while (slow != null && fast.upstream() != null)
			{
				slow = slow.upstream();

				fast = fast.upstream().upstream();
				if (fast == null)
				{
					break;
				}

				if (slow == fast)
				{
					return false;
				}
			}

			return true;
		};

		this.upstream = function()
		{
			if (arguments.length > 0)
			{
				upstream = arguments[0];
				return self;
			}
			else
			{
				return upstream;
			}
		};

		this.operator = function()
		{
			if (arguments.length > 0)
			{
				operator = arguments[0];
				return self;
			}
			else
			{
				return operator;
			}
		};

		this.add = function(op)
		{
			if (op != null)
			{
				return new Canal().operator(op).upstream(self).source(
						this.source());
			}
			else
			{
				throw new Error("Intermediate Operator Should Not Be null.");
			}
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

		this.execute = function(pond, data)
		{
			if (pond != null)
			{
				data = data != null ? data : this.source();

				if (data != null)
				{
					if (check())
					{
						calc(chain(pond), data);
						return pond.get();
					}
					else
					{
						throw new Error("Loop Dependency Was Detected.");
					}
				}
				else
				{
					throw new Error("Data Source Was Not Specified.");
				}
			}
			else
			{
				throw new Error("Downstream Pond Was Not Specified.");
			}
		};

		this.evaluate = function(op) // T -> Value
		{
			if (op != null)
			{
				return this.execute(op.newPond(), arguments[1]);
			}
			else
			{
				throw new Error("Terminate Operator Was Not Specified.");
			}
		};

		// Intermediate Operations

		this.cartesian = function(canal)
		{
			return this.add(new CartesianOp(canal));
		};

		this.distinct = function()
		{
			return this.add(new DistinctOp(arguments[0]));
		}

		this.filter = function(pred)
		{
			return this.add(new FilterOp(pred));
		};

		this.first = function(num)
		{
			return this.add(new FirstOp(num));
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

		this.intersection = function(canal)
		{
			return this.add(new IntersectionOp(canal, arguments[1]));
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

		this.mapJoint = function(fn)
		{
			return this.add(new MapJointOp(fn));
		};

		this.mapValues = function(fn)
		{
			return this.add(new MapValuesOp(fn, arguments[1], arguments[2]));
		};

		this.reverse = function()
		{
			return this.add(new ReverseOp());
		};

		this.rightJoin = function(canal)
		{
			return this.add(new RightJoinOp(canal, arguments[1], arguments[2],
					arguments[3], arguments[4]));
		};

		this.skip = function(num)
		{
			return this.add(new SkipOp(num));
		};

		this.sortWith = function() // [cmp[,asc]]
		{
			return this.add(new SortOp(arguments[0], arguments[1]));
		};

		this.subtract = function(canal)
		{
			return this.add(new SubtractOp(canal, arguments[1]));
		};

		this.union = function(canal)
		{
			return this.add(new UnionOp(canal));
		};

		this.zip = function(canal)
		{
			return this.map(function(d, i)
			{
				return [ i, d ];
			}).join(canal.map(function(d, i)
			{
				return [ i, d ];
			})).mapJoint(function(left, right)
			{
				return [ left, right ];
			});
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

		this.countByValue = function()
		{
			var val = arguments.length > 0 ? arguments[0] : function(d)
			{
				return d;
			};
			return Canal.mapOfPairs(this.map(function(d)
			{
				return [ val(d), 1 ];
			}).groupBy().mapValues(function(arr)
			{
				return Canal.of(arr).reduce(0, function(a, b)
				{
					return a + b;
				});
			}).collect());
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
		if (data instanceof Array)
		{
			return new Canal().source(new Source(data));
		}
		else if (data instanceof Function)
		{
			return new Canal().source(new Spring(data));
		}
		else
		{
			return Canal.of(Canal.pairsOfMap(data));
		}
	};

	Canal.mapOfPairs = function(pairs)
	{
		var map = {};

		for (i in pairs)
		{
			var pair = pairs[i];
			map[pair[0]] = pair[1];
		}

		return map;
	};

	Canal.pairsOfMap = function(map)
	{
		var pairs = [];

		for (i in map)
		{
			pairs.push([ i, map[i] ]);
		}

		return pairs;
	};

	ROOT.Canal = Canal;

}.call(this));
