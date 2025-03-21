/*! canal.js v1.0.61 2025-03-18 */
/**
 * Functional Programming Framework of Data Processing in Javascript.
 * https://github.com/KerneLab/Canal
 */
(function(global, factory)
{
	typeof exports === "object" && typeof module !== "undefined" ? (module.exports = factory()) : typeof define === "function" && define.amd ? define(factory) : (global.Canal = factory());
}(this, (function()
{
	"use strict";

	// Constant of an empty array which MUST not be changed
	var emptyArray = [];

	// Constant of the end of data flow which MUST NOT be changed or in any
	// data
	var endOfData = {};

	// Default value of a data which returns data itself
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

	// The function which always returns null
	var nullData = function()
	{
		return null;
	};

	// The function which always returns undefined
	var undefineData = function()
	{
		return undefined;
	};

	// Return the second argument if the first one is null or undefined
	var nvl = function(val, bak)
	{
		return val == null ? bak : val;
	};

	var nvl0 = function(val)
	{
		return nvl(val, 0);
	};

	// The function which doesn't do anything
	var voidAction = function()
	{
	};

	// Make an item stand for pick all columns of the object
	var pickAllColumns = function(obj)
	{
		var pick = function()
		{
			return obj;
		};
		pick.all = true;
		return pick;
	};

	// Make a Spring source according to given range
	var range = function(begin, until, step)
	{
		if (step == null)
		{
			step = 1;
		}

		var index = begin - step;

		return new Spring(function()
		{
			var has = false;

			if (begin < until)
			{
				has = step > 0 && index + step < until;
			}
			else if (begin > until)
			{
				has = step < 0 && index + step > until;
			}

			if (has)
			{
				return index += step;
			}
			else
			{
				return endOfData;
			}
		});
	};

	// Signum function which could compare LVal1 vs RVal1, LVal2 vs RVal2 ...
	var signum = function()
	{
		var l, r;
		for (var i = 0; i < arguments.length - 1; i += 2)
		{
			l = arguments[i];
			r = arguments[i + 1];
			if (l < r)
			{
				return -1;
			}
			else if (l > r)
			{
				return 1;
			}
		}
		return 0;
	};

	// Compare two value by given order
	var cmpval = function(a, b, asc, nullsFirst)
	{
		if (a == b)
		{
			return 0;
		}
		if (a == null || b == null)
		{
			if (nullsFirst === true)
			{
				return a == null ? -1 : 1;
			}
			else
			{
				return a == null ? 1 : -1;
			}
		}
		return a < b ? -1 * asc : 1 * asc;
	};

	// Make a comparator to compare to two object according to given fields
	var comparator = function()
	{
		var fields = [];
		for (var i = 0; i < arguments.length; i++)
		{
			fields.push(arguments[i]);
		}

		return function(a, b)
		{
			if (a == b)
			{
				return 0;
			}
			else if (a == null)
			{
				return -1;
			}
			else if (b == null)
			{
				return 1;
			}
			else
			{
				var c = 0, f = null;
				for (var i = 0; i < fields.length; i++)
				{
					f = fields[i];
					c = signum(a[f], b[f]);
					if (c != 0)
					{
						return c;
					}
				}
				return 0;
			}
		};
	};

	// Default equality
	var equality = function(a, b)
	{
		return a === b ? 0 : signum(a, b);
	};

	// Decide whether the value is a plain object or not
	var isObject = function(val)
	{
		return val != null && val.constructor == Object;
	};

	// Decide whether the value is a plain array or not
	var isArray = function(val)
	{
		return val != null && val.constructor == Array;
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
				asc = arg === false ? -1 : 1;
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
					asc = arg.order === false ? -1 : 1;
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
		var kops = [];
		var ascs = [];
		collectOrders(kops, ascs, orders);

		return function(a, b)
		{
			var cmp = 0;
			for (var i = 0; i < kops.length; i++)
			{
				var kop = kops[i];
				cmp = cmpval(kop(a), kop(b), ascs[i], kop.nulls == "first");
				if (cmp != 0)
				{
					break;
				}
			}
			return cmp;
		};
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
		// Aggregation on each partition
		aggr = aggr != null ? aggr : undefineData;

		// Updater for each level
		updt = updt != null ? updt : function(agg)
		{
			return agg;
		};

		// Expression for each row
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
			return a <= b && a != null && b != null || a == null && b == null;
		}, ge = function(a, b)
		{
			return a >= b && a != null && b != null || a == null && b == null;
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
			var cmp = asc > 0 ? ge : le;

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
					var far = current != null ? current + asc * preced : null;
					begin = seekIndexWhen(rows, kop, from, dir, lst, cmp, far);
				}

				return begin;
			};
		};

		var makeRangeEndSeeker = function(follow, kop, asc)
		{
			var dir = follow > 0 ? 1 : -1;
			var lst = follow > 0 ? last : first;
			var cmp = asc > 0 ? le : ge;

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
					var far = current != null ? current + asc * follow : null;
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
	Pond.prototype.accept = undefined; // (data) => accept or not
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
	Dam.prototype.that = undefined; // () => that data
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
	// () => that data
	Joiner.prototype.that = undefined; // () => that data
	Joiner.prototype.base = undefined; // (left,right) => base data
	// (down,key,lefts,rights) => continue or not
	Joiner.prototype.join = undefined;
	Joiner.prototype.done = function()
	{
		if (this.downstream != null)
		{
			var left = this.settle();
			var right = this.that().groupByKey(this.keyR, this.valR).collectAsMap();

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
	Operator.prototype.newPond = undefined; // () => Pond

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
					settle = those[i].groupByKey().collectAsMap();
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
				var sorts = [];
				for (var i = 0; i < settle.length; i++)
				{
					sorts.push([ i, settle[i] ]);
				}
				sorts.sort(function(a, b)
				{
					var c = cmp(a[1], b[1]);
					if (c != 0)
					{
						return c;
					}
					return a[0] - b[0];
				});
				var need = {}, last = endOfData, next = null;
				for (var i = 0; i < sorts.length; i++)
				{
					next = sorts[i][1];
					if (last !== endOfData && cmp(last, next) === 0)
					{
						continue;
					}
					need[sorts[i][0]] = true;
					last = next;
				}

				for (var i = 0; i < settle.length; i++)
				{
					if (need[i] && !this.downstream.accept(settle[i]))
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
		fn = fn != null ? fn : function(d)
		{
			return d;
		};

		function FlatMapPond()
		{
		}
		FlatMapPond.prototype = new Wheel();
		FlatMapPond.prototype.accept = function(d)
		{
			var data = fn(d, this.index++);
			for (var i = 0; i < data.length; i++)
			{
				if (!this.downstream.accept(data[i]))
				{
					return false;
				}
			}
			return true;
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
			return this.downstream.accept(flatten(arr, level));
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

	function LimitOp(num)
	{
		function LimitPond()
		{
		}
		LimitPond.prototype = new Wheel();
		LimitPond.prototype.accept = function(d)
		{
			if (num == null || num < 0 || this.index++ < num)
			{
				return this.downstream.accept(d);
			}
			else
			{
				if (this.downstream != null)
				{
					this.downstream.done();
				}
				return false;
			}
		};

		this.newPond = function()
		{
			return new LimitPond();
		};
	}
	LimitOp.prototype = new Operator();

	function MapOp(fn) // (data[, index]) => Value
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

	function MapWithStateOp(st, fn) // (data[,state,[index]]) => Value
	{
		if (typeof (st) === "function")
		{
			st = st();
		}
		function MapWithStatePond()
		{
		}
		MapWithStatePond.prototype = new Wheel();
		MapWithStatePond.prototype.accept = function(d)
		{
			return this.downstream.accept(fn(d, st, this.index++));
		};

		this.newPond = function()
		{
			return new MapWithStatePond();
		};
	}
	MapWithStateOp.prototype = new Operator();

	function PeekOp(action) // (data[,index]) => Void
	{
		action = action == null ? voidAction : action;
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

	function SlidingOp(size, step)
	{
		function SlidingPond()
		{
			this.gap = 0;
			this.added = false;
		}
		SlidingPond.prototype = new Desilter();
		SlidingPond.prototype.settling = function()
		{
			return null;
		};
		SlidingPond.prototype.accept = function(d)
		{
			if (size == null || size <= 0)
			{
				return false;
			}

			if (this.gap > 0)
			{
				this.gap--;
				return true;
			}

			if (this.settle() == null)
			{
				this.settle([]);
			}

			if (this.settle().length < size)
			{
				this.settle().push(d);
				this.added = true;
			}

			if (this.settle().length == size)
			{
				var res = this.downstream.accept(this.settle());
				this.settle(step >= size ? [] : this.settle().slice(step));
				this.gap = step - size;
				this.added = false;
				return res;
			}

			return true;
		};
		SlidingPond.prototype.done = function(d)
		{
			if (this.settle() != null && this.added === true)
			{
				this.downstream.accept(this.settle());
			}
			this.downstream.done();
		};

		this.newPond = function()
		{
			return new SlidingPond();
		};
	}
	SlidingOp.prototype = new Operator();

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

	function UntilOp(until, drop)
	{
		function UntilPond()
		{
			if (drop != null)
			{
				drop[0] = Canal.None();
			}
		}
		UntilPond.prototype = new Wheel();
		UntilPond.prototype.accept = function(d)
		{
			if (until(d, this.index++))
			{
				if (drop != null)
				{
					drop[0] = Canal.Some(d);
				}
				if (this.downstream != null)
				{
					this.downstream.done();
				}
				return false;
			}
			else
			{
				return this.downstream.accept(d);
			}
		};

		this.newPond = function()
		{
			return new UntilPond();
		};
	}
	UntilOp.prototype = new Operator();

	function ZipWithPhaseOp()
	{
		function ZipWithPhasePond()
		{
			this.next = endOfData;
			this.head = 1;
		}
		ZipWithPhasePond.prototype = new Pond();
		ZipWithPhasePond.prototype.accept = function(d)
		{
			if (this.next == endOfData)
			{
				this.next = d;
				return true;
			}
			else
			{
				var n = this.next, h = this.head;
				this.next = d;
				this.head = 0;
				return this.downstream.accept([ n, h | 0 ]);
			}
		};
		ZipWithPhasePond.prototype.done = function(d)
		{
			if (this.downstream != null)
			{
				if (this.next != endOfData)
				{
					this.downstream.accept([ this.next, this.head | 2 ]);
				}
				this.downstream.done();
			}
		};

		this.newPond = function()
		{
			return new ZipWithPhasePond();
		};
	}
	ZipWithPhaseOp.prototype = new Operator();

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

	function FoldOp(init, folder, until) // (res,data) => res
	{
		function FoldPond()
		{
			this.empty = true;
			this.meet = until == null;
		}
		FoldPond.prototype = new Terminal();
		FoldPond.prototype.settling = function()
		{
			return typeof (init) == "function" ? endOfData : init;
		};
		FoldPond.prototype.accept = function(d)
		{
			if (this.empty)
			{
				this.empty = false;
				if (typeof (init) == "function")
				{
					this.settle(init());
				}
			}
			var res = folder(this.settle(), d);
			if (res !== undefined)
			{
				this.settle(res);
			}
			if (until != null && until(this.settle()))
			{
				this.meet = true;
				return false;
			}
			return true;
		};
		FoldPond.prototype.get = function()
		{
			if (typeof (init) != "function" && until == null)
			{
				return this.settle();
			}
			else
			{
				return this.meet && !this.empty //
				? Canal.Some(this.settle()) : Canal.None();
			}
		};

		this.newPond = function()
		{
			return new FoldPond();
		};
	}
	FoldOp.prototype = new Operator();

	function ForallOp(cond)
	{
		function ForallPond()
		{
			this.meet = true;
		}
		ForallPond.prototype = new Terminal();
		ForallPond.prototype.settle = function()
		{
			return this.meet;
		};
		ForallPond.prototype.accept = function(d)
		{
			if (!cond(d))
			{
				this.meet = false;
				return false;
			}
			else
			{
				return true;
			}
		};

		this.newPond = function()
		{
			return new ForallPond();
		};
	}
	ForallOp.prototype = new Operator();

	function ForeachOp(action) // (data[,index]) => Void
	{
		action = action == null ? voidAction : action;
		function ForeachPond()
		{
		}
		ForeachPond.prototype = new Wheel();
		ForeachPond.prototype.accept = function(d)
		{
			action(d, this.index++);
			return true;
		};
		ForeachPond.prototype.get = undefineData;

		this.newPond = function()
		{
			return new ForeachPond();
		};
	}
	ForeachOp.prototype = new Operator();

	function LastOp()
	{
		function LastPond()
		{
		}
		LastPond.prototype = new Terminal();
		LastPond.prototype.settling = function()
		{
			return endOfData;
		};
		LastPond.prototype.accept = function(d)
		{
			this.settle(d);
			return true;
		};
		LastPond.prototype.get = function()
		{
			return this.settle() !== endOfData //
			? Canal.Some(this.settle()) : Canal.None();
		};

		this.newPond = function()
		{
			return new LastPond();
		};
	}
	LastOp.prototype = new Operator();

	function ReduceOp(reducer, until) // (dat1,dat2) => dat3
	{
		function ReducePond()
		{
			this.meet = until == null;
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
			if (until != null && until(this.settle()))
			{
				this.meet = true;
				return false;
			}
			return true;
		};
		ReducePond.prototype.get = function()
		{
			return this.meet && this.settle() !== endOfData //
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

		this.groupBy = function(kop)
		{
			var vop = arguments.length > 1 ? arguments[1] : function(obj)
			{
				return obj;
			}
			return this.add(new GroupOp(kop, vop));
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
			return this.add(new LimitOp(num));
		};

		this.map = function(mapper)
		{
			return this.add(new MapOp(mapper));
		};

		this.mapWithState = function(state, mapper)
		{
			return this.add(new MapWithStateOp(state, mapper));
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

		this.sliding = function(size, step)
		{
			if (step == null || step <= 0)
			{
				step = size;
			}
			return this.add(new SlidingOp(size, step));
		};

		this.sortBy = function() // (kop1[,asc1[,kop2[,asc2...]]])
		{
			var orders = arguments.length > 0 && isArray(arguments[0]) ? arguments[0] : arguments;
			return this.sortWith(generateComparator(orders), true);
		};

		this.sortWith = function() // [cmp[,asc]]
		{
			return this.add(new SortOp(arguments[0], arguments[1]));
		};

		this.stratifyBy = function()
		{
			var orders = arguments.length > 0 && isArray(arguments[0]) ? arguments[0] : arguments;
			return this.stratifyWith(generateComparator(orders), true);
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

		this.until = function(pred)
		{
			return this.add(new UntilOp(pred, arguments[1]));
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

		this.zipOuter = function(that)
		{
			return this.map(function(d, i)
			{
				return [ i, d ];
			}).fullJoin(that.map(function(d, i)
			{
				return [ i, d ];
			})).mapJoint(function(left, right)
			{
				return [ left, right ];
			});
		};

		this.zipWithIndex = function()
		{
			return this.map(function(d, i)
			{
				return [ d, i ];
			});
		};

		this.zipWithPhase = function()
		{
			return this.add(new ZipWithPhaseOp());
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
			return this.groupByKey(arguments[2], arguments[3]) //
			.mapValues(function(arr, key)
			{
				return Canal.of(arr).fold(zero(key), folder);
			});
		};

		this.fullJoin = function(that)
		{
			return this.add(new FullJoinOp(that, arguments[1], arguments[2], arguments[3], arguments[4]));
		};

		this.groupByKey = function()
		{
			return this.add(new GroupOp(arguments[0], arguments[1]));
		};

		this.having = function(pred)
		{
			var val = arguments[1] != null ? arguments[1] : valOfPair;
			var key = arguments[2] != null ? arguments[2] : keyOfPair;

			return this.filter(function(data)
			{
				return pred(val(data), key(data));
			});
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
			return this.groupByKey(arguments[1], arguments[2]) //
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

		// Object Intermediate Operations

		this.select = function()
		{
			if (arguments.length > 0)
			{
				var map = {};
				var arg = arguments[0];
				if (isObject(arg))
				{
					var item = null;
					for ( var k in arg)
					{
						item = arg[k];
						if (typeof item === "function")
						{
							map[k] = item;
						}
						else
						{
							map[k] = Canal.col(item);
						}
					}
				}
				else
				{
					var list = isArray(arg) ? arg : arguments;
					var item = null;
					for (var i = 0; i < list.length; i++)
					{
						item = list[i];
						if (typeof item === "function")
						{
							map[item.alias] = item;
						}
						else
						{
							map[item] = Canal.col(item);
						}
					}
				}

				var all = false;

				for ( var k in map)
				{
					if (map.hasOwnProperty(k))
					{
						if (map[k].all)
						{
							all = true;
							delete map[k];
						}
					}
				}

				return this.map(function(d)
				{
					var r = {};

					if (all)
					{
						for ( var k in d)
						{
							if (d.hasOwnProperty(k))
							{
								r[k] = d[k];
							}
						}
					}

					for ( var k in map)
					{
						if (map.hasOwnProperty(k))
						{
							r[k] = map[k] != null ? map[k](d) : null;
						}
					}

					return r;
				});
			}
			else
			{
				return this.map(function(d)
				{
					var r = {};

					for ( var k in d)
					{
						if (d.hasOwnProperty(k))
						{
							r[k] = d[k];
						}
					}

					return r;
				});
			}
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

				partBy = partBy != null && partBy.length > 0 && isArray(partBy[0]) ? partBy[0] : partBy;
				orderBy = orderBy != null && orderBy.length > 0 && isArray(orderBy[0]) ? orderBy[0] : orderBy;
				between = between != null && between.length > 0 && isArray(between[0]) ? between[0] : between;

				c = addWindowItem(c, aggr, updt, expr, alias, partBy, orderBy, between, byRows);
			}

			return c;
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
			}).groupByKey().mapValues(function(arr)
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

		this.fold = function(init, folder, until)
		{
			return this.evaluate(new FoldOp(init, folder, until));
		};

		this.forall = function(cond)
		{
			return this.evaluate(new ForallOp(cond));
		};

		this.foreach = function(action)
		{
			this.evaluate(new ForeachOp(action));
		};

		this.last = function()
		{
			var pred = arguments[0];

			var c = this;

			if (pred !== undefined)
			{
				c = c.filter(pred);
			}

			return c.evaluate(new LastOp());
		};

		this.reduce = function(reducer, until)
		{
			return this.evaluate(new ReduceOp(reducer, until));
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

	Canal.keysOfObject = function(obj)
	{
		var keys = [];

		if (obj != null)
		{
			for ( var key in obj)
			{
				if (obj.hasOwnProperty(key))
				{
					keys.push(key);
				}
			}
		}

		return keys;
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

	Canal.pairsOfMap = function(map, keys)
	{
		var pairs = [];

		if (keys == null)
		{
			keys = Canal.keysOfObject(map);
		}

		for (var i = 0; i < keys.length; i++)
		{
			var k = keys[i];
			pairs.push([ k, map[k] ]);
		}

		return pairs;
	};

	function Iterator()
	{
	}
	Iterator.prototype.close = undefined; // () => Void
	Iterator.prototype.hasNext = undefined; // () => boolean
	Iterator.prototype.next = undefined; // () => Data

	function Iterable()
	{
	}
	Iterable.prototype.iterator = undefined; // () => Iterator

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
		if (data instanceof Canal)
		{
			return data;
		}
		else if (data instanceof Array)
		{
			return new Canal().source(new Source(data, arguments[1], arguments[2]));
		}
		else if (data instanceof Spring)
		{
			return new Canal().source(data);
		}
		else if (typeof data === "function")
		{
			return new Canal().source(new Spring(data, arguments[1]));
		}
		else
		{
			return Canal.of(Canal.pairsOfMap(data, arguments[1]));
		}
	};

	var wrapPicker = function(picker)
	{
		if (picker.all)
		{
			return picker;
		}

		picker.as = function(alias)
		{
			this.alias = alias;
			return this;
		};

		picker.asc = function()
		{
			this.order = true; // null by default
			return this;
		};

		picker.desc = function()
		{
			this.order = false;
			return this;
		};

		picker.nullsFirst = function()
		{
			this.nulls = "first";
			return this;
		};

		picker.nullsLast = function()
		{
			this.nulls = "last"; // null by default
			return this;
		};

		return picker;
	};

	function Option()
	{
	}
	Option.prototype = new Canal();
	Option.prototype.get = undefineData;
	Option.prototype.or = undefined; // (defaultData) => Data
	Option.prototype.orElse = undefined; // (Option) => Option
	Option.prototype.orNull = undefined; // () => Data | null
	Option.prototype.given = undefined; // () => boolean
	Option.prototype.filter = undefined;
	Option.prototype.map = undefined;
	Option.prototype.col = function(picker)
	{
		var wrap = null;
		var data = this.or({});

		if (picker == null)
		{
			wrap = function()
			{
				return null;
			};
		}
		else if (picker === "*")
		{
			wrap = pickAllColumns(data);
			wrap.alias = picker;
		}
		else if (typeof picker !== "function")
		{ // Extract the attribute from data by the key
			var key = picker.toString();
			wrap = function()
			{
				return data[key];
			};
			wrap.alias = key;
		}
		else
		{
			wrap = function()
			{
				return picker(data);
			};
			wrap.alias = picker.alias;
			wrap.order = picker.order;
			wrap.nulls = picker.nulls;
		}

		return wrapPicker(wrap);
	};
	Option.prototype.$ = Option.prototype.col;

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
	Some.prototype.orElse = function()
	{
		return this;
	};
	Some.prototype.orNull = function()
	{
		return this.get();
	};
	Some.prototype.given = function()
	{
		return true;
	};
	Some.prototype.filter = function(pred)
	{
		if (pred(this.get(), 0))
		{
			return this;
		}
		else
		{
			return Canal.None();
		}
	};
	Some.prototype.map = function(mapper)
	{
		return Canal.Some(mapper(this.get(), 0));
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
	None.prototype.orElse = function(opt)
	{
		return opt;
	};
	None.prototype.orNull = nullData;
	None.prototype.given = function()
	{
		return false;
	};
	None.prototype.filter = function(pred)
	{
		return this;
	};
	None.prototype.map = function(mapper)
	{
		return this;
	};

	Canal.Some = function(val)
	{
		return new Some(val);
	};

	Canal.None = function()
	{
		return new None();
	};

	Canal.Option = function(val)
	{
		return val == null ? Canal.None() : Canal.Some(val);
	};

	Canal.col = function(picker)
	{
		var wrap = null;

		if (picker == null)
		{
			wrap = function()
			{
				return null;
			};
		}
		else if (picker === "*")
		{
			wrap = pickAllColumns(null);
			wrap.alias = picker;
		}
		else if (typeof picker !== "function")
		{ // Extract the attribute from data by the key
			var key = picker.toString();
			wrap = function(data)
			{
				return data[key];
			};
			wrap.alias = key;
		}
		else
		{
			wrap = function(data)
			{
				return picker(data);
			};
			wrap.alias = picker.alias;
			wrap.order = picker.order;
			wrap.nulls = picker.nulls;
		}

		return wrapPicker(wrap);
	};

	Canal.row = function()
	{
		var map = {};
		var arg = arguments[0];
		var all = [];
		if (isObject(arg))
		{
			for ( var k in arg)
			{
				if (arg[k] != null && arg[k].all)
				{
					all.push(arg[k]);
				}
				else
				{
					map[k] = arg[k];
				}
			}
		}
		else
		{
			var list = isArray(arg) ? arg : arguments;
			var item = null;
			for (var i = 0; i < list.length; i++)
			{
				item = list[i];
				if (item.all)
				{
					all.push(item);
				}
				else
				{
					map[item.alias] = item;
				}
			}
		}

		var row = {};

		for (var i = 0; i < all.length; i++)
		{
			var obj = all[i]();
			for ( var k in obj)
			{
				if (obj.hasOwnProperty(k))
				{
					row[k] = obj[k];
				}
			}
		}

		for ( var k in map)
		{
			if (map.hasOwnProperty(k))
			{
				row[k] = map[k]();
			}
		}

		return row;
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
		"avg" : function(vop)
		{
			if (vop instanceof Item)
			{
				return Canal.item(function(agg, rows, begin, end)
				{
					var c = vop.updater()(agg, rows, begin, end) //
					.filter(function(d)
					{
						return d != null;
					});
					return c.reduce(function(a, b)
					{
						return a + b;
					}).get() / c.count();
				});
			}
			else
			{
				return Canal.item(function(agg, rows, begin, end)
				{
					var c = Canal.of(rows, begin, end) //
					.map(vop) //
					.filter(function(d)
					{
						return d != null;
					});
					return c.reduce(function(a, b)
					{
						return a + b;
					}).get() / c.count();
				});
			}
		},
		"count" : function(vop) // vop | Item
		{
			if (vop instanceof Item)
			{
				return Canal.item(function(agg, rows, begin, end)
				{
					return vop.updater()(agg, rows, begin, end).filter(function(d)
					{
						return d != null;
					}).count();
				});
			}
			else
			{
				return Canal.item(function(agg, rows, begin, end)
				{
					return Canal.of(rows, begin, end).map(vop).filter(function(d)
					{
						return d != null;
					}).count();
				});
			}
		},
		"cume_dist" : function()
		{
			return Canal.item({
				"aggr" : function(levels)
				{
					return Canal.of(levels).flatMap(function(lvl)
					{
						return lvl;
					}).count();
				},
				"updt" : function(agg, rows, begin, end)
				{
					return rows.length / agg;
				}
			});
		},
		"dense_rank" : function()
		{
			return Canal.item({
				"aggr" : function(levels)
				{
					return Canal.of(levels).flatMap(function(level, group)
					{
						return Canal.of(level).map(function(d, row)
						{
							return group + 1;
						}).collect();
					}) //
					.map(function(d, i)
					{
						return [ i, d ];
					}) //
					.sortBy(function(d)
					{
						return d[0];
					}) //
					.map(function(d)
					{
						return d[1];
					}).collect();
				},
				"expr" : function(pos, agg)
				{
					return agg[pos];
				}
			});
		},
		"distinct" : function(vop) // vop[, cmp]
		{
			var vop = vop != null ? vop : valOfData;
			var cmp = arguments.length > 1 ? arguments[1] : null;
			return Canal.item(function(agg, rows, begin, end)
			{
				return Canal.of(rows, begin, end).map(vop).distinct(cmp);
			});
		},
		"first_value" : function(vop)
		{
			return Canal.item(function(agg, rows, begin, end)
			{
				return Canal.of(rows, begin, end) //
				.map(vop) //
				.first().get();
			});
		},
		"fold" : function(init, folder)
		{
			if (arguments[2] instanceof Item)
			{
				var vop = arguments[2];
				return Canal.item(function(agg, rows, begin, end)
				{
					return vop.updater()(agg, rows, begin, end) //
					.fold(init(), folder);
				});
			}
			else
			{
				var vop = arguments[2] != null ? arguments[2] : valOfData;
				return Canal.item(function(agg, rows, begin, end)
				{
					return Canal.of(rows, begin, end) //
					.map(vop).fold(init(), folder);
				});
			}
		},
		"lag" : function(vop)
		{
			var off = Math.max(arguments.length > 1 ? arguments[1] : 1, 0);
			var def = arguments.length > 2 ? arguments[2] : undefined;
			return Canal.item({
				"expr" : function(pos, res, rows)
				{
					return pos - off < 0 ? def : vop(rows[pos - off]);
				}
			});
		},
		"last_value" : function(vop)
		{
			return Canal.item(function(agg, rows, begin, end)
			{
				return Canal.of(rows, begin, end) //
				.map(vop) //
				.last().get();
			});
		},
		"lead" : function(vop)
		{
			var off = Math.max(arguments.length > 1 ? arguments[1] : 1, 0);
			var def = arguments.length > 2 ? arguments[2] : undefined;
			return Canal.item({
				"aggr" : function(levels)
				{
					return Canal.of(levels).flatMap(function(lvl)
					{
						return lvl;
					}).collect();
				},
				"expr" : function(pos, res)
				{
					return pos + off >= res.length ? def : vop(res[pos + off]);
				}
			});
		},
		"map_part" : function(mapper)
		{
			return Canal.item({
				"aggr" : function(levels)
				{
					return Canal.of(levels).flatMap(function(level)
					{
						return level;
					}).collect();
				},
				"updt" : function(agg)
				{
					return agg;
				},
				"expr" : function(pos, rows)
				{
					return mapper(rows);
				}
			});
		},
		"max" : function(vop)
		{
			var cmp = arguments.length > 1 ? arguments[1] : signum;

			return Canal.item(function(agg, rows, begin, end)
			{
				return Canal.of(rows, begin, end) //
				.map(vop) //
				.filter(function(d)
				{
					return d != null;
				}) //
				.reduce(function(a, b)
				{
					if (cmp(a, b) < 0)
					{
						return b;
					}
					else
					{
						return a;
					}
				}).get();
			});
		},
		"min" : function(vop)
		{
			var cmp = arguments.length > 1 ? arguments[1] : signum;

			return Canal.item(function(agg, rows, begin, end)
			{
				return Canal.of(rows, begin, end) //
				.map(vop) //
				.filter(function(d)
				{
					return d != null;
				}) //
				.reduce(function(a, b)
				{
					if (cmp(a, b) > 0)
					{
						return b;
					}
					else
					{
						return a;
					}
				}).get();
			});
		},
		"ntile" : function(num)
		{
			num = Math.max(num, 1);
			return Canal.item({
				"aggr" : function(levels)
				{
					var rows = Canal.of(levels).flatMap(function(level)
					{
						return level;
					});
					var totalRows = rows.count();
					var eachRows = Math.max(Math.floor(totalRows / num), 1);
					var restRows = totalRows <= num ? 0 : totalRows % num;
					var res = [];
					for (var i = 1; i <= num; i++)
					{
						for (var j = 0; j < eachRows; j++)
						{
							res.push(i);
						}
						if (i <= restRows)
						{
							res.push(i);
						}
					}
					return res;
				},
				"expr" : function(pos, agg)
				{
					return agg[pos];
				}
			});
		},
		"percent_rank" : function()
		{
			return Canal.item({
				"aggr" : function(levels)
				{
					var lvs = flatten(levels).length - 1;
					return Canal.of(levels).flatMap(function(level, group)
					{
						return Canal.of(level).map(function(d, row)
						{
							return group;
						}).collect();
					}) //
					.map(function(g, i)
					{
						return [ g, i ];
					}) //
					.groupByKey() //
					.map(function(d)
					{
						var rs = d[1];
						var m = Canal.of(rs).reduce(function(a, b)
						{
							return a < b ? a : b;
						}).get();
						return Canal.of(rs).map(function(d)
						{
							return [ d, m ];
						}).collect();
					}) //
					.flatMap() //
					.sortBy(function(d)
					{
						return d[0];
					}) //
					.map(function(d)
					{
						return lvs == 0 ? 0 : (d[1] / lvs);
					}).collect();
				},
				"expr" : function(pos, agg)
				{
					return agg[pos];
				}
			});
		},
		"rank" : function()
		{
			return Canal.item({
				"aggr" : function(levels)
				{
					return Canal.of(levels).flatMap(function(level, group)
					{
						return Canal.of(level).map(function(d, row)
						{
							return group;
						}).collect();
					}) //
					.map(function(d, i)
					{
						return [ d, i + 1 ];
					}) //
					.groupByKey() //
					.map(function(p)
					{
						return p[1];
					}) //
					.flatMap(function(arr)
					{
						var min = Canal.of(arr).reduce(function(a, b)
						{
							return Math.min(a, b);
						}).get();
						return Canal.of(arr).map(function(d)
						{
							return [ d, min ];
						}).collect();
					}) //
					.sortBy(function(d)
					{
						return d[0];
					}) //
					.map(function(d)
					{
						return d[1];
					}).collect();
				},
				"expr" : function(pos, agg)
				{
					return agg[pos];
				}
			});
		},
		"row_number" : function()
		{
			return Canal.item({
				"expr" : function(pos)
				{
					return pos + 1;
				}
			});
		},
		"sum" : function(vop)
		{
			if (vop instanceof Item)
			{
				return Canal.item(function(agg, rows, begin, end)
				{
					return vop.updater()(agg, rows, begin, end) //
					.map(nvl0) //
					.reduce(function(a, b)
					{
						return a + b;
					}).get();
				});
			}
			else
			{
				return Canal.item(function(agg, rows, begin, end)
				{
					return Canal.of(rows, begin, end) //
					.map(vop) //
					.map(nvl0) //
					.reduce(function(a, b)
					{
						return a + b;
					}).get();
				});
			}
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

	Canal.unit = valOfData;

	Canal.kop = keyOfPair;

	Canal.vop = valOfPair;

	Canal.cmp = comparator;

	Canal.nvl = nvl;

	Canal.range = range;

	Canal.signum = signum;

	return Canal;
})));
