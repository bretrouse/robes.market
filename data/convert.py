cat loot.json | jello '
from collections import defaultdict
result = defaultdict(set)
bagids = list(_.bags.keys())
slots = list(_.loottypes.keys())
for bagid in bagids:
    bag = _.bags[bagid]
    for slot in slots:
        for name in _.loottypes[slot]:
            if name in bag[slot]:
                result[name].add(bagid)
        result[bag[slot]].add(bagid)
keys = result.keys()
for key in keys:
    result[key] = list(result[key])
result' > lootout.json