/**
 * Modifies .users to give XP totals and then levels to each user.
 * @param {Array} users Will be edited to add the property "xp" with a numerical value on it
 * @param {Array} boards The boards to add up XP from.
 * @param {*} settings We use this to get properties we need: { defaultXP, statusColumn, ownerColumn, xpColumn }
 */
export function calculateXpForUsers(users, boards, settings) {
	// Console.debug is under the verbose setting in Chrome dev tools, but is not visible by default.
	console.debug(`Calculating XP for ${users.length} users`);

	// We recalculate from 0 every run
	for(const user of users) {
		user.xp = 0;
	}

	/* Example structure of boards:
	0:
		id: "683440995"
		items: Array(6)
			0:
				column_values: Array(3)
					0: {type: "multiple-person", id: "person", text: "Daniel Mendez"}
					1: {type: "numeric", id: "xp", text: "150"}
					2: {type: "color", id: "status", text: "Done"}
					length: 3
				id: "683440999"
				name: "Make basic template"
	*/
	for (const board of boards) {
		for (const item of board.items) {
			accumulateXP(users, item, settings);
		}
	}

	for(const user of users) {
		user.level = 1 + Math.floor(user.xp / settings.xpPerLevel);
	}

	users = users.sort((x, y) => y.level - x.level);
}


function accumulateXP(users, item, settings) {
	if(!settings) {
		console.error("No settings object found, we require at least a default XP value");
		return;
	}

	// Unfortunately, binding a column to settings provides this:
	// settings { statusColumn: { "status": true } }
	// We want the key "status"

	// Confirm either no status column, or a valid status
	const statusColumnName = settings.statusColumn && Object.keys(settings.statusColumn)[0];
	if(statusColumnName) {
		const status = item.column_values.find((e) => e.id === statusColumnName);
		if(status && status.text !== "Done") {
			console.debug(`	Skipped "${item.name}" as it has status "${status.text}"`);
			return;
		}
	}

	// Get users present in the appropriate column.
	// TODO: Can columns other than multiple-person indicate ownership?
	// TODO: What if there are two multiple-person type columns? Currently, they both indicate ownership.
	let uniqueUsers = new Set();
	const ownerColumnName = settings.ownerColumn && Object.keys(settings.ownerColumn)[0];
	for (const values of item.column_values) {
		if (values.type !== "multiple-person" || !values.text) {
			continue;
		}
		// Client can define which user-type column gets XP, otherwise all of them will.
		else if (ownerColumnName && values.id !== ownerColumnName) {
			continue;
		}

		// values.text "Taso Karydas, Daniel Mendez" or "Daniel Mendez" or ""
		const names =  values.text.split(", ");
		for(const name of names) {
			uniqueUsers.add(name);
		}
	}
	
	if(!uniqueUsers.size) {
		return;
	}

	const award = getXpThisItemIsWorth(item, settings);
	for(let user of users) {
		if(!uniqueUsers.has(user.name)) {
			continue;
		}
		console.debug(`	"${item.name}" is worth ${award}xp to ${user.name}`);
		user.xp = (user.xp || 0) + award;
	}
}


function getXpThisItemIsWorth(item, settings) {
	const defaultXP = Number(settings && settings.defaultXP) || 1;
	if(!settings.xpColumn) {
		return defaultXP
	}

	// Find the first value XP column and return it. If it's not a number, just use the default.
	const xpColumnName = Object.keys(settings.xpColumn)[0];
	for (const values of item.column_values) {
		if(values.id === xpColumnName) {
			let xp = Number(values.text);
			if(isNaN(xp)) {
				return defaultXP;
			}
			return xp || defaultXP;
		}
	}

	return defaultXP;
}