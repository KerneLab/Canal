/**
 * Functional Programming Framework of Data Processing in Javascript.
 * https://github.com/KerneLab/Canal
 */
(function()
{
	var ROOT = (typeof global === "object" && global) || this;

	// Constant of an empty array which MUST not be changed.
	var emptyArray = [];

	// Constant of the end of data flow which MUST NOT be changed or in any
	// data.
	var endOfData = {};

	// Default value of a data which returns data itself.
	var valOfData = function(d)
	{
		return d;
	};

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

	// Signum function
	var signum = function(a, b)
	{
		if (a < b)
		{
			return -1;
		}
		else if (a > b)
		{
			return 1;
		}
		else
		{
			return 0;
		}
	};

	// Default equality
	var equality = function(a, b)
	{
		return a === b ? 0 : signum(a, b);
	};

	// Flatten the hierarchical array
	var flatten = function(arr, lev, res)
	{
		if (res == null)
		{
			res = [];
		}

		var e = null;
		for (var i = 0; i < arr.length; i++)
		{
			e = arr[i];
			if ((lev > 0 || lev == null) && (e instanceof Array))
			{
				flatten(e, (lev == null ? null : lev - 1), res);
			}
			else
			{
				res.push(e);
			}
		}

		return res;
	};

	// Collect the orders array
	var collectOrders = function(kops, ascs, orders)
	{
		var asc = null;

		for (var i = 0; i < orders.length; i++)
		{
			var arg = orders[i];

			if (typeof arg === "boolean")
			{
				asc = arg;
			}
			else
			{
				if (typeof arg === "function")
				{
					kops.push(arg);
					if (asc != null)
					{
						ascs.push(asc);
					}
					asc = true;
				}
			}
		}

		if (asc != null)
		{
			ascs.push(asc);
		}
	};

	// Generate the comparator according to the orders array
	var generateComparator = function(orders)
	{
		if (orders != null)
		{
			var kops = [];
			var ascs = [];
			collectOrders(kops, ascs, orders);

			return function(a, b)
			{
				var cmp = 0;
				for (var i = 0; i < kops.length; i++)
				{
					var kop = kops[i];
					cmp = signum(kop(a), kop(b));
					if (cmp != 0)
					{
						if (!ascs[i])
						{
							cmp *= -1;
						}
						break;
					}
				}
				return cmp;
			};
		}
		else
		{
			return null;
		}
	};

	// Sort the data and collect the "same" data into each array
	var sortCollect = function(data, cmp, asc)
	{
		if (cmp != null)
		{
			data.sort(cmp);

			var last = null, next = null;
			var collect = null;
			var result = [];

			if (asc)
			{
				for (var i = 0; i < data.length; i++)
				{
					next = data[i];
					if (collect == null || cmp(last, next) != 0)
					{
						collect = [];
						result.push(collect);
					}
					collect.push(next);
					last = next;
				}
			}
			else
			{
				for (var i = data.length - 1; i >= 0; i--)
				{
					next = data[i];
					if (collect == null || cmp(last, next) != 0)
					{
						collect = [];
						result.push(collect);
					}
					collect.push(next);
					last = next;
				}
			}

			return result;
		}
		else
		{
			return [ data ];
		}
	};

	// Seek an index when the condition is satisfied
	var seekIndexWhen = function(rows, kop, from, direct, last, cmp, val)
	{
		if (direct == 0)
		{
			return from;
		}

		var toTail = direct > 0 ? true : false;
		var length = rows.length;

		var index = null, cur = null;
		for (var i = from; toTail && i < length || !toTail && i >= 0; i += direct)
		{
			cur = kop(rows[i]);

			if (last)
			{
				if (!cmp(cur, val))
				{
					break;
				}
				index = i;
			}
			else
			{
				if (cmp(cur, val))
				{
					index = i;
					break;
				}
			}
		}

		return index;
	};

	var addWindowItem = function(c, aggr, updt, expr, alias, partBy, orderBy, between, byRows)
	{
		aggr = aggr != null ? aggr : function()
		{
			return undefined;
		};

		updt = updt != null ? updt : function(agg)
		{
			return agg;
		};

		expr = expr != null ? expr : function(pos, upd)
		{
			return upd;
		};

		var preced = null, follow = null;
		if (between != null)
		{
			preced = between[0];
			follow = between[1];
			byRows = byRows == null ? true : byRows;
		}
		else
		{
			byRows = null;
		}

		var last = true, first = false;

		var le = function(a, b)
		{
			return a <= b;
		}, ge = function(a, b)
		{
			return a >= b;
		};

		var kops = [], ascs = [], kop = null, asc = null;
		if (orderBy != null && orderBy.length > 0)
		{
			collectOrders(kops, ascs, orderBy);
			kop = kops[0];
			asc = ascs[0];
		}

		var makeRangeBeginSeeker = function(preced, kop, asc)
		{
			var dir = preced < 0 ? -1 : 1;
			var lst = preced < 0 ? last : first;
			var cmp = asc ? ge : le;

			return function(rows, current, preced, levelBegin, levelEnd)
			{
				var begin = null;

				if (preced == null)
				{
					begin = 0;
				}
				else if (preced == 0)
				{
					begin = levelBegin;
				}
				else
				{
					var from = preced < 0 ? levelBegin : (levelEnd - 1);
					var far = current + (asc ? 1 : -1) * preced;
					begin = seekIndexWhen(rows, kop, from, dir, lst, cmp, far);
				}

				return begin;
			};
		};

		var makeRangeEndSeeker = function(follow, kop, asc)
		{
			var dir = follow > 0 ? 1 : -1;
			var lst = follow > 0 ? last : first;
			var cmp = asc ? le : ge;

			return function(rows, current, follow, levelBegin, levelEnd)
			{
				var end = null;

				if (follow == null)
				{
					end = rows.length - 1;
				}
				else if (follow == 0)
				{
					end = levelEnd - 1;
				}
				else
				{
					var from = follow > 0 ? (levelEnd - 1) : levelBegin;
					var far = current + (asc ? 1 : -1) * follow;
					end = seekIndexWhen(rows, kop, from, dir, lst, cmp, far);
				}

				if (end != null)
				{
					end++;
				}

				return end;
			};
		};

		var seeker = null;

		if (between != null)
		{
			if (byRows)
			{
				seeker = [ //
				function(rows, current, preced, levelBegin, levelEnd)
				{
					return Math.max(preced == null ? 0 : (current + preced), 0);
				}, //
				function(rows, current, follow, levelBegin, levelEnd)
				{
					return Math.min(follow == null ? rows.length : (current + follow + 1), rows.length);
				} ];
			}
			else
			{
				seeker = [ makeRangeBeginSeeker(preced, kop, asc), makeRangeEndSeeker(follow, kop, asc) ];
			}
		}

		return c.stratifyBy.apply(c, partBy) //
		.flatMap(function(part)
		{
			var partCanal = Canal.of(part);

			var ordered = partCanal.stratifyBy.apply(partCanal, orderBy).collect();

			var aggRes = aggr(ordered);

			var partRows = [], levelLength = [];

			var layer = null, res = undefined, length = null, last = null;

			for (var l = 0; l < ordered.length; l++)
			{
				layer = ordered[l];

				levelLength.push(layer.length);

				last = partRows.length;

				partRows.push.apply(partRows, layer);

				if (between == null)
				{
					length = partRows.length;

					// aggRes,partRows,winBegin,winEnd,lvlBegin,lvlEnd
					res = updt(aggRes, partRows, 0, length, length - layer.length, length);

					for (var k = 0; k < layer.length; k++)
					{
						// curntPos,updRes,partRows,winBegin,winEnd,lvlBegin,lvlEnd
						layer[k][alias] = expr(last + k, res, partRows, 0, length, length - layer.length, length);
					}
				}
			}

			ordered = null;

			if (between != null)
			{
				var begin = null, end = null;

				length = partRows.length;

				if (byRows)
				{
					var levelBegin = 0, levelEnd = 0;

					for (var i = 0; i < levelLength.length; i++)
					{
						levelEnd += levelLength[i];

						for (var j = levelBegin; j < levelEnd; j++)
						{
							begin = seeker[0](partRows, j, preced, levelBegin, levelEnd);
							end = seeker[1](partRows, j, follow, levelBegin, levelEnd);
							res = updt(aggRes, partRows, begin, end, levelBegin, levelEnd);
							partRows[j][alias] = expr(j, res, partRows, begin, end, levelBegin, levelEnd);
						}

						levelBegin = levelEnd;
					}
				}
				else
				{
					var levelBegin = 0, levelEnd = 0, val = undefined;

					for (var i = 0; i < levelLength.length; i++)
					{
						levelEnd += levelLength[i];

						val = kop(partRows[levelBegin]); // Level Value

						begin = seeker[0](partRows, val, preced, levelBegin, levelEnd);
						end = seeker[1](partRows, val, follow, levelBegin, levelEnd);

						if (begin != null && end != null)
						{
							res = updt(aggRes, partRows, begin, end, levelBegin, levelEnd);
						}
						else
						{ // Window does not exist
							res = undefined;
						}

						for (var j = levelBegin; j < levelEnd; j++)
						{
							partRows[j][alias] = expr(j, res, partRows, begin, end, levelBegin, levelEnd);
						}

						levelBegin = levelEnd;
					}
				}
			}

			return partRows;
		});
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
	Desilter.prototype.settling = null; // () => new Sediment
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

			for ( var group in settle)
			{
				if (settle.hasOwnProperty(group) //
						&& !this.downstream.accept([ group, settle[group] ]))
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
	Dam.prototype.that = function()
	{
		return undefined;
	};
	Dam.prototype.begin = function()
	{
		if (this.branch === undefined)
		{
			this.branch = this.that().collect();
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
	Joiner.prototype.that = function()
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
			var right = this.that().groupBy(this.keyR, this.valR).collectAsMap();

			var base = this.base(left, right);
			var down = this.downstream;

			for ( var k in base)
			{
				if (base.hasOwnProperty(k) && !this.join(down, k, left[k], right[k]))
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
	Operator.prototype.newPond = function() // () => Pond
	{
		return new Pond();
	};

	// Intermediate Operators

	function CartesianOp(that)
	{
		function CartesianPond()
		{
		}
		CartesianPond.prototype = new Dam();
		CartesianPond.prototype.that = function()
		{
			return that;
		};
		CartesianPond.prototype.accept = function(d)
		{
			var branch = this.branch;
			for (var i = 0; i < branch.length; i++)
			{
				if (!this.downstream.accept([ d, branch[i] ]))
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

	function ChooseOp(fn)
	{
		function ChoosePond()
		{
		}
		ChoosePond.prototype = new Pond();
		ChoosePond.prototype.accept = function(arr)
		{
			if (fn.apply(null, arr))
			{
				return this.downstream.accept(arr);
			}
			else
			{
				return true;
			}
		};

		this.newPond = function()
		{
			return new ChoosePond();
		};
	}
	ChooseOp.prototype = new Operator();

	function CogroupOp(those)
	{
		function CogroupPond()
		{
		}
		CogroupPond.prototype = new Grouper();
		CogroupPond.prototype.done = function()
		{
			if (this.downstream != null)
			{
				var settle = this.settle();
				var groups = [ settle ];
				var keys = {};
				for ( var k in settle)
				{
					if (settle.hasOwnProperty(k))
					{
						keys[k] = null;
					}
				}

				for (var i = 0; i < those.length; i++)
				{
					settle = those[i].groupBy().collectAsMap();
					for ( var k in settle)
					{
						if (settle.hasOwnProperty(k))
						{
							keys[k] = null;
						}
					}
					groups.push(settle);
				}

				for ( var key in keys)
				{
					if (keys.hasOwnProperty(key))
					{
						var comb = [];

						for (var g = 0; g < groups.length; g++)
						{
							var group = groups[g][key];
							comb.push(group != null ? group : []);
						}

						if (!this.downstream.accept([ key, comb ]))
						{
							break;
						}
					}
				}

				this.downstream.done();
			}
		};

		this.newPond = function()
		{
			return new CogroupPond();
		};
	}
	CogroupOp.prototype = new Operator();

	function DistinctOp(cmp)
	{
		cmp = cmp != null ? cmp : equality;

		function DistinctPond()
		{
		}
		DistinctPond.prototype = new Heaper();
		DistinctPond.prototype.done = function()
		{
			if (this.downstream != null)
			{
				var settle = this.settle();
				settle.sort(cmp);

				var last = endOfData, next = null;
				for (var i = 0; i < settle.length; i++)
				{
					next = settle[i];

					if (last !== endOfData && cmp(last, next) === 0)
					{
						continue;
					}

					if (!this.downstream.accept(next))
					{
						break;
					}

					last = next;
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
		FilterPond.prototype = new Wheel();
		FilterPond.prototype.accept = function(d)
		{
			if (pred(d, this.index++))
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
		FlatMapPond.prototype = new Wheel();
		FlatMapPond.prototype.accept = function(d)
		{
			var data = fn(d, this.index++);
			if (data instanceof Array)
			{
				for (var i = 0; i < data.length; i++)
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

	function FlattenOp(level)
	{
		function FlattenPond()
		{
		}
		FlattenPond.prototype = new Pond();
		FlattenPond.prototype.accept = function(arr)
		{
			return this.downstream.accept(flatten(arr, level, []));
		};

		this.newPond = function()
		{
			return new FlattenPond();
		};
	}
	FlattenOp.prototype = new Operator();

	function FullJoinOp(that, keyL, keyR, valL, valR)
	{
		keyL = keyL != null ? keyL : keyOfPair;
		keyR = keyR != null ? keyR : keyOfPair;
		valL = valL != null ? valL : valOfPair;
		valR = valR != null ? valR : valOfPair;

		function FullJoinPond()
		{
		}
		FullJoinPond.prototype = new Joiner();
		FullJoinPond.prototype.keyOf = function(d)
		{
			return keyL(d);
		};
		FullJoinPond.prototype.valOf = function(d)
		{
			return valL(d);
		};
		FullJoinPond.prototype.that = function()
		{
			return that;
		};
		FullJoinPond.prototype.base = function(left, right)
		{
			var base = {};

			for ( var i in left)
			{
				if (left.hasOwnProperty(i))
				{
					base[i] = null;
				}
			}

			for ( var i in right)
			{
				if (right.hasOwnProperty(i))
				{
					base[i] = null;
				}
			}

			return base;
		};
		FullJoinPond.prototype.join = function(down, key, lefts, rights)
		{
			if (lefts != null && rights != null)
			{
				for (var l = 0; l < lefts.length; l++)
				{
					for (var r = 0; r < rights.length; r++)
					{
						if (!down.accept([ key, //
						[ Canal.Some(lefts[l]), Canal.Some(rights[r]) ] ]))
						{
							return false;
						}
					}
				}
			}
			else if (lefts != null)
			{
				for (var l = 0; l < lefts.length; l++)
				{
					if (!down.accept([ key, //
					[ Canal.Some(lefts[l]), Canal.None() ] ]))
					{
						return false;
					}
				}
			}
			else if (rights != null)
			{
				for (var r = 0; r < rights.length; r++)
				{
					if (!down.accept([ key, //
					[ Canal.None(), Canal.Some(rights[r]) ] ]))
					{
						return false;
					}
				}
			}
			return true;
		};

		this.newPond = function()
		{
			var pond = new FullJoinPond();
			pond.keyR = keyR;
			pond.valR = valR;
			return pond;
		};
	}
	FullJoinOp.prototype = new Operator();

	function GroupOp(key, val) // (data) => key, [(data) => val]
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

	function IntersectionOp(that, cmp)
	{
		cmp = cmp != null ? cmp : equality;

		function IntersectionPond()
		{
		}
		IntersectionPond.prototype = new Dam();
		IntersectionPond.prototype.that = function()
		{
			return that;
		};
		IntersectionPond.prototype.accept = function(d)
		{
			var branch = this.branch;

			for (var i = 0; i < branch.length; i++)
			{
				if (cmp(d, branch[i]) === 0)
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

	function JoinOp(that, keyL, keyR, valL, valR)
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
		JoinPond.prototype.that = function()
		{
			return that;
		};
		JoinPond.prototype.base = function(left, right)
		{
			return left;
		};
		JoinPond.prototype.join = function(down, key, lefts, rights)
		{
			if (lefts != null && rights != null)
			{
				for (var l = 0; l < lefts.length; l++)
				{
					for (var r = 0; r < rights.length; r++)
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

	function LeftJoinOp(that, keyL, keyR, valL, valR)
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
		LeftJoinPond.prototype.that = function()
		{
			return that;
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
					for (var l = 0; l < lefts.length; l++)
					{
						for (var r = 0; r < rights.length; r++)
						{
							if (!down.accept([ key, [ lefts[l], Canal.Some(rights[r]) ] ]))
							{
								return false;
							}
						}
					}
				}
				else
				{
					for (var l = 0; l < lefts.length; l++)
					{
						if (!down.accept([ key, [ lefts[l], Canal.None() ] ]))
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

	function MapOp(fn) // (data [, index]) => Value
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

	function MapJointOp(fn) // (left,right,key) => Value
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

	function MapValuesOp(fn, val, key) // ([val..]) => Value
	{
		val = val != null ? val : valOfPair;
		key = key != null ? key : keyOfPair;

		function MapValuesPond()
		{
		}
		MapValuesPond.prototype = new Pond();
		MapValuesPond.prototype.accept = function(d)
		{
			var k = key(d);
			return this.downstream.accept([ k, fn(val(d), k) ]);
		};

		this.newPond = function()
		{
			return new MapValuesPond();
		};
	}
	MapValuesOp.prototype = new Operator();

	function PeekOp(action) // (data[,index]) => Void
	{
		function PeekPond()
		{
		}
		PeekPond.prototype = new Wheel();
		PeekPond.prototype.accept = function(d)
		{
			if (this.downstream.accept(d))
			{
				action(d, this.index++);
				return true;
			}
			else
			{
				return false;
			}
		};

		this.newPond = function()
		{
			return new PeekPond();
		};
	}
	PeekOp.prototype = new Operator();

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
				for (var i = settle.length - 1; i >= 0; i--)
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

	function RightJoinOp(that, keyL, keyR, valL, valR)
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
		RightJoinPond.prototype.that = function()
		{
			return that;
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
					for (var r = 0; r < rights.length; r++)
					{
						for (var l = 0; l < lefts.length; l++)
						{
							if (!down.accept([ key, [ Canal.Some(lefts[l]), rights[r] ] ]))
							{
								return false;
							}
						}
					}
				}
				else
				{
					for (var r = 0; r < rights.length; r++)
					{
						if (!down.accept([ key, [ Canal.None(), rights[r] ] ]))
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

	function SortOp(cmp, asc) // cmp: (a,b) => 0(=) -1(<) 1(>)
	{
		asc = asc != null ? asc : true;

		function SortPond()
		{
		}
		SortPond.prototype = new Heaper();
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

				if (asc)
				{
					for (var i = 0; i < settle.length; i++)
					{
						if (!this.downstream.accept(settle[i]))
						{
							break;
						}
					}
				}
				else
				{
					for (var i = settle.length - 1; i >= 0; i--)
					{
						if (!this.downstream.accept(settle[i]))
						{
							break;
						}
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

	function StratifyOp(cmp, asc)
	{
		asc = asc != null ? asc : true;

		function StratifyPond()
		{
		}
		StratifyPond.prototype = new Heaper();
		StratifyPond.prototype.done = function()
		{
			if (this.downstream != null)
			{
				var collect = sortCollect(this.settle(), cmp, asc);

				for (var i = 0; i < collect.length; i++)
				{
					if (!this.downstream.accept(collect[i]))
					{
						break;
					}
				}

				this.downstream.done();
			}
		};

		this.newPond = function()
		{
			return new StratifyPond();
		};
	}
	StratifyOp.prototype = new Operator();

	function SubtractOp(that, cmp)
	{
		cmp = cmp != null ? cmp : equality;

		function SubtractPond()
		{
		}
		SubtractPond.prototype = new Dam();
		SubtractPond.prototype.that = function()
		{
			return that;
		};
		SubtractPond.prototype.accept = function(d)
		{
			var found = false;
			var branch = this.branch;
			for (var i = 0; i < branch.length; i++)
			{
				if (cmp(d, branch[i]) === 0)
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

	function UnionOp(that)
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
				if (that != null)
				{
					that.converge(this.downstream);
				}
				else
				{
					this.downstream.done();
				}
			}
		};

		this.newPond = function()
		{
			return new UnionPond();
		};
	}
	UnionOp.prototype = new Operator();

	function UnpackOp(fn)
	{
		function UnpackPond()
		{
		}
		UnpackPond.prototype = new Pond();
		UnpackPond.prototype.accept = function(arr)
		{
			return this.downstream.accept(fn.apply(null, arr));
		};

		this.newPond = function()
		{
			return new UnpackPond();
		};
	}
	UnpackOp.prototype = new Operator();

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

	function CollectAsMapOp(key, val)
	{
		key = key != null ? key : keyOfPair;
		val = val != null ? val : valOfPair;
		function CollectMapPond()
		{
		}
		CollectMapPond.prototype = new Terminal();
		CollectMapPond.prototype.settling = function()
		{
			return {};
		};
		CollectMapPond.prototype.accept = function(d)
		{
			this.settle()[key(d)] = val(d);
			return true;
		};

		this.newPond = function()
		{
			return new CollectMapPond();
		};
	}
	CollectAsMapOp.prototype = new Operator();

	function FoldOp(init, folder) // (res,data) => res
	{
		function FoldPond()
		{
		}
		FoldPond.prototype = new Terminal();
		FoldPond.prototype.settling = function()
		{
			return init;
		};
		FoldPond.prototype.accept = function(d)
		{
			var res = folder(this.settle(), d);
			if (res !== undefined)
			{
				this.settle(res);
			}
			return true;
		};

		this.newPond = function()
		{
			return new FoldPond();
		};
	}
	FoldOp.prototype = new Operator();

	function ForeachOp(action) // (data[,index]) => Void
	{
		function ForeachPond()
		{
		}
		ForeachPond.prototype = new Wheel();
		ForeachPond.prototype.accept = function(d)
		{
			action(d, this.index++);
			return true;
		};
		ForeachPond.prototype.get = function()
		{
			return undefined;
		};

		this.newPond = function()
		{
			return new ForeachPond();
		};
	}
	ForeachOp.prototype = new Operator();

	function ReduceOp(reducer) // (dat1,dat2) => dat3
	{
		function ReducePond()
		{
		}
		ReducePond.prototype = new Terminal();
		ReducePond.prototype.settling = function()
		{
			return endOfData;
		};
		ReducePond.prototype.accept = function(d)
		{
			if (this.settle() !== endOfData)
			{
				this.settle(reducer(this.settle(), d));
			}
			else
			{
				this.settle(d);
			}
			return true;
		};
		ReducePond.prototype.get = function()
		{
			return this.settle() !== endOfData //
			? Canal.Some(this.settle()) : Canal.None();
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
		var upstream = null;
		var operator = null;
		var data = null;

		var chain = function(pond)
		{
			for (var prev = self; //
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

			iter.close();

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
				return new Canal().operator(op).upstream(self).source(this.source());
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

		this.converge = function(pond, data)
		{
			if (pond != null)
			{
				data = data != null ? data : this.source();

				if (data != null)
				{
					if (check())
					{
						calc(chain(pond), data);
						return pond;
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

		this.evaluate = function(op) // T => Value
		{
			if (op != null)
			{
				return this.converge(op.newPond(), arguments[1]).get();
			}
			else
			{
				throw new Error("Terminate Operator Was Not Specified.");
			}
		};

		// General Intermediate Operations

		this.cartesian = function(that)
		{
			return this.add(new CartesianOp(that));
		};

		this.distinct = function()
		{
			return this.add(new DistinctOp(arguments[0]));
		};

		this.filter = function(pred)
		{
			return this.add(new FilterOp(pred));
		};

		this.flatMap = function(mapper)
		{
			return this.add(new FlatMapOp(mapper));
		};

		this.groupBy = function()
		{
			return this.add(new GroupOp(arguments[0], arguments[1]));
		};

		this.intersection = function(that)
		{
			return this.distinct(arguments[1]) //
			.add(new IntersectionOp(that.distinct(arguments[1]), arguments[1]));
		};

		this.keyBy = function(kop)
		{
			return this.map(function(d, i)
			{
				return [ kop(d, i), d ];
			});
		};

		this.limit = function(num)
		{
			return this.filter(function(d, i)
			{
				return i < num;
			});
		};

		this.map = function(mapper)
		{
			return this.add(new MapOp(mapper));
		};

		this.peek = function(action)
		{
			return this.add(new PeekOp(action));
		};

		this.reverse = function()
		{
			return this.add(new ReverseOp());
		};

		this.skip = function(num)
		{
			return this.add(new SkipOp(num));
		};

		this.sortBy = function() // (kop1[,asc1[,kop2[,asc2...]]])
		{
			return this.sortWith(generateComparator(arguments), true);
		};

		this.sortWith = function() // [cmp[,asc]]
		{
			return this.add(new SortOp(arguments[0], arguments[1]));
		};

		this.stratifyBy = function()
		{
			return this.stratifyWith(generateComparator(arguments), true);
		};

		this.stratifyWith = function() // [cmp[,asc]]
		{
			return this.add(new StratifyOp(arguments[0], arguments[1]));
		};

		this.subtract = function(that)
		{
			return this.add(new SubtractOp(that.distinct(arguments[1]), arguments[1]));
		};

		this.union = function(that)
		{
			return this.add(new UnionOp(that));
		};

		this.window = function()
		{
			var c = this;

			for (var i = 0; i < arguments.length; i++)
			{
				var item = arguments[i];

				var aggr = item["aggr"];
				var updt = item["updt"];
				var expr = item["expr"];
				var alias = item["alias"];
				var partBy = item["part"];
				var orderBy = item["order"];
				var between = item["scope"];
				var byRows = item["byRows"];

				c = addWindowItem(c, aggr, updt, expr, alias, partBy, orderBy, between, byRows);
			}

			return c;
		};

		this.zip = function(that)
		{
			return this.map(function(d, i)
			{
				return [ i, d ];
			}).join(that.map(function(d, i)
			{
				return [ i, d ];
			})).mapJoint(function(left, right)
			{
				return [ left, right ];
			});
		};

		// Pair Intermediate Operations

		this.cogroup = function()
		{
			var those = [];
			for (var i = 0; i < arguments.length; i++)
			{
				those.push(arguments[i]);
			}
			return this.add(new CogroupOp(those));
		};

		this.foldByKey = function(zero, folder)
		{
			return this.groupBy(arguments[2], arguments[3]) //
			.mapValues(function(arr, key)
			{
				return Canal.of(arr).fold(zero(key), folder);
			});
		};

		this.fullJoin = function(that)
		{
			return this.add(new FullJoinOp(that, arguments[1], arguments[2], arguments[3], arguments[4]));
		};

		this.join = function(that)
		{
			return this.add(new JoinOp(that, arguments[1], arguments[2], arguments[3], arguments[4]));
		};

		this.keys = function()
		{
			return this.map(arguments[0] != null ? arguments[0] : keyOfPair);
		};

		this.leftJoin = function(that)
		{
			return this.add(new LeftJoinOp(that, arguments[1], arguments[2], arguments[3], arguments[4]));
		};

		this.mapJoint = function(fn)
		{
			return this.add(new MapJointOp(fn));
		};

		this.mapValues = function(fn)
		{
			return this.add(new MapValuesOp(fn, arguments[1], arguments[2]));
		};

		this.reduceByKey = function(reducer)
		{
			return this.groupBy(arguments[1], arguments[2]) //
			.mapValues(function(arr, key)
			{
				return Canal.of(arr).reduce(reducer).get();
			});
		};

		this.rightJoin = function(that)
		{
			return this.add(new RightJoinOp(that, arguments[1], arguments[2], arguments[3], arguments[4]));
		};

		this.values = function()
		{
			return this.map(arguments[0] != null ? arguments[0] : valOfPair);
		};

		// Array Intermediate Operations

		this.choose = function(pred)
		{
			return this.add(new ChooseOp(pred));
		};

		this.flatten = function() // [level]
		{
			return this.add(new FlattenOp(arguments[0]));
		};

		this.unpack = function(unpacker)
		{
			return this.add(new UnpackOp(unpacker));
		};

		// General Terminate Operations

		this.collect = function()
		{
			return this.evaluate(new CollectOp());
		};

		this.count = function()
		{
			return this.map(function(d)
			{
				return 1;
			}).fold(0, function(res, dat)
			{
				return res + dat;
			});
		};

		this.countByValue = function()
		{
			var val = arguments.length > 0 ? arguments[0] : function(d)
			{
				return d;
			};
			return this.map(function(d)
			{
				return [ val(d), 1 ];
			}).groupBy().mapValues(function(arr)
			{
				return Canal.of(arr).fold(0, function(a, b)
				{
					return a + b;
				});
			}).collectAsMap();
		};

		this.first = function()
		{
			var pred = arguments[0];

			var c = this;

			if (pred !== undefined)
			{
				c = c.filter(pred);
			}

			var arr = c.take(1);

			return arr.length > 0 ? Canal.Some(arr[0]) : Canal.None();
		};

		this.fold = function(init, folder)
		{
			return this.evaluate(new FoldOp(init, folder));
		};

		this.foreach = function(action)
		{
			this.evaluate(new ForeachOp(action));
		};

		this.reduce = function(reducer)
		{
			return this.evaluate(new ReduceOp(reducer));
		};

		this.take = function(num)
		{
			return this.evaluate(new TakeOp(num));
		};

		// Pair Terminate Operations

		this.collectAsMap = function()
		{
			return this.evaluate(new CollectAsMapOp(arguments[0], arguments[1]));
		};

		this.countByKey = function()
		{
			return this.mapValues(function()
			{
				return 1;
			}).foldByKey(function()
			{
				return 0;
			}, function(a, b)
			{
				return a + b;
			}, arguments[0]).collectAsMap();
		};
	}

	Canal.eod = function()
	{
		return endOfData;
	};

	Canal.mapOfPairs = function(pairs)
	{
		var map = {};

		for (var i = 0; i < pairs.length; i++)
		{
			var pair = pairs[i];
			map[pair[0]] = pair[1];
		}

		return map;
	};

	Canal.pairsOfMap = function(map)
	{
		var pairs = [];

		for ( var k in map)
		{
			if (map.hasOwnProperty(k))
			{
				pairs.push([ k, map[k] ]);
			}
		}

		return pairs;
	};

	function Iterator()
	{
	}
	Iterator.prototype.close = function()
	{
	};
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

	function Source(array, begin, end)
	{
		begin = Math.max(begin == null ? 0 : begin, 0);
		end = Math.min(end == null ? array.length : end, array.length);

		function SourceIterator(array, begin, end)
		{
			this.array = array;
			this.index = begin;
			this.end = end;
		}
		SourceIterator.prototype = new Iterator();
		SourceIterator.prototype.close = function()
		{
			this.array = null;
			this.index = null;
			this.end = null;
		};
		SourceIterator.prototype.hasNext = function()
		{
			return this.index < this.end;
		};
		SourceIterator.prototype.next = function()
		{
			return this.array[this.index++];
		};

		this.iterator = function()
		{
			return new SourceIterator(array, begin, end);
		};
	}
	Source.prototype = new Iterable();

	function Spring(gen, end)
	{
		function SpringIterator()
		{
			this.index = 0;
			this.value = undefined;
		}
		SpringIterator.prototype = new Iterator();
		SpringIterator.prototype.close = function()
		{
			if (typeof end === "function")
			{
				end(this.index - 1);
			}
			this.index = null;
			this.value = null;
		};
		SpringIterator.prototype.hasNext = function()
		{
			this.value = gen(this.index++);
			return this.value !== endOfData;
		};
		SpringIterator.prototype.next = function()
		{
			return this.value;
		};

		this.iterator = function()
		{
			return new SpringIterator();
		};
	}
	Spring.prototype = new Iterable();

	Canal.of = function(data)
	{
		if (data instanceof Array)
		{
			return new Canal().source(new Source(data, arguments[1], arguments[2]));
		}
		else if (typeof data === "function")
		{
			return new Canal().source(new Spring(data, arguments[1]));
		}
		else
		{
			return Canal.of(Canal.pairsOfMap(data));
		}
	};

	function Option()
	{
	}
	Option.prototype = new Canal();
	Option.prototype.get = function()
	{
		return undefined;
	};
	Option.prototype.or = function(that)
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

	function Some(val)
	{
		this.get = function()
		{
			return val;
		};
		this.source(new Source([ val ]));
	}
	Some.prototype = new Option();
	Some.prototype.or = function(that)
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

	function None()
	{
		this.source(new Source(emptyArray));
	}
	None.prototype = new Option();
	None.prototype.or = function(that)
	{
		return that;
	};
	None.prototype.orNull = function()
	{
		return null;
	};
	None.prototype.given = function()
	{
		return false;
	};

	Canal.Some = function(val)
	{
		return new Some(val);
	};

	Canal.None = function()
	{
		return new None();
	};

	Canal.wrapPicker = function(picker)
	{
		var wrap = picker;

		if (picker == null)
		{
			wrap = function()
			{
				return null;
			};
		}
		else if (typeof picker !== "function")
		{ // Extract the attribute from data by the key
			var key = picker.toString();
			wrap = function(data)
			{
				return data[key];
			};
		}

		return wrap;
	};

	Canal.field = function(picker, alias)
	{
		picker = Canal.wrapPicker(picker);

		if (alias == null && picker != null && typeof picker !== "function")
		{
			alias = picker.toString();
		}

		picker.alias = alias;

		return picker;
	};

	function Item()
	{
		this.aggr = null;
		this.updt = null;
		this.expr = null;
		this.alias = null;
		this.part = null;
		this.order = null;
		this.byRows = null;
		this.scope = null;
	}
	Item.prototype.aggregator = function()
	{
		if (arguments.length > 0)
		{
			this.aggr = arguments[0];
			return this;
		}
		else
		{
			return this.aggr;
		}
	};
	Item.prototype.updater = function()
	{
		if (arguments.length > 0)
		{
			this.updt = arguments[0];
			return this;
		}
		else
		{
			return this.updt;
		}
	};
	Item.prototype.expressor = function()
	{
		if (arguments.length > 0)
		{
			this.expr = arguments[0];
			return this;
		}
		else
		{
			return this.expr;
		}
	};
	Item.prototype.as = function()
	{
		if (arguments.length > 0)
		{
			this.alias = arguments[0];
			return this;
		}
		else
		{
			return this.alias;
		}
	};
	Item.prototype.partBy = function()
	{
		if (arguments.length > 0)
		{
			this.part = arguments;
			return this;
		}
		else
		{
			return this.part;
		}
	};
	Item.prototype.orderBy = function()
	{
		if (arguments.length > 0)
		{
			this.order = arguments;
			return this;
		}
		else
		{
			return this.order;
		}
	};
	Item.prototype.rows = function()
	{
		this.byRows = true;
		return this;
	};
	Item.prototype.range = function()
	{
		this.byRows = false;
		return this;
	};
	Item.prototype.between = function()
	{
		if (arguments.length > 1)
		{
			this.scope = [ arguments[0], arguments[1] ];
			return this;
		}
		else if (arguments.length == 1)
		{
			this.scope = arguments[0];
			return this;
		}
		else
		{
			return this.scope;
		}
	};

	Canal.item = function(oprs)
	{
		var i = new Item();
		if (typeof oprs === "function")
		{
			i.updater(oprs);
		}
		else if (oprs != null)
		{
			i.aggregator(oprs["aggr"]);
			i.updater(oprs["updt"]);
			i.expressor(oprs["expr"]);
		}
		return i;
	};

	Canal.wf = {
		"row_number" : function()
		{
			return Canal.item({
				"expr" : function(curntPos)
				{
					return curntPos + 1;
				}
			});
		},
		"count" : function(vop) // vop[,distinct[,cmp]]
		{
			var distinct = arguments.length > 1 && arguments[1] === true;
			var cmp = null;
			if (distinct)
			{
				cmp = arguments[2];
			}
			return Canal.item(function(agg, rows, begin, end)
			{
				var c = Canal.of(rows, begin, end).map(vop);
				if (distinct)
				{
					c = c.distinct(cmp);
				}
				return c.count();
			});
		},
		"sum" : function(vop)
		{
			return Canal.item(function(agg, rows, begin, end)
			{
				return Canal.of(rows, begin, end) //
				.map(vop) //
				.reduce(function(a, b)
				{
					return a + b;
				}).get();
			});
		}
	};

	Canal.on = function(cls)
	{
		var key = arguments.length > 1 ? arguments[1] : "canal";
		cls.prototype[key] = function()
		{
			var args = [ this ];
			for (var i = 0; i < arguments.length; i++)
			{
				args.push(arguments[i]);
			}
			return Canal.of.apply(this, args);
		};
	};

	Canal.off = function(cls)
	{
		var key = arguments.length > 1 ? arguments[1] : "canal";
		delete cls.prototype[key];
	};

	if (typeof exports !== "undefined")
	{
		if (typeof module !== "undefined" && module.exports)
		{
			module.exports = Canal;
		}
		else
		{
			exports = Canal;
		}
	}
	else
	{
		ROOT.Canal = Canal;
	}

}.call(this));
