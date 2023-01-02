function isDoingSpire() {
	return isActiveSpireAT() || disActiveSpireAT();
}

//Unique Maps
const uniqueMaps = {
	//Universe 1 Unique Maps
	'The Block': {
		zone: 11,
		challenges: ["Scientist", "Trimp"],
		speedrun: 'blockTimed',
		universe: 1
	},
	'The Wall': {
		zone: 15,
		challenges: [],
		speedrun: 'wallTimed',
		universe: 1
	},
	'Dimension of Anger': {
		zone: 20,
		challenges: ["Discipline", "Metal", "Size", "Frugal", "Coordinate"],
		speedrun: 'angerTimed',
		universe: 1
	},
	'Trimple Of Doom': {
		zone: 33,
		challenges: ["Meditate", "Anger"],
		speedrun: 'doomTimed',
		universe: 1
	},
	'The Prison': {
		zone: 80,
		challenges: ["Electricity", "Mapocalypse"],
		speedrun: 'prisonTimed',
		universe: 1
	},
	'Imploding Star': {
		zone: 170,
		challenges: ["Devastation"],
		speedrun: 'starTimed',
		universe: 1
	},
	'Bionic Wonderland': {
		zone: 125,
		challenges: ["Crushed"],
		speedrun: 'bionicTimed',
		universe: 1
	},

	//Universe 2 Unique Maps
	'Big Wall': {
		zone: 8,
		challenges: [""],
		speedrun: 'bigWallTimed',
		universe: 2
	},
	'Dimension of Rage': {
		zone: 15,
		challenges: ["Unlucky"],
		speedrun: '',
		universe: 2
	},
	'Prismatic Palace': {
		zone: 20,
		challenges: [""],
		speedrun: 'palaceTimed',
		universe: 2
	},
	'Atlantrimp': {
		zone: 33,
		challenges: [""],
		speedrun: 'atlantrimpTimed',
		universe: 2
	},
	'Melting Point': {
		zone: 55,
		challenges: [""],
		speedrun: 'meltingTimed',
		universe: 2
	},
	'The Black Bog': {
		zone: 6,
		challenges: [""],
		speedrun: '',
		universe: 2
	},
	'Frozen Castle': {
		zone: 174,
		challenges: [""],
		speedrun: 'starTimed',
		universe: 2
	}
};

//Unique Maps
function shouldRunUniqueMap(map) {
	const challenge = game.global.challengeActive;
	const isC3 = game.global.runningChallengeSquared || challengeActive('Mayhem') || challengeActive('Pandemonium') || challengeActive('Desolation');
	const isDaily = challengeActive('Daily');
	const mapData = uniqueMaps[map.name];
	const uniqueMapSetting = game.global.universe === 2 ? autoTrimpSettings.rUniqueMapSettingsArray.value : autoTrimpSettings.hUniqueMapSettingsArray.value;

	if (mapData === undefined || game.global.world < mapData.zone) {
		return false;
	}
	if (game.global.universe !== mapData.universe) {
		return false;
	}
	if (!isC3 && mapData.challenges.includes(challenge) && !challengeActive('')) {
		return true;
	}
	if (mapData.speedrun && shouldSpeedRun(game.achievements[mapData.speedrun])) {
		return true;
	}
	if (game.global.universe === 1) {
		const liquified = game.global.gridArray && game.global.gridArray[0] && game.global.gridArray[0].name == "Liquimp";
		if (map.name === 'The Block') {
			//We need Shieldblock
			if (!game.upgrades.Shieldblock.allowed && getPageSetting('BuyShieldblock')) {
				return true;
			}
			if (game.mapUnlocks.TheBlock.canRunOnce && uniqueMapSetting.The_Block.enabled && game.global.world >= uniqueMapSetting.The_Block.zone && (game.global.lastClearedCell + 2 >= uniqueMapSetting.The_Block.cell || liquified)) {
				return true;
			}
		} else if (map.name === 'The Wall') {
			//We need Bounty
			if (!game.upgrades.Bounty.allowed && !game.talents.bounty.purchased) {
				return true;
			}
			if (game.mapUnlocks.TheWall.canRunOnce && uniqueMapSetting.The_Wall.enabled && game.global.world >= uniqueMapSetting.The_Wall.zone && (game.global.lastClearedCell + 2 >= uniqueMapSetting.The_Wall.cell || liquified)) {
				return true;
			}
		} else if (map.name === 'Dimension of Anger') {
			//Unlock the portal
			if (!game.talents.portal.purchased && document.getElementById("portalBtn").style.display === "none") {
				return true;
			}
			if (game.mapUnlocks.Portal.canRunOnce && uniqueMapSetting.Dimension_of_Anger.enabled && game.global.world >= uniqueMapSetting.Dimension_of_Anger.zone && (game.global.lastClearedCell + 2 >= uniqueMapSetting.Dimension_of_Anger.cell || liquified)) {
				return true;
			}
		} else if (map.name === 'Trimple Of Doom') {
			//Unlock the Relentlessness perk
			if (game.portal.Relentlessness.locked) {
				return true;
			}
			if (game.mapUnlocks.AncientTreasure.canRunOnce && uniqueMapSetting.Trimple_of_Doom.enabled && game.global.world >= uniqueMapSetting.Trimple_of_Doom.zone && (game.global.lastClearedCell + 2 >= uniqueMapSetting.Trimple_of_Doom.cell || liquified)) {
				if (getPageSetting('rMapRepeatCount') && game.global.preMapsActive) debug('Running ' + map.name + ' on zone ' + game.global.world + '.');
				return true;
			}
		} else if (map.name === 'The Prison') {
			if (game.mapUnlocks.ThePrison.canRunOnce && uniqueMapSetting.The_Prison.enabled && game.global.world >= uniqueMapSetting.The_Prison.zone && (game.global.lastClearedCell + 2 >= uniqueMapSetting.The_Prison.cell || liquified)) {
				if (getPageSetting('rMapRepeatCount') && game.global.preMapsActive) debug('Running ' + map.name + ' on zone ' + game.global.world + '.');
				return true;
			}
		} else if (map.name === 'Imploding Star') {
			if (game.mapUnlocks.ImplodingStar.canRunOnce && uniqueMapSetting.Imploding_Star.enabled && game.global.world >= uniqueMapSetting.Imploding_Star.zone && (game.global.lastClearedCell + 2 >= uniqueMapSetting.Imploding_Star.cell || liquified)) {
				if (getPageSetting('rMapRepeatCount') && game.global.preMapsActive) debug('Running ' + map.name + ' on zone ' + game.global.world + '.');
				return true;
			}
		}
	} else if (game.global.universe === 2) {
		if (currentMap === 'Quagmire Farm' && map.name === 'The Black Bog') {
			return true;
		}
		else if (map.name === 'Big Wall') {
			// we need Bounty
			if (!game.upgrades.Bounty.allowed && !game.talents.bounty.purchased) {
				return true;
			}
		} else if (map.name === 'Dimension of Rage') {
			// unlock the portal
			if (document.getElementById("portalBtn").style.display === "none" && game.upgrades.Rage.done == 1 && uniqueMapSetting.Dimension_of_Rage.enabled && game.global.world >= uniqueMapSetting.Dimension_of_Rage.zone && game.global.lastClearedCell + 2 >= uniqueMapSetting.Dimension_of_Rage.cell) {
				return true;
			}
		} else if (map.name === 'Prismatic Palace') {
			//100% prismatic shield bonus
			if (game.mapUnlocks.Prismalicious.canRunOnce && uniqueMapSetting.Prismatic_Palace.enabled && game.global.world >= uniqueMapSetting.Prismatic_Palace.zone && game.global.lastClearedCell + 2 >= uniqueMapSetting.Prismatic_Palace.cell) {
				return true;
			}
		} else if (map.name === 'Atlantrimp') {
			// maybe get the treasure
			if (game.mapUnlocks.AncientTreasure.canRunOnce && uniqueMapSetting.Atlantrimp.enabled && game.global.world >= uniqueMapSetting.Atlantrimp.zone && game.global.lastClearedCell + 2 >= uniqueMapSetting.Atlantrimp.cell) {
				if (getPageSetting('rMapRepeatCount') && game.global.preMapsActive) debug('Running ' + map.name + ' on zone ' + game.global.world + '.');
				return true;
			}
		} else if (map.name === 'Melting Point') {
			const metalShred = isDaily && typeof (game.global.dailyChallenge.hemmorrhage) !== 'undefined' && dailyModifiers.hemmorrhage.getResources(game.global.dailyChallenge.hemmorrhage.strength).includes('metal');
			const woodShred = isDaily && typeof (game.global.dailyChallenge.hemmorrhage) !== 'undefined' && dailyModifiers.hemmorrhage.getResources(game.global.dailyChallenge.hemmorrhage.strength).includes('wood');
			const smithyShred = woodShred || metalShred;
			// maybe get extra smithiesvar 
			meltsmithy =
				challengeActive('Desolation') && getPageSetting('rDesolation') && getPageSetting('rDesolationMP') > 0 ? getPageSetting('rDesolationMP') :
					challengeActive('Pandemonium') && getPageSetting('RPandemoniumMP') > 0 ? getPageSetting('RPandemoniumMP') :
						isC3 && uniqueMapSetting.MP_Smithy_C3.enabled && uniqueMapSetting.MP_Smithy_C3.value > 0 ? uniqueMapSetting.MP_Smithy_C3.value :
							isDaily && !smithyShred && uniqueMapSetting.MP_Smithy_Daily.enabled && uniqueMapSetting.MP_Smithy_Daily.value > 0 ? uniqueMapSetting.MP_Smithy_Daily.value :
								isDaily && smithyShred && uniqueMapSetting.MP_Smithy_Daily_Shred.enabled && uniqueMapSetting.MP_Smithy_Daily_Shred.value > 0 ? uniqueMapSetting.MP_Smithy_Daily_Shred.value :
									!isC3 && !isDaily && uniqueMapSetting.MP_Smithy.enabled && uniqueMapSetting.MP_Smithy.value > 0 ? uniqueMapSetting.MP_Smithy.value :
										Infinity;
			if (game.mapUnlocks.SmithFree.canRunOnce &&
				((!isC3 && !isDaily && uniqueMapSetting.Melting_Point.enabled && game.global.world >= uniqueMapSetting.Melting_Point.zone && game.global.lastClearedCell + 2 >= uniqueMapSetting.Melting_Point.cell) ||
					(meltsmithy !== Infinity && meltsmithy <= game.buildings.Smithy.owned))) {
				if (getPageSetting('rMapRepeatCount') && game.global.preMapsActive) debug('Running ' + map.name + ' at ' + game.buildings.Smithy.owned + ' smithies on zone ' + game.global.world + '.');
				return true;
			}
		} else if (map.name === 'Frozen Castle') {
			// maybe get the treasure
			var frozencastle = !challengeActive('Hypothermia') && uniqueMapSetting.Frozen_Castle.enabled && game.global.world >= uniqueMapSetting.Frozen_Castle.zone && game.global.lastClearedCell + 2 >= uniqueMapSetting.Frozen_Castle.cell;
			var hypothermia = challengeActive('Hypothermia') && !VoidMaps().shouldRun &&
				game.global.world >= (autoTrimpSettings.rHypoDefaultSettings.value.frozencastle[0] !== undefined ? parseInt(autoTrimpSettings.rHypoDefaultSettings.value.frozencastle[0]) : 200) &&
				game.global.lastClearedCell + 2 >= (autoTrimpSettings.rHypoDefaultSettings.value.frozencastle[1] !== undefined ? parseInt(autoTrimpSettings.rHypoDefaultSettings.value.frozencastle[1]) : 99);
			if (frozencastle || hypothermia) {
				if (getPageSetting('rMapRepeatCount') && game.global.preMapsActive) debug('Running ' + map.name + ' on zone ' + game.global.world + '.');
				return true;
			}
		}
	}
	return false;
}

//Void Maps
const voidPrefixes = Object.freeze({
	'Poisonous': 10,
	'Destructive': 11,
	'Heinous': 20,
	'Deadly': 30
});

//Void Maps
var voidSuffixes = Object.freeze({
	'Descent': 7.077,
	'Void': 8.822,
	'Nightmare': 9.436,
	'Pit': 10.6
});

//Void Maps
function getVoidMapDifficulty(map) {
	if (!map) {
		return 99999;
	}
	let score = 0;
	for (const [prefix, weight] of Object.entries(voidPrefixes)) {
		if (map.name.includes(prefix)) {
			score += weight;
			break;
		}
	}
	for (const [suffix, weight] of Object.entries(voidSuffixes)) {
		if (map.name.includes(suffix)) {
			score += weight;
			break;
		}
	}
	return score;
}

//Void Maps
function selectEasierVoidMap(map1, map2) {
	if (getVoidMapDifficulty(map2) > getVoidMapDifficulty(map1)) {
		return map1;
	} else {
		return map2;
	}
}

MODULES.mapFunctions = {};
MODULES.mapFunctions.rVoidHDRatio = Infinity;
MODULES.mapFunctions.rVoidVHDRatio = Infinity;
MODULES.mapFunctions.rVoidHDInfo = Infinity;
MODULES.mapFunctions.portalZone = Infinity;
MODULES.mapFunctions.workerRatio = null;

//Void Maps
function VoidMaps() {

	var rDoVoids = false;
	const mapName = 'Void Map';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (game.global.universe === 1 && !autoTrimpSettings.hVoidMapDefaultSettings.value.active) return farmingDetails;
	if (game.global.universe === 2 && !autoTrimpSettings.rVoidMapDefaultSettings.value.active) return farmingDetails;
	var module = MODULES['mapFunctions'];

	const totalPortals = getTotalPortals();
	const isC3 = game.global.runningChallengeSquared || challengeActive('Mayhem') || challengeActive('Pandemonium') || challengeActive('Desolation');
	const isDaily = challengeActive('Daily');
	const dailyReduction = isDaily && game.global.universe === 2 ? dailyModiferReduction() : 0;
	const currChall = game.global.challengeActive;
	const rVMBaseSettings = game.global.universe === 1 ? autoTrimpSettings.hVoidMapSettings.value : autoTrimpSettings.rVoidMapSettings.value;

	var rVMIndex;

	//Reset void HD Index if not on the right portal/zone/cell as it was initially run.
	if (module.rVoidHDIndex !== Infinity && module.rVoidHDInfo !== (totalPortals + "_" + game.global.world + "_" + (game.global.lastClearedCell + 2))) module.rVoidHDIndex = Infinity;

	for (var y = 0; y < rVMBaseSettings.length; y++) {
		const currSetting = rVMBaseSettings[y];
		if (!currSetting.active || game.global.lastClearedCell + 2 < currSetting.cell) continue;
		if (game.global.world < (currSetting.world + dailyReduction)) continue;
		if (game.global.world > (currSetting.maxvoidzone + dailyReduction)) continue;
		if (currSetting.runType !== 'All') {
			if (!isC3 && !isDaily && (currSetting.runType !== 'Filler' ||
				(currSetting.runType === 'Filler' && (currSetting.challenge !== 'All' && currSetting.challenge !== currChall)))) continue;
			if (isDaily && currSetting.runType !== 'Daily') continue;
			if (isC3 && (currSetting.runType !== 'C3' ||
				(currSetting.runType === 'C3' && (currSetting.challenge3 !== 'All' && currSetting.challenge3 !== currChall)))) continue;
		}
		if (((currSetting.maxvoidzone + dailyReduction) === game.global.world) ||
			(game.global.world - (currSetting.world + dailyReduction) >= 0 &&
				//Running voids regardless of HD if we reach our max void zone / Running voids if our voidHDRatio is greater than our target value
				(currSetting.voidHDRatio < voidHDRatio || currSetting.hdRatio < HDRatio))) {
			rVMIndex = y;
			if (module.rVoidHDRatio === Infinity) module.rVoidHDRatio = HDRatio;
			if (module.rVoidVHDRatio === Infinity) module.rVoidVHDRatio = voidHDRatio;
			module.rVoidHDIndex = y;
			module.rVoidHDIndex = (totalPortals + "_" + game.global.world + "_" + (game.global.lastClearedCell + 2));
			break;
		}
		else
			continue;
	}

	if (rVMIndex >= 0 || module.rVoidHDIndex !== Infinity) {
		var rVMSettings = rVMBaseSettings[rVMIndex >= 0 ? rVMIndex : module.rVoidHDIndex];
		var rVMJobRatio = rVMSettings.jobratio
		var shouldPortal = rVMSettings.portalAfter

		if (game.global.totalVoidMaps > 0) {
			rDoVoids = true;
			var stackedMaps = Fluffy.isRewardActive('void') ? countStackedVoidMaps() : 0;
		}

		var status = 'Void Maps: ' + game.global.totalVoidMaps + ((stackedMaps) ? " (" + stackedMaps + " stacked)" : "") + ' remaining'

		farmingDetails.shouldRun = rDoVoids;
		farmingDetails.mapName = mapName;
		farmingDetails.jobRatio = rVMJobRatio;
		farmingDetails.repeat = false;
		farmingDetails.status = status;
	}

	if (currentMap === mapName && !rDoVoids) {
		mappingDetails(mapName);
		resetMapVars();
		currentMap = undefined;
		rAutoLevel = Infinity;
		currTime = 0;
		game.global.mapRunCounter = 0;
		module.rVoidHDIndex = Infinity;
		module.rVoidHDRatio = Infinity;
		module.rVoidVHDRatio = Infinity;
		module.rVoidHDInfo = Infinity;
		//Setting portal zone to current zone if setting calls for it
		if (shouldPortal) module.portalZone = game.global.world;
	}

	return farmingDetails;
}

MODULES.mapFunctions.rMBHealthFarm = false;
var rMBHealthFarm = false;

//Map Bonus
function MapBonus() {

	var rShouldMaxMapBonus = false;
	var mapAutoLevel = Infinity;

	const mapName = 'Map Bonus';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (game.global.universe === 1 && !autoTrimpSettings.hMapBonusDefaultSettings.value.active && !isDoingSpire()) return farmingDetails;
	if (game.global.universe === 2 && !autoTrimpSettings.rMapBonusDefaultSettings.value.active) return farmingDetails;

	//Setting up variables and checking if we should use daily settings instead of regular Map Bonus settings
	const isC3 = game.global.runningChallengeSquared || challengeActive('Mayhem') || challengeActive('Pandemonium') || challengeActive('Desolation') || challengeActive('Desolation');
	const isDaily = challengeActive('Daily');
	const currChall = game.global.challengeActive;
	const rMBZone = game.global.universe === 1 ? getPageSetting('hMapBonusZone') : getPageSetting('rMapBonusZone');
	const rMBBaseSettings = game.global.universe === 1 ? autoTrimpSettings.hMapBonusSettings.value : autoTrimpSettings.rMapBonusSettings.value;
	const rMBDefaultSettings = game.global.universe === 1 ? autoTrimpSettings.hMapBonusDefaultSettings.value : autoTrimpSettings.rMapBonusDefaultSettings.value;
	let rMBshouldDoHealthMaps = rMBDefaultSettings.healthBonus > game.global.mapBonus && HDRatio > rMBDefaultSettings.healthHDRatio && game.global.mapBonus !== 10;
	let rMBspireMapStack = getPageSetting('MaxStacksForSpire') && isDoingSpire() && game.global.mapBonus !== 10;
	var rMBIndex = null;
	for (var y = 0; y < rMBBaseSettings.length; y++) {
		//Skip iterating lines if map bonus is capped.
		if (game.global.mapBonus === 10) continue;
		const currSetting = rMBBaseSettings[y];
		if (!currSetting.active || game.global.lastClearedCell + 2 < currSetting.cell) continue;
		if (currSetting.runType !== 'All') {
			if (!isC3 && !isDaily && (currSetting.runType !== 'Filler' ||
				(currSetting.runType === 'Filler' && (currSetting.challenge !== 'All' && currSetting.challenge !== currChall)))) continue;
			if (isDaily && currSetting.runType !== 'Daily') continue;
			if (isC3 && (currSetting.runType !== 'C3' ||
				(currSetting.runType === 'C3' && (currSetting.challenge3 !== 'All' && currSetting.challenge3 !== currChall)))) continue;
		}
		if (game.global.world - rMBZone[y] >= 0)
			rMBIndex = rMBZone.indexOf(rMBZone[y]);
		else
			continue;
	}

	if ((rMBIndex !== null && rMBIndex >= 0) || rMBshouldDoHealthMaps || rMBspireMapStack) {
		var rMBSettings = rMBIndex !== null ? rMBBaseSettings[rMBIndex] : rMBDefaultSettings;
		var rMBRepeatCounter = 0;
		if (rMBIndex !== null) {
			rMBRepeatCounter = 1
		}
		rMBRepeatCounter = rMBspireMapStack ? 10 : rMBIndex !== null && rMBshouldDoHealthMaps && rMBSettings.repeat !== rMBDefaultSettings.healthBonus ?
			Math.max(rMBSettings.repeat, rMBDefaultSettings.healthBonus) : rMBIndex === null ? rMBDefaultSettings.healthBonus : rMBSettings.repeat
		var rMBSpecial = rMBSettings.special;
		if (challengeActive('Transmute') && rMBSpecial.includes('mc'))
			rMBSpecial = rMBSpecial.charAt(0) + "sc";
		var rMBMapLevel = rMBIndex !== null ? rMBSettings.level : game.global.universe === 1 ? (0 - game.portal.Siphonology.level) : 0;
		var rMBJobRatio = rMBSettings.jobratio;
		var rMBautoLevel = game.global.universe === 2 && (rMBSettings.autoLevel || rMBIndex === null);
		var rMBminZone = game.global.universe === 1 ? (0 - game.portal.Siphonology.level) : 0
		if (rMBSettings.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && mapRepeats !== 0) {
				game.global.mapRunCounter = mapRepeats;
				mapRepeats = 0;
			}

			var rAutoLevel_Repeat = rAutoLevel;
			mapAutoLevel = callAutoMapLevel(currentMap, rAutoLevel, rMBSpecial, 10, rMBminZone, true);
			if (mapAutoLevel !== Infinity) {
				if (rAutoLevel_Repeat !== Infinity && mapAutoLevel !== rAutoLevel_Repeat) mapRepeats = game.global.mapRunCounter + 1;
				rMBMapLevel = mapAutoLevel;
			}
		}

		if (rMBRepeatCounter > game.global.mapBonus) {
			rShouldMaxMapBonus = true;
			if (rMBshouldDoHealthMaps) rMBHealthFarm = true;
			else rMBHealthFarm = false;
		}
		var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== rMBMapLevel || (getCurrentMapObject().bonus !== rMBSpecial && (getCurrentMapObject().bonus !== undefined && rMBSpecial !== '0')) || game.global.mapBonus >= (rMBRepeatCounter - 1));
		var status = (rMBspireMapStack ? 'Spire ' : '') + 'Map Bonus: ' + game.global.mapBonus + "/" + rMBRepeatCounter;

		if (rShouldMaxMapBonus) farmingDetails.shouldRun = rShouldMaxMapBonus || rMBHealthFarm;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = rMBMapLevel;
		farmingDetails.autoLevel = rMBautoLevel;
		farmingDetails.jobRatio = rMBJobRatio;
		farmingDetails.special = rMBSpecial;
		farmingDetails.mapRepeats = rMBRepeatCounter;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;
	}

	if (currentMap === mapName && (game.global.mapBonus >= rMBRepeatCounter || !farmingDetails.shouldRun)) {
		mappingDetails(mapName, rMapSettings.mapLevel, rMapSettings.special);
		resetMapVars();
		rMBHealthFarm = false;
		mapRepeats = 0;
	}
	return farmingDetails;
}

//Map Farm
function MapFarm() {

	var rShouldMapFarm = false;
	var mapAutoLevel = Infinity;
	const mapName = 'Map Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (game.global.universe === 1 && !autoTrimpSettings.hMapFarmDefaultSettings.value.active) return farmingDetails;
	if (game.global.universe === 2 && !autoTrimpSettings.rMapFarmDefaultSettings.value.active) return farmingDetails;
	const isC3 = game.global.runningChallengeSquared || challengeActive('Mayhem') || challengeActive('Pandemonium') || challengeActive('Desolation');
	const isDaily = challengeActive('Daily');
	const totalPortals = getTotalPortals();
	const shredActive = isDaily && typeof (game.global.dailyChallenge.hemmorrhage) !== 'undefined';
	const shredMods = shredActive ? dailyModifiers.hemmorrhage.getResources(game.global.dailyChallenge.hemmorrhage.strength) : [];
	const foodShred = shredActive && shredMods.includes('food');
	const metalShred = shredActive && shredMods.includes('metal');
	const woodShred = shredActive && shredMods.includes('wood');
	const currChall = game.global.challengeActive;

	const rMFBaseSetting = game.global.universe === 1 ? autoTrimpSettings.hMapFarmSettings.value : autoTrimpSettings.rMapFarmSettings.value;
	var rMFIndex;

	//Checking to see if any lines are to be run.
	for (var y = 0; y < rMFBaseSetting.length; y++) {
		const currSetting = rMFBaseSetting[y];
		if (!currSetting.active || currSetting.done === totalPortals + "_" + game.global.world || game.global.lastClearedCell + 2 < currSetting.cell || game.global.world < currSetting.world || game.global.world > currSetting.endzone || (game.global.world > currSetting.world && currSetting.repeatevery === 0)) {
			continue;
		}
		if (currSetting.runType !== 'All') {
			if (!isC3 && !isDaily && (currSetting.runType !== 'Filler' ||
				(currSetting.runType === 'Filler' && (currSetting.challenge !== 'All' && currSetting.challenge !== currChall)))) continue;
			if (isDaily && currSetting.runType !== 'Daily') continue;
			if (isC3 && (currSetting.runType !== 'C3' ||
				(currSetting.runType === 'C3' && (currSetting.challenge3 !== 'All' && currSetting.challenge3 !== currChall)))) continue;
		}
		if (game.global.world === currSetting.world) {
			rMFIndex = y;
			break;
		}
		if ((game.global.world - currSetting.world) % currSetting.repeatevery === 0) {
			rMFIndex = y;
			break;
		}
	}

	if (rMFIndex >= 0) {
		var rMFSettings = rMFBaseSetting[rMFIndex];
		var rMFMapLevel = rMFSettings.level;
		var rMFSpecial = rMFSettings.special;
		var rMFRepeatCounter = rMFSettings.repeat;
		var rMFJobRatio = rMFSettings.jobratio;
		var rMFAtlantrimp = !game.mapUnlocks.AncientTreasure.canRunOnce ? false : rMFSettings.atlantrimp;
		var rMFGather = rMFSettings.gather;
		var rMFshredMapCap = autoTrimpSettings.rMapFarmDefaultSettings.value.shredMapCap;

		if (shredActive && (rMFRepeatCounter > rMFshredMapCap || rMFAtlantrimp === true)) {
			if ((foodShred && mapSpecialModifierConfig[rMFSpecial].name.includes('Savory')) || (woodShred && mapSpecialModifierConfig[rMFSpecial].name.includes('Wooden')) || (metalShred && mapSpecialModifierConfig[rMFSpecial].name.includes('Metal'))) {
				if (rMFRepeatCounter > rMFshredMapCap) rMFRepeatCounter = rMFshredMapCap;
				rMFAtlantrimp = false;
			}
		}
		if (rMFSettings.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && mapRepeats !== 0) {
				game.global.mapRunCounter = mapRepeats;
				mapRepeats = 0;
			}

			var rAutoLevel_Repeat = rAutoLevel;
			mapAutoLevel = callAutoMapLevel(currentMap, rAutoLevel, rMFSpecial, null, null, false);
			if (mapAutoLevel !== Infinity) {
				if (rAutoLevel_Repeat !== Infinity && mapAutoLevel !== rAutoLevel_Repeat) mapRepeats = game.global.mapRunCounter + 1;
				rMFMapLevel = mapAutoLevel;
			}
		}

		//When running Wither make sure map level is lower than 0 so that we don't accumulate extra stacks.
		if (challengeActive('Wither') && rMFMapLevel >= 0)
			rMFMapLevel = -1;
		//If you're running Transmute and the rMFSpecial variable is either LMC or SMC it changes it to LSC/SSC.
		if (challengeActive('Transmute') && rMFSpecial.includes('mc'))
			rMFSpecial = rMFSpecial.charAt(0) + "sc";

		if (rMFRepeatCounter > game.global.mapRunCounter)
			rShouldMapFarm = true;

		//Marking setting as complete if we've run enough maps.
		if (currentMap === mapName && game.global.mapRunCounter >= rMFRepeatCounter) {
			mappingDetails(mapName, rMFMapLevel, rMFSpecial);
			resetMapVars(rMFSettings);
			rShouldMapFarm = false;
			rMFSettings.done = totalPortals + "_" + game.global.world;
			if (rMFAtlantrimp) runUnique('Atlantrimp', false);
			game.global.mapRunCounter = 0;
			mapRepeats = 0;
			currTime = 0;
			saveSettings();
		}

		var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== rMFMapLevel || (getCurrentMapObject().bonus !== rMFSpecial && (getCurrentMapObject().bonus !== undefined && rMFSpecial !== '0')) || game.global.mapRunCounter + 1 === rMFRepeatCounter);
		var status = 'Map Farm: ' + game.global.mapRunCounter + "/" + rMFRepeatCounter;

		farmingDetails.shouldRun = rShouldMapFarm;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = rMFMapLevel;
		farmingDetails.autoLevel = rMFSettings.autoLevel;
		farmingDetails.jobRatio = rMFJobRatio;
		farmingDetails.special = rMFSpecial;
		farmingDetails.mapRepeats = rMFRepeatCounter;
		farmingDetails.gather = rMFGather;
		farmingDetails.runAtlantrimp = rMFAtlantrimp;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;
	}

	return farmingDetails;
}

//Tribute Farm
function TributeFarm() {

	var rShouldTributeFarm = false;
	var rShouldMetFarm = false;
	var mapAutoLevel = Infinity;
	const mapName = 'Tribute Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!autoTrimpSettings.rTributeFarmDefaultSettings.value.active || (game.buildings.Tribute.locked && game.jobs.Meteorologist.locked)) return farmingDetails;
	var rShouldTributeFarm = false;
	var rShouldMetFarm = false;
	const isC3 = game.global.runningChallengeSquared || challengeActive('Mayhem') || challengeActive('Pandemonium') || challengeActive('Desolation');
	const isDaily = challengeActive('Daily');
	const foodShred = isDaily && typeof (game.global.dailyChallenge.hemmorrhage) !== 'undefined' && dailyModifiers.hemmorrhage.getResources(game.global.dailyChallenge.hemmorrhage.strength).includes('food');
	const dontRecycleMaps = challengeActive('Trappapalooza') || challengeActive('Archaeology') || challengeActive('Berserk') || game.portal.Frenzy.frenzyStarted !== -1 || !newArmyRdy();
	const totalPortals = getTotalPortals();
	const currChall = game.global.challengeActive;
	const rTrFBaseSetting = autoTrimpSettings.rTributeFarmSettings.value;
	var rTrFIndex;

	//Identifying which map line to run.
	for (var y = 0; y < rTrFBaseSetting.length; y++) {
		const currSetting = rTrFBaseSetting[y];
		if (!currSetting.active || currSetting.done === totalPortals + "_" + game.global.world || game.global.world < currSetting.world || game.global.world > currSetting.endzone || (game.global.world > currSetting.zone && currSetting.repeatevery === 0) || game.global.lastClearedCell + 2 < currSetting.cell) {
			continue;
		}
		if (currSetting.runType !== 'All') {
			if (!isC3 && !isDaily && (currSetting.runType !== 'Filler' ||
				(currSetting.runType === 'Filler' && (currSetting.challenge !== 'All' && currSetting.challenge !== currChall)))) continue;
			if (isDaily && currSetting.runType !== 'Daily') continue;
			if (isC3 && (currSetting.runType !== 'C3' ||
				(currSetting.runType === 'C3' && (currSetting.challenge3 !== 'All' && currSetting.challenge3 !== currChall)))) continue;
		}
		if (game.global.world === currSetting.world) {
			rTrFIndex = y;
			break;
		}
		if ((game.global.world - currSetting.world) % currSetting.repeatevery === 0) {
			rTrFIndex = y;
			break;
		}
	}

	if (rTrFIndex >= 0) {
		//Initialing variables
		var rTrFSettings = rTrFBaseSetting[rTrFIndex];
		var rTrFMapLevel = rTrFSettings.level
		var rTrFTributes = game.buildings.Tribute.locked == 1 ? 0 : rTrFSettings.tributes;
		var rTrFMeteorologists = game.jobs.Meteorologist.locked == 1 ? 0 : rTrFSettings.mets;
		var rTrFSpecial = getAvailableSpecials('lsc');
		var rTrFJobRatio = rTrFSettings.jobratio;
		var rTrFbuyBuildings = rTrFSettings.buildings;
		var rTrFAtlantrimp = !game.mapUnlocks.AncientTreasure.canRunOnce || (isDaily && foodShred) ? false : rTrFSettings.atlantrimp;

		//AutoLevel code.
		if (rTrFSettings.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && mapRepeats !== 0) {
				game.global.mapRunCounter = mapRepeats;
				mapRepeats = 0;
			}
			var rAutoLevel_Repeat = rAutoLevel;
			mapAutoLevel = callAutoMapLevel(currentMap, rAutoLevel, rTrFSpecial, null, null, false);
			if (mapAutoLevel !== Infinity) {
				if (rAutoLevel_Repeat !== Infinity && mapAutoLevel !== rAutoLevel_Repeat) mapRepeats = game.global.mapRunCounter + 1;
				rTrFMapLevel = mapAutoLevel;
			}
		}

		if (challengeActive('Wither') && rTrFMapLevel >= 0)
			rTrFMapLevel = -1;

		//When mapType is set as Map Count work out how many Tributes/Mets we can farm in the amount of maps specified.
		if (rTrFSettings.mapType === 'Map Count') {
			if (rTrFTributes !== 0) {
				var tributeMaps = currentMap === mapName ? rTrFTributes - game.global.mapRunCounter : rTrFTributes;
				var tributeTime = tributeMaps * 25;
				if (tributeMaps > 4) tributeTime += (Math.floor(tributeMaps / 5) * 45);
				var foodEarnedTributes = game.resources.food.owned + scaleToCurrentMapLocal(simpleSecondsLocal("food", tributeTime, true, rTrFJobRatio), false, true, rTrFMapLevel);
				rTrFTributes = game.buildings.Tribute.purchased + calculateMaxAffordLocal(game.buildings.Tribute, true, false, false, false, 1, foodEarnedTributes);
			}
			if (rTrFMeteorologists !== 0) {
				var meteorologistTime = (currentMap === mapName ? rTrFMeteorologists - game.global.mapRunCounter : rTrFMeteorologists) * 25;
				if (rTrFMeteorologists > 4) meteorologistTime += (Math.floor(rTrFMeteorologists / 5) * 45);
				var foodEarnedMets = game.resources.food.owned + scaleToCurrentMapLocal(simpleSecondsLocal("food", meteorologistTime, true, rTrFJobRatio), false, true, rTrFMapLevel);
				rTrFMeteorologists = game.jobs.Meteorologist.owned + calculateMaxAffordLocal(game.jobs.Meteorologist, false, false, true, false, 1, foodEarnedMets);
			}
		}

		//Identifying how much food you'd get from the amount of jestimps you want to farm on the map level you've selected for them
		if (isDaily && foodShred) {
			var mapDrop = scaleToCurrentMapLocal(simpleSecondsLocal("food", 45, true, rTrFJobRatio), false, true, rTrFMapLevel);
			var shred = 1 - (dailyModifiers.hemmorrhage.getResources(game.global.dailyChallenge.hemmorrhage.strength)[0] / 100);
			var maps = 10;
			var foodTotal = mapDrop;
			//For loop for adding the food from subsequent map runs to the base total
			for (i = 1; i < maps; i++) {
				foodTotal += (mapDrop * (Math.pow(shred, i)));
			}
			tributeShredAmt = game.buildings.Tribute.purchased + calculateMaxAffordLocal(game.buildings.Tribute, true, false, false, false, 1, foodTotal);
			metShredAmt = game.jobs.Meteorologist.owned + calculateMaxAffordLocal(game.jobs.Meteorologist, false, false, true, false, 1, foodTotal);

			if (rTrFMeteorologists > metShredAmt) rTrFMeteorologists = metShredAmt;
			if (rTrFTributes > tributeShredAmt) rTrFTributes = tributeShredAmt;
		}

		if (rTrFTributes > game.buildings.Tribute.purchased || rTrFMeteorologists > game.jobs.Meteorologist.owned) {
			if (rTrFTributes > game.buildings.Tribute.purchased)
				rShouldTributeFarm = true;
			if (rTrFMeteorologists > game.jobs.Meteorologist.owned)
				rShouldMetFarm = true;
		}

		if (rShouldTributeFarm && !getPageSetting('RBuyBuildingsNew')) buyTributes();

		//Figuring out if we have enough resources to run Atlantrimp when setting is enabled.
		if (rTrFAtlantrimp && (rShouldTributeFarm || rShouldMetFarm) && (game.global.world > 33 || (game.global.world === 33 && game.global.lastClearedCell + 2 > 50))) {
			var tributeCost = 0;
			var metCost = 0;

			if (rTrFTributes > game.buildings.Tribute.purchased) {
				for (x = 0; x < rTrFTributes - game.buildings.Tribute.purchased; x++) {
					tributeCost += Math.pow(1.05, game.buildings.Tribute.purchased) * 10000;
				}
			}
			if (rTrFMeteorologists > game.jobs.Meteorologist.owned) {
				for (x = 0; x < rTrFMeteorologists - game.jobs.Meteorologist.owned; x++) {
					metCost += Math.pow(game.jobs.Meteorologist.cost.food[1], game.jobs.Meteorologist.owned + x) * game.jobs.Meteorologist.cost.food[0];
				}
			}
			var totalTrFCost = tributeCost + metCost;

			var barnCost = 0;
			if (totalTrFCost > (game.resources.food.max * (1 + (game.portal.Packrat.modifier * game.portal.Packrat.radLevel))))
				barnCost += game.buildings.Barn.cost.food();
			totalTrFCost += barnCost;

			//Figuring out how much Food we'd farm in the time it takes to run Atlantrimp. Seconds is 165 due to avg of 5x caches (20s per), 4x chronoimps (5s per), 1x jestimp (45s)
			var resourceFarmed = scaleToCurrentMapLocal(simpleSecondsLocal("food", 165, true, rTrFJobRatio), false, true, rTrFMapLevel);

			if ((totalTrFCost > game.resources.food.owned - barnCost + resourceFarmed) && game.resources.food.owned > totalTrFCost / 2) {
				runUnique("Atlantrimp", dontRecycleMaps);
			}
		}
		//Recycles map if we don't need to finish it for meeting the tribute/meteorologist requirements
		if (currentMap === mapName && !rShouldTributeFarm && !rShouldMetFarm) {
			mappingDetails(mapName, rTrFMapLevel, rTrFSpecial, rTrFTributes, rTrFMeteorologists);
			resetMapVars(rTrFSettings);
			if (!dontRecycleMaps && game.global.mapsActive) {
				mapsClicked(true);
				recycleMap();
			}
			if (document.getElementById('autoStructureBtn').classList.contains("enabled") && !getAutoStructureSetting().enabled)
				toggleAutoStructure();
			rTrFbuyBuildings = false;
			return farmingDetails;
		}

		var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== rTrFMapLevel || (getCurrentMapObject().bonus !== rTrFSpecial && (getCurrentMapObject().bonus !== undefined && rTrFSpecial !== '0')));
		var status = rTrFTributes > game.buildings.Tribute.owned ?
			'Tribute Farm: ' + game.buildings.Tribute.owned + "/" + rTrFTributes :
			'Meteorologist Farm: ' + game.jobs.Meteorologist.owned + "/" + rTrFMeteorologists;

		farmingDetails.shouldRun = rShouldTributeFarm || rShouldMetFarm;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = rTrFMapLevel;
		farmingDetails.autoLevel = rTrFSettings.autoLevel;
		farmingDetails.jobRatio = rTrFJobRatio;
		farmingDetails.special = rTrFSpecial;
		farmingDetails.shouldTribute = rShouldTributeFarm;
		farmingDetails.tribute = rTrFTributes;
		farmingDetails.shouldMeteorologist = rShouldMetFarm;
		farmingDetails.meteorologist = rTrFMeteorologists;
		farmingDetails.runAtlantrimp = rTrFAtlantrimp;
		farmingDetails.buyBuildings = rTrFbuyBuildings;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;
	}

	return farmingDetails;
}

MODULES.mapFunctions.smithyMapCount = [0, 0, 0];

//Smithy Farming
function SmithyFarm() {

	const mapName = 'Smithy Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (game.buildings.Smithy.locked || (!autoTrimpSettings.rSmithyFarmDefaultSettings.value.active && !challengeActive('Quest')) || (challengeActive('Quest') && currQuest() !== 10) || challengeActive('Transmute')) return farmingDetails;

	var rShouldSmithyFarm = false;
	var rShouldSmithyGemFarm = false;
	var rShouldSmithyWoodFarm = false;
	var rShouldSmithyMetalFarm = false;
	var mapAutoLevel = Infinity;

	const isC3 = game.global.runningChallengeSquared || challengeActive('Mayhem') || challengeActive('Pandemonium') || challengeActive('Desolation');
	const isDaily = challengeActive('Daily');
	const metalShred = isDaily && typeof (game.global.dailyChallenge.hemmorrhage) !== 'undefined' && dailyModifiers.hemmorrhage.getResources(game.global.dailyChallenge.hemmorrhage.strength).includes('metal');
	const woodShred = isDaily && typeof (game.global.dailyChallenge.hemmorrhage) !== 'undefined' && dailyModifiers.hemmorrhage.getResources(game.global.dailyChallenge.hemmorrhage.strength).includes('wood');
	const smithyShred = woodShred || metalShred;
	const dontRecycleMaps = challengeActive('Trappapalooza') || challengeActive('Archaeology') || challengeActive('Berserk') || game.portal.Frenzy.frenzyStarted !== -1 || !newArmyRdy();
	const totalPortals = getTotalPortals();
	const currChall = game.global.challengeActive;
	const rSFBaseSetting = autoTrimpSettings.rSmithyFarmSettings.value;

	var rSFIndex;

	for (var y = 0; y < rSFBaseSetting.length; y++) {
		const currSetting = rSFBaseSetting[y];
		if (!currSetting.active || currSetting.done === totalPortals + "_" + game.global.world || game.global.world !== currSetting.world || game.global.lastClearedCell + 2 < currSetting.cell) {
			continue;
		}
		if (currSetting.runType !== 'All') {
			if (!isC3 && !isDaily && (currSetting.runType !== 'Filler' ||
				(currSetting.runType === 'Filler' && (currSetting.challenge !== 'All' && currSetting.challenge !== currChall)))) continue;
			if (isDaily && currSetting.runType !== 'Daily') continue;
			if (isC3 && (currSetting.runType !== 'C3' ||
				(currSetting.runType === 'C3' && (currSetting.challenge3 !== 'All' && currSetting.challenge3 !== currChall)))) continue;
		}
		if (game.global.world === currSetting.world) {
			rSFIndex = y;
			break;
		}
	}

	if (rSFIndex >= 0 || currQuest() === 10) {

		let mapBonus;
		if (game.global.mapsActive) mapBonus = getCurrentMapObject().bonus;

		var rSFSettings = autoTrimpSettings.rSmithyFarmSettings.value[rSFIndex];
		var rSFMapLevel = challengeActive('Quest') ? -1 : rSFSettings.level;
		var rSFSpecial = getAvailableSpecials('lmc');
		var rSFJobRatio = '0,0,0,0';
		var rSFSmithies = challengeActive('Quest') ? game.buildings.Smithy.purchased + 1 : rSFSettings.repeat;

		if (currQuest() === 10 || rSFSettings.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.mapFunctions.smithyMapCount !== [0, 0, 0] && typeof getCurrentMapObject().bonus !== 'undefined') {
				if (mapBonus === 'lsc' || mapBonus === 'ssc') game.global.mapRunCounter = MODULES.mapFunctions.smithyMapCount[0];
				else if (mapBonus === 'lwc' || mapBonus === 'swc') game.global.mapRunCounter = MODULES.mapFunctions.smithyMapCount[1];
				else if (mapBonus === 'lmc' || mapBonus === 'smc') game.global.mapRunCounter = MODULES.mapFunctions.smithyMapCount[2];
			}

			var rAutoLevel_Repeat = rAutoLevel;
			mapAutoLevel = callAutoMapLevel(currentMap, rAutoLevel, rSFSpecial, null, null, false);
			if (mapAutoLevel !== Infinity) {
				if (rAutoLevel_Repeat !== Infinity && mapAutoLevel !== rAutoLevel_Repeat) {
					if (game.global.mapsActive && typeof mapBonus !== 'undefined') {
						if (mapBonus === 'lsc' || mapBonus === 'ssc') MODULES.mapFunctions.smithyMapCount[0] = (game.global.mapRunCounter + 1);
						else if (mapBonus === 'lwc' || mapBonus === 'swc') MODULES.mapFunctions.smithyMapCount[1] = (game.global.mapRunCounter + 1);
						else if (mapBonus === 'lmc' || mapBonus === 'smc') MODULES.mapFunctions.smithyMapCount[2] = (game.global.mapRunCounter + 1);
					}
				}
				rSFMapLevel = mapAutoLevel;
			}
		}
		if (challengeActive('Wither') && rSFMapLevel >= 0)
			rSFMapLevel = -1;

		//Initialising base food & metal vars for calcs later on
		let woodBase = scaleToCurrentMapLocal(simpleSecondsLocal("wood", 1, true, '0,1,0'), false, true, rSFMapLevel);
		let metalBase = scaleToCurrentMapLocal(simpleSecondsLocal("metal", 1, true, '0,0,1'), false, true, rSFMapLevel);

		//When mapType is set as Map Count work out how many Smithies we can farm in the amount of maps specified.
		if (currQuest() !== 10 && rSFSettings.mapType === 'Map Count' && rSFSmithies !== 0) {
			var smithyCount = 0;
			//Checking total map count user wants to run
			var totalMaps = currentMap === mapName ? rSFSmithies - game.global.mapRunCounter : rSFSmithies;
			//Calculating cache + jestimp + chronoimp
			var mapTime = totalMaps * 25;
			if (totalMaps > 4) mapTime += (Math.floor(totalMaps / 5) * 45);
			var smithy_Cost_Mult = game.buildings.Smithy.cost.gems[1];

			//Calculating wood & metal earned then using that info to identify how many Smithies you can afford from those values.
			var woodEarned = woodBase * mapTime;
			var metalEarned = metalBase * mapTime;
			var woodSmithies = game.buildings.Smithy.purchased + getMaxAffordable(Math.pow((smithy_Cost_Mult), game.buildings.Smithy.owned) * game.buildings.Smithy.cost.wood[0], (game.resources.wood.owned + woodEarned), (smithy_Cost_Mult), true)
			var metalSmithies = game.buildings.Smithy.purchased + getMaxAffordable(Math.pow((smithy_Cost_Mult), game.buildings.Smithy.owned) * game.buildings.Smithy.cost.wood[0], (game.resources.metal.owned + metalEarned), (smithy_Cost_Mult), true)

			if (woodSmithies > 0 && metalSmithies > 0) {
				//Taking the minimum value of the 2 to see which is more reasonable to aim for
				smithyCount = Math.min(woodSmithies, metalSmithies)

				//Figuring out Smithy cost of the 2 different resources
				var rSFWoodCost = getBuildingItemPrice(game.buildings.Smithy, 'wood', false, smithyCount - game.buildings.Smithy.purchased);
				var rSFMetalCost = getBuildingItemPrice(game.buildings.Smithy, 'metal', false, smithyCount - game.buildings.Smithy.purchased);

				//Looking to see how many maps it would take to reach this smithy target
				var rSFWoodMapCount = Math.floor((rSFWoodCost - game.resources.wood.owned) / (woodBase * 34));
				var rSFMetalMapCount = Math.floor((rSFMetalCost - game.resources.metal.owned) / (metalBase * 34));
				//If combined maps for both resources is higher than desired maps to be run then will farm 1 less smithy
				if ((rSFWoodMapCount + rSFMetalMapCount) > rSFSmithies) rSFSmithies = smithyCount - 1
				else rSFSmithies = smithyCount;
			}
			else rSFSmithies = 1;
		}

		//Checking for daily resource shred
		if (typeof game.global.dailyChallenge.hemmorrhage !== 'undefined' && smithyShred) {
			var rSFSpecialTime = rSFSpecial[0] === 'l' && rSFSpecial.length === 3 ? 20 : rSFSpecial[0] === 's' ? 10 : 0;

			if (woodShred && metalShred) {
				var woodGain = woodBase * rSFSpecialTime;
				var metalGain = metalBase * rSFSpecialTime;
			}
			else if (woodShred) {
				var woodGain = woodBase * ((rSFSpecialTime * 2) + 45)
				var metalGain = Infinity;
			}
			else if (metalShred) {
				var woodGain = Infinity;
				var metalGain = metalBase * ((rSFSpecialTime * 2) + 45)
			}
			var smithy_Cost_Mult = game.buildings.Smithy.cost.gems[1];
			var smithy_Max_Affordable = [getMaxAffordable(Math.pow((smithy_Cost_Mult), game.buildings.Smithy.owned) * game.buildings.Smithy.cost.gems[0], (Infinity), (smithy_Cost_Mult), true),
			getMaxAffordable(Math.pow((smithy_Cost_Mult), game.buildings.Smithy.owned) * game.buildings.Smithy.cost.metal[0], (woodGain), (smithy_Cost_Mult), true),
			getMaxAffordable(Math.pow((smithy_Cost_Mult), game.buildings.Smithy.owned) * game.buildings.Smithy.cost.wood[0], (metalGain), (smithy_Cost_Mult), true)];
			var smithy_Can_Afford = game.buildings.Smithy.purchased + Math.min(smithy_Max_Affordable[0], smithy_Max_Affordable[1], smithy_Max_Affordable[2]);
			rSFSmithies = smithy_Can_Afford > 0 && rSFSmithies > smithy_Can_Afford ? smithy_Can_Afford : rSFSmithies;
		}

		rSFGoal = 0;

		var smithyGemCost = getBuildingItemPrice(game.buildings.Smithy, 'gems', false, rSFSmithies - game.buildings.Smithy.purchased);
		var smithyWoodCost = getBuildingItemPrice(game.buildings.Smithy, 'wood', false, rSFSmithies - game.buildings.Smithy.purchased);
		var smithyMetalCost = getBuildingItemPrice(game.buildings.Smithy, 'metal', false, rSFSmithies - game.buildings.Smithy.purchased);

		if (rSFSmithies > game.buildings.Smithy.purchased) {
			if (smithyGemCost > game.resources.gems.owned) {
				rShouldSmithyGemFarm = true;
				rSFSpecial = getAvailableSpecials('lsc');
				rSFJobRatio = '1,0,0,0';
				rSFGoal = smithyGemCost.toExponential(2) + ' gems.';
			}
			else if (smithyWoodCost > game.resources.wood.owned) {
				rShouldSmithyWoodFarm = true;
				rSFSpecial = getAvailableSpecials('lwc');
				rSFJobRatio = '0,1,0,0';
				rSFGoal = smithyWoodCost.toExponential(2) + ' wood.';
			}
			else if (smithyMetalCost > game.resources.metal.owned) {
				rShouldSmithyMetalFarm = true;
				rSFSpecial = getAvailableSpecials('lmc');
				rSFJobRatio = '0,0,1,0';
				rSFGoal = smithyMetalCost.toExponential(2) + ' metal.';
			}
			rShouldSmithyFarm = true;
		}

		if ((!autoTrimpSettings.RBuyBuildingsNew.enabled || !autoTrimpSettings.rBuildingSettingsArray.value.Smithy.enabled || challengeActive('Hypothermia')) && rShouldSmithyFarm && rSFSmithies > game.buildings.Smithy.purchased && canAffordBuilding('Smithy', false, false, false, false, 1)) {
			buyBuilding("Smithy", true, true, 1);
		}

		//Recycles map if we don't need to finish it for meeting the farm requirements
		if (currentMap === mapName && !dontRecycleMaps) {
			if (game.global.mapsActive && typeof mapBonus !== 'undefined' && ((!rShouldSmithyGemFarm && mapBonus.includes('sc')) || (!rShouldSmithyWoodFarm && mapBonus.includes('wc')) || (!rShouldSmithyMetalFarm && mapBonus.includes('mc')))) {
				var mapProg = game.global.mapsActive ? ((getCurrentMapCell().level - 1) / getCurrentMapObject().size) : 0;
				var mappingLength = (mapProg > 0 ? Number(((game.global.mapRunCounter + mapProg)).toFixed(2)) : game.global.mapRunCounter);
				if (mapBonus === 'lsc' || mapBonus === 'ssc') MODULES.mapFunctions.smithyMapCount[0] = mappingLength;
				else if (mapBonus === 'lwc' || mapBonus === 'swc') MODULES.mapFunctions.smithyMapCount[1] = mappingLength;
				else if (mapBonus === 'lmc' || mapBonus === 'smc') MODULES.mapFunctions.smithyMapCount[2] = mappingLength;
				if (!dontRecycleMaps) {
					mapsClicked(true);
					recycleMap();
				}
			}
		}
		if (currentMap === mapName && !rShouldSmithyFarm) {
			mappingDetails(mapName, rSFMapLevel, rSFSpecial, rSFSmithies);
			if (document.getElementById('autoStructureBtn').classList.contains("enabled") && !getAutoStructureSetting().enabled)
				toggleAutoStructure();
			MODULES.mapFunctions.smithyMapCount = [0, 0, 0];
			HDRatio = calcHDRatio(game.global.world, 'world');
			if (!challengeActive('Quest') && rSFSettings.meltingPoint) runUnique('Melting Point', false);
			resetMapVars(rSFSettings);
			return farmingDetails;
		}

		var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== rSFMapLevel || mapBonus !== rSFSpecial);
		var status = 'Smithy Farming for ' + rSFGoal;

		farmingDetails.shouldRun = rShouldSmithyFarm;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = rSFMapLevel;
		farmingDetails.autoLevel = currQuest() === 10 ? true : rSFSettings.autoLevel;
		farmingDetails.jobRatio = rSFJobRatio;
		farmingDetails.special = rSFSpecial;
		farmingDetails.smithies = rSFSmithies;
		farmingDetails.farmGoal = rSFGoal;
		farmingDetails.gemFarm = rShouldSmithyGemFarm;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;

	}
	return farmingDetails;
}

var rWFDebug = 0;

//Worshipper Farm
function WorshipperFarm() {
	const mapName = 'Worshipper Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};
	if (game.jobs.Worshipper.locked || !autoTrimpSettings.rWorshipperFarmDefaultSettings.value.active) return farmingDetails;
	const isC3 = game.global.runningChallengeSquared || challengeActive('Mayhem') || challengeActive('Pandemonium') || challengeActive('Desolation');
	const isDaily = challengeActive('Daily');
	const currChall = game.global.challengeActive;
	const rWFBaseSetting = autoTrimpSettings.rWorshipperFarmSettings.value

	var rShouldWorshipperFarm = false;
	var rShouldSkip = false;
	var mapAutoLevel = Infinity;

	var rWFIndex;
	for (var y = 0; y < rWFBaseSetting.length; y++) {
		const currSetting = rWFBaseSetting[y];
		if (!currSetting.active || currSetting.done === totalPortals + "_" + game.global.world || game.global.world < currSetting.world || game.global.world > currSetting.endzone || (game.global.world > currSetting.zone && currSetting.repeatevery === 0)) {
			continue;
		}
		if (currSetting.runType !== 'All') {
			if (!isC3 && !isDaily && (currSetting.runType !== 'Filler' ||
				(currSetting.runType === 'Filler' && (currSetting.challenge !== 'All' && currSetting.challenge !== currChall)))) continue;
			if (isDaily && currSetting.runType !== 'Daily') continue;
			if (isC3 && (currSetting.runType !== 'C3' ||
				(currSetting.runType === 'C3' && (currSetting.challenge3 !== 'All' && currSetting.challenge3 !== currChall)))) continue;
		}
		if (game.global.world === currSetting.world && game.global.lastClearedCell + 2 >= currSetting.cell) {
			rWFIndex = y;
			break;
		}
		if ((game.global.world - currSetting.world) % currSetting.repeatevery === 0 && game.global.lastClearedCell + 2 >= currSetting.cell) {
			rWFIndex = y;
			break;
		}
	}

	if (rWFIndex >= 0) {
		var rWFSettings = rWFBaseSetting[rWFIndex];
		rWFGoal = rWFSettings.worshipper;
		var rWFMapLevel = rWFSettings.level;
		var rWFJobRatio = rWFSettings.jobratio;
		var rWFSpecial = getAvailableSpecials('lsc');

		if (rWFSettings.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && mapRepeats !== 0) {
				game.global.mapRunCounter = mapRepeats;
				mapRepeats = 0;
			}
			var rAutoLevel_Repeat = rAutoLevel;
			mapAutoLevel = callAutoMapLevel(currentMap, rAutoLevel, rWFSpecial, null, null, false);
			if (mapAutoLevel !== Infinity) {
				if (rAutoLevel_Repeat !== Infinity && mapAutoLevel !== rAutoLevel_Repeat) mapRepeats = game.global.mapRunCounter + 1;
				rWFMapLevel = mapAutoLevel;
			}
		}

		if (challengeActive('Wither') && rWFMapLevel >= 0) rWFMapLevel = -1;
		if (game.jobs.Worshipper.owned != 50 && game.stats.zonesCleared.value != rWFDebug && (scaleToCurrentMapLocal(simpleSecondsLocal("food", 20, true, rWFJobRatio), false, true, rWFMapLevel) < (game.jobs.Worshipper.getCost() * autoTrimpSettings.rWorshipperFarmDefaultSettings.value.shipskip))) {
			debug("Skipping Worshipper farming on zone " + game.global.world + " as 1 " + rWFSpecial + " map doesn't provide " + autoTrimpSettings.rWorshipperFarmDefaultSettings.value.shipskip + " or more Worshippers. Evaluate your map settings to correct this");
			rWFDebug = game.stats.zonesCleared.value;
		}
		if (game.jobs.Worshipper.owned != 50 && rWFGoal > game.jobs.Worshipper.owned && scaleToCurrentMapLocal(simpleSecondsLocal("food", 20, true, rWFJobRatio), false, true, rWFMapLevel) >= (game.jobs.Worshipper.getCost() * autoTrimpSettings.rWorshipperFarmDefaultSettings.value.shipskip))
			rShouldWorshipperFarm = true;
		if (currentMap !== mapName && game.jobs.Worshipper.owned >= rWFGoal)
			rShouldSkip = true;

		if (currentMap === mapName && !rShouldWorshipperFarm) {
			mappingDetails(mapName, rWFMapLevel, rWFSpecial);
			if (getPageSetting('rMapRepeatCount') && rShouldSkip) debug("Worshipper Farm (Z" + game.global.world + ") skipped as Worshipper goal has been met (" + game.jobs.Worshipper.owned + "/" + rWFGoal + ").");
			resetMapVars(rWFSettings);
		}

		var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== rWFMapLevel || (getCurrentMapObject().bonus !== rWFSpecial && (getCurrentMapObject().bonus !== undefined && rWFSpecial !== '0')));
		var status = 'Worshipper Farm: ' + game.jobs.Worshipper.owned + "/" + rWFGoal;

		farmingDetails.shouldRun = rShouldWorshipperFarm;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = rWFMapLevel;
		farmingDetails.autoLevel = rWFSettings.autoLevel;
		farmingDetails.jobRatio = rWFJobRatio;
		farmingDetails.special = rWFSpecial;
		farmingDetails.worshipper = rWFGoal;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;
		farmingDetails.gather = 'food';

	}
	return farmingDetails;
}

//Daily (bloodthirst), Balance, Unbalance & Storm Destacking
function MapDestacking() {

	const mapName = 'rDestack';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (
		!(getPageSetting('balance') && challengeActive('Balance')) &&
		!(getPageSetting('rUnbalance') && challengeActive('Unbalance')) &&
		!(getPageSetting('Rstormon') && challengeActive('Storm')) &&
		!(challengeActive('Daily') && getPageSetting('rBloodthirstDestack') && typeof game.global.dailyChallenge.bloodthirst !== 'undefined')
	)
		return farmingDetails;

	var rShouldDestack = false;
	var rDMapLevel = -(game.global.world - 6);
	var rDSpecial = getAvailableSpecials('fa');
	var rDDestack = 0;


	//Balance Destacking
	if (challengeActive('Balance')) {
		var balanceZone = getPageSetting('balanceZone') > 0 ? getPageSetting('balanceZone') : Infinity;
		var balanceStacks = getPageSetting('balanceStacks') > 0 ? getPageSetting('balanceStacks') : Infinity;
		rShouldDestack = (((game.global.mapsActive ? Infinity : autoBattle.oneTimers.Burstier.owned ? 4 : 5) - game.heirlooms.Shield.gammaBurst.stacks !== 0) && game.global.world >= balanceZone && (game.challenges.Balance.balanceStacks >= balanceStacks || (getPageSetting('balanceImprobDestack') && game.global.lastClearedCell + 2 == 100 && game.challenges.Balance.balanceStacks != 0)));
		rDDestack = game.challenges.Balance.balanceStacks;
	}

	//Unbalance Destacking
	if (challengeActive('Unbalance')) {
		var rUnbalanceZone = getPageSetting('rUnbalanceZone') > 0 ? getPageSetting('rUnbalanceZone') : Infinity;
		var rUnbalanceStacks = getPageSetting('rUnbalanceStacks') > 0 ? getPageSetting('rUnbalanceStacks') : Infinity;
		rShouldDestack = (((game.global.mapsActive ? Infinity : autoBattle.oneTimers.Burstier.owned ? 4 : 5) - game.heirlooms.Shield.gammaBurst.stacks !== 0) && game.global.world >= rUnbalanceZone && (game.challenges.Unbalance.balanceStacks >= rUnbalanceStacks || (getPageSetting('rUnbalanceImprobDestack') && game.global.lastClearedCell + 2 == 100 && game.challenges.Unbalance.balanceStacks != 0)));
		rDDestack = game.challenges.Unbalance.balanceStacks;
	}

	//Bloodthirst Destacking
	if (challengeActive('Daily') && !game.global.mapsActive && game.global.dailyChallenge.bloodthirst.stacks >= dailyModifiers.bloodthirst.getFreq(game.global.dailyChallenge.bloodthirst.strength) - 1) {
		rShouldDestack = true;
		rDDestack = game.global.dailyChallenge.bloodthirst.stacks;
	}

	//Storm Destacking
	if (challengeActive('Storm')) {
		var rStormZone = getPageSetting('rStormZone') > 0 ? getPageSetting('rStormZone') : Infinity;
		var rStormStacks = getPageSetting('rStormStacks') > 0 ? getPageSetting('rStormStacks') : Infinity;
		rShouldDestack = (game.global.world >= rStormZone && (game.challenges.Storm.beta >= rStormStacks && game.challenges.Storm.beta != 0));
		rDDestack = game.challenges.Storm.beta;
	}

	if (!game.jobs.Explorer.locked && game.global.mapsActive && getCurrentMapObject().level == 6 &&
		(
			(challengeActive('Balance') && !rShouldDestack && game.challenges.Balance.balanceStacks == 0) ||
			(challengeActive('Daily') && !rShouldDestack && game.global.dailyChallenge.bloodthirst.stacks === 0) ||
			(challengeActive('Unbalance') && !rShouldDestack && game.challenges.Unbalance.balanceStacks == 0) ||
			(challengeActive('Storm') && !rShouldDestack && game.challenges.Storm.beta == 0)
		)
	) {
		mapsClicked(true);
		recycleMap();
	}

	var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== rDMapLevel || (getCurrentMapObject().bonus !== rDSpecial && (getCurrentMapObject().bonus !== undefined && rDSpecial !== '0')) || (getCurrentMapObject().size - getCurrentMapCell().level) > rDDestack);

	var status = 'Destacking: ' + rDDestack + ' stacks remaining';

	farmingDetails.shouldRun = rShouldDestack;
	farmingDetails.mapName = mapName;
	farmingDetails.mapLevel = rDMapLevel;
	farmingDetails.autoLevel = false;
	farmingDetails.special = rDSpecial;
	farmingDetails.destack = rDDestack;
	farmingDetails.repeat = !repeat;
	farmingDetails.status = status;


	return farmingDetails;
}

//Prestige variables == TO GET SORTED LATER!
var RAMPfragmappy = undefined;
var RAMPprefragmappy = undefined;
var RAMPpMap = new Array(5);
var RAMPrepMap = new Array(5);
var RAMPmapbought = [[false], [false], [false], [false], [false]];
RAMPmapbought.fill(false); //Unsure if necessary - Need to test
var RAMPfragmappybought = false;
var RAMPfragfarming = false;
var runningPrestigeMaps = false;

//Prestige Raiding
function PrestigeRaiding() {

	const mapName = 'rPrestige'
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (game.global.universe === 1 && !autoTrimpSettings.hRaidingDefaultSettings.value.active) return farmingDetails;
	if (game.global.universe === 2 && !autoTrimpSettings.rRaidingDefaultSettings.value.active) return farmingDetails;

	var rShouldPrestigeRaid = false;
	const isC3 = game.global.runningChallengeSquared || challengeActive('Mayhem') || challengeActive('Pandemonium') || challengeActive('Desolation');
	const isDaily = challengeActive('Daily');
	const currChall = game.global.challengeActive;
	const rRaidingDefaultSetting = game.global.universe === 1 ? autoTrimpSettings.hRaidingDefaultSettings.value : autoTrimpSettings.rRaidingDefaultSettings.value;
	const rRaidingBaseSetting = game.global.universe === 1 ? autoTrimpSettings.hRaidingSettings.value : autoTrimpSettings.rRaidingSettings.value;

	var rRaidingIndex;

	for (var y = 0; y < rRaidingBaseSetting.length; y++) {
		const currSetting = rRaidingBaseSetting[y];
		if (!currSetting.active || game.global.world < currSetting.world || game.global.lastClearedCell + 2 < currSetting.cell || Rgetequips(currSetting.raidingzone, false) === 0) {
			continue;
		}
		if (currSetting.runType !== 'All') {
			if (!isC3 && !isDaily && (currSetting.runType !== 'Filler' ||
				(currSetting.runType === 'Filler' && (currSetting.challenge !== 'All' && currSetting.challenge !== currChall)))) continue;
			if (isDaily && currSetting.runType !== 'Daily') continue;
			if (isC3 && (currSetting.runType !== 'C3' ||
				(currSetting.runType === 'C3' && (currSetting.challenge3 !== 'All' && currSetting.challenge3 !== currChall)))) continue;
		}
		if (game.global.world === currSetting.world) {
			rRaidingIndex = y;
			break;
		}
	}

	if (rRaidingIndex >= 0) {
		//Setting up variables and checking if we should use daily settings instead of normal Prestige Farm settings
		var rRaidingSettings = rRaidingBaseSetting[rRaidingIndex];
		raidzones = rRaidingSettings.raidingzone;
		var rPRRecycle = rRaidingDefaultSetting.recycle;
		var rPRFragFarm = rRaidingSettings.raidingDropdown;

		if (Rgetequips(raidzones, false) > 0) {
			rShouldPrestigeRaid = true;
		}

		var status = 'Prestige Raiding: ' + Rgetequips(raidzones, false) + ' items remaining';
		var repeat = false;

		farmingDetails.shouldRun = rShouldPrestigeRaid;
		farmingDetails.mapName = mapName;
		farmingDetails.recycle = rPRRecycle;
		farmingDetails.fragSetting = rPRFragFarm;
		farmingDetails.repeat = !repeat
		farmingDetails.status = status;
	}


	//Resetting variables and recycling the maps used
	if (!rShouldPrestigeRaid && (currentMap === mapName || (RAMPrepMap[0] != undefined || RAMPrepMap[1] != undefined || RAMPrepMap[2] != undefined || RAMPrepMap[3] != undefined || RAMPrepMap[4] != undefined))) {
		RAMPfragmappy = undefined;
		RAMPprefragmappy = undefined;
		RAMPfragmappybought = false;
		for (var x = 0; x < 5; x++) {
			RAMPpMap[x] = undefined;
			RAMPmapbought[x] = undefined;

			if (RAMPrepMap[x] != undefined) {
				if (autoTrimpSettings.rRaidingDefaultSettings.value.recycle) {
					recycleMap(getMapIndex(RAMPrepMap[x]));
				}
				RAMPrepMap[x] = undefined;
			}
		}
	}

	return farmingDetails;
}

//Running Prestige Raid Code
function rRunRaid() {
	var RAMPfragcheck = true;
	rPRFragFarm = rMapSettings.fragSetting;
	if (rPRFragFarm > 0) {
		if (RAMPfrag(raidzones, rPRFragFarm) == true) {
			RAMPfragcheck = true;
			RAMPfragfarming = false;
		} else if (RAMPfrag(raidzones, rPRFragFarm) == false && !RAMPmapbought[0] && !RAMPmapbought[1] && !RAMPmapbought[2] && !RAMPmapbought[3] && !RAMPmapbought[4]) {
			RAMPfragfarming = true;
			RAMPfragcheck = false;
			if (!RAMPfragcheck && RAMPfragmappy == undefined && !RAMPfragmappybought && game.global.preMapsActive) {
				debug("Check complete for frag map");
				fragmap();
				if ((updateMapCost(true) <= game.resources.fragments.owned)) {
					buyMap();
					RAMPfragmappybought = true;
					if (RAMPfragmappybought) {
						RAMPfragmappy = game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1].id;
						debug("Frag map bought");
					}
				}
			}
			if (!RAMPfragcheck && game.global.preMapsActive && !game.global.mapsActive && RAMPfragmappybought && RAMPfragmappy != undefined) {
				debug("Running frag map");
				selectedMap = RAMPfragmappy;
				selectMap(RAMPfragmappy);
				runMap();
				RAMPprefragmappy = RAMPfragmappy;
				RAMPfragmappy = undefined;
			}
			if (!RAMPfragcheck && game.global.mapsActive && RAMPfragmappybought && RAMPprefragmappy != undefined) {
				if (RAMPfrag(raidzones, rPRFragFarm) == false) {
					if (!game.global.repeatMap) {
						repeatClicked();
					}
				} else if (RAMPfrag(raidzones, rPRFragFarm) == true) {
					if (game.global.repeatMap) {
						repeatClicked();
						mapsClicked(true);
					}
					if (game.global.preMapsActive && RAMPfragmappybought && RAMPprefragmappy != undefined) {
						RAMPfragmappybought = false;
					}
					if (RAMPprefragmappy != undefined) {
						recycleMap(getMapIndex(RAMPprefragmappy));
						RAMPprefragmappy = undefined;
					}
					RAMPfragcheck = true;
					RAMPfragfarming = false;
				}
			}
		} else {
			RAMPfragcheck = true;
			RAMPfragfarming = false;
		}
	}
	if (RAMPfragcheck) {
		raiding = rPRFragFarm == 2 ? RAMPplusPresfragmax : rPRFragFarm == 1 ? RAMPplusPresfragmin : RAMPplusPres;
		document.getElementById("mapLevelInput").value = game.global.world;
		incrementMapLevel(1);
		for (var x = 0; x < 5; x++) {
			if (RAMPpMap[x] == undefined && !RAMPmapbought[x] && game.global.preMapsActive && RAMPshouldrunmap(x, raidzones)) {
				raiding(x, raidzones);
				if ((updateMapCost(true) <= game.resources.fragments.owned)) {
					buyMap();
					RAMPmapbought[x] = true;
					if (RAMPmapbought[x]) {
						RAMPpMap[x] = (game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1].id);
						RAMPMapsRun = x;
						debug("Map " + [(x + 1)] + " bought");
					}
				}
			}
		}

		if (!RAMPmapbought[0] && !RAMPmapbought[1] && !RAMPmapbought[2] && !RAMPmapbought[3] && !RAMPmapbought[4]) {
			RAMPpMap.fill(undefined);
			debug("Failed to Prestige Raid. Looks like you can't afford to or have no equips to get!");
			autoTrimpSettings["RAutoMaps"].value = 0;
		}
		for (var x = RAMPMapsRun; x > -1; x--) {
			if (game.global.preMapsActive && !game.global.mapsActive && RAMPmapbought[x] && RAMPpMap[x] != undefined) {
				debug("Running map " + [(RAMPMapsRun - x + 1)]);
				selectedMap = RAMPpMap[x];
				selectMap(RAMPpMap[x]);
				runMap();
				RAMPrepMap[x] = RAMPpMap[x];
				RAMPpMap[x] = undefined;
				runningPrestigeMaps = true;
			}
		}
	}

	if (game.global.preMapsActive && runningPrestigeMaps) runMap()
}

//Prestige Climb
function PrestigeClimb() {

	const mapName = 'Prestige Climb'
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	const universe = game.global.universe === 1 ? '' : 'r';

	if (challengeActive('Frugal')) return farmingDetails;
	if (challengeActive('Mapology') && !getPageSetting('mapology')) return farmingDetails;

	const targetPrestige = challengeActive('Mapology') ? autoTrimpSettings['mapologyPrestige'].selected : autoTrimpSettings[universe + 'Prestige'].selected;
	if (targetPrestige === "Off") return farmingDetails;

	var customVars = MODULES["maps"];
	var skippedPrestige = false;
	var needPrestige = false;

	const prestigeList = ['Supershield', 'Dagadder', 'Bootboost', 'Megamace', 'Hellishmet', 'Polierarm', 'Pantastic', 'Axeidic', 'Smoldershoulder', 'Greatersword', 'Bestplate', 'Harmbalest', 'GambesOP'];
	const metalPrestigeList = ['Dagadder', 'Megamace', 'Polierarm', 'Axeidic', 'Greatersword', 'Harmbalest', 'Bootboost', 'Hellishmet', 'Pantastic', 'Smoldershoulder', 'Bestplate', 'GambesOP'];

	let mapLevel = 0;
	const z = game.global.world;

	//Prestige
	if (getPageSetting('ForcePresZ') !== -1 && (game.global.world) >= getPageSetting(universe + 'ForcePresZ')) {
		needPrestige = (offlineProgress.countMapItems(game.global.world) !== 0);
	} else
		needPrestige = game.mapUnlocks[targetPrestige] && game.mapUnlocks[targetPrestige].last + 5 <= (game.global.world);

	const prestigeInfo = equipsToGet(z, targetPrestige);


	//Figure out how many equips to farm for && maps to run to get to that value
	var prestigeToFarmFor = prestigeInfo[0];
	var mapsToRun = prestigeInfo[1];

	if (!challengeActive('Mapology')) {
		//Prestige Skip 1
		if (needPrestige && getPsString("gems", true) > 0 && (getPageSetting(universe + 'PrestigeSkip1_2') == 1 || getPageSetting(universe + 'PrestigeSkip1_2') == 2)) {
			var numUnbought = 0;
			for (const p of metalPrestigeList) {
				if (game.upgrades[p].allowed - game.upgrades[p].done > 0)
					numUnbought++;
			}
			if (numUnbought >= customVars.SkipNumUnboughtPrestiges) {
				needPrestige = false;
				skippedPrestige = true;
			}
		}

		//Prestige Skip 2
		if ((needPrestige || skippedPrestige) && (getPageSetting(universe + 'PrestigeSkip1_2') == 1 || getPageSetting(universe + 'PrestigeSkip1_2') == 3)) {
			const numLeft = prestigeList.filter(targetPrestige => game.mapUnlocks[targetPrestige].last <= (game.global.world) - 5);
			const shouldSkip = numLeft <= customVars.UnearnedPrestigesRequired;
			if (shouldSkip != skippedPrestige) {
				needPrestige = !needPrestige;
				skippedPrestige = !skippedPrestige;
			}
		}
	}

	var special = getAvailableSpecials('p');

	if (currentMap === mapName && !needPrestige) {
		mappingDetails(mapName, 0, special);
		resetMapVars();
	}

	if (!needPrestige) return farmingDetails;

	if (game.options.menu.mapLoot.enabled != 1) toggleSetting('mapLoot');
	var status = 'Prestige Climb: ' + prestigeToFarmFor + ' items remaining';

	var repeat = !(
		game.global.mapsActive && (
			mapsToRun > (getCurrentMapObject().bonus === 'p' && (game.global.lastClearedMapCell !== getCurrentMapObject().size - 2) ? 2 : 1) ||
			(getCurrentMapObject().level - game.global.world) !== mapLevel ||
			(getCurrentMapObject().bonus !== special &&
				(getCurrentMapObject().bonus !== undefined && special !== '0')
			)
		)
	);

	farmingDetails.shouldRun = needPrestige;
	farmingDetails.mapName = mapName;
	farmingDetails.status = status;
	farmingDetails.repeat = !repeat;
	farmingDetails.mapLevel = mapLevel;
	farmingDetails.autoLevel = true;
	farmingDetails.special = special;
	farmingDetails.prestigeToFarmFor = prestigeToFarmFor;
	farmingDetails.mapsToRun = mapsToRun;

	return farmingDetails;
}

//Bionic Wonderland Raiding
function BionicRaiding() {

	const mapName = 'Bionic Raiding'
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (game.global.universe === 1 && !autoTrimpSettings.hBionicRaidingDefaultSettings.value.active) return farmingDetails;
	if (challengeActive('Experience') && game.global.world > 600) return farmingDetails;
	if (challengeActive('Mapology') && !getPageSetting('mapology')) return farmingDetails;

	var rShouldBionicRaid = false;
	const isC3 = game.global.runningChallengeSquared;
	const isDaily = challengeActive('Daily');
	const currChall = game.global.challengeActive;
	const rBionicRaidingDefaultSetting = autoTrimpSettings.hBionicRaidingDefaultSettings.value;
	const rBionicRaidingBaseSetting = autoTrimpSettings.hBionicRaidingSettings.value;
	const targetPrestige = challengeActive('Mapology') ? autoTrimpSettings['mapologyPrestige'].selected : 'GamesOP';

	var index;

	for (var y = 0; y < rBionicRaidingBaseSetting.length; y++) {
		const currSetting = rBionicRaidingBaseSetting[y];
		var raidZones = currSetting.raidingzone
		if (!currSetting.active || game.global.world < currSetting.world || game.global.world > currSetting.endzone || (game.global.world > currSetting.zone && currSetting.repeatevery === 0) || game.global.lastClearedCell + 2 < currSetting.cell) {
			continue;
		}
		if (currSetting.repeatevery !== 0 && game.global.world > currSetting.world) {
			var times = currSetting.repeatevery;
			var repeats = Math.round((game.global.world - currSetting.world) / times);
			if (repeats > 0) raidZones += (times * repeats);
		}
		if (equipsToGet(raidZones, targetPrestige)[0] === 0) continue;
		if (currSetting.runType !== 'All') {
			if (!isC3 && !isDaily && (currSetting.runType !== 'Filler' ||
				(currSetting.runType === 'Filler' && (currSetting.challenge !== 'All' && currSetting.challenge !== currChall)))) continue;
			if (isDaily && currSetting.runType !== 'Daily') continue;
			if (isC3 && (currSetting.runType !== 'C3' ||
				(currSetting.runType === 'C3' && (currSetting.challenge3 !== 'All' && currSetting.challenge3 !== currChall)))) continue;
		}
		if (game.global.world === currSetting.world || ((game.global.world - currSetting.world) % currSetting.repeatevery === 0)) {
			index = y;
			break;
		}
	}

	if (index >= 0) {
		//Setting up variables and checking if we should use daily settings instead of normal Prestige Farm settings
		var rBionicRaidingSetting = rBionicRaidingBaseSetting[index];
		var raidzonesBW = raidZones;

		if (equipsToGet(raidzonesBW, targetPrestige)[0] > 0) {
			rShouldBionicRaid = true;
		}

		var status = 'Raiding to BW' + raidzonesBW + ': ' + equipsToGet(raidzonesBW, targetPrestige)[0] + ' items remaining';
		var repeat = !(
			(game.global.mapsActive && (
				equipsToGet(getCurrentMapObject().level, targetPrestige)[1] !== (game.talents.bionic2.purchased ? 2 : 1)
				||
				getCurrentMapObject().location !== 'Bionic')
			)
		);


		if (currentMap === mapName && !rShouldBionicRaid) {
			mappingDetails(mapName, 0, special);
			resetMapVars();
		}

		farmingDetails.shouldRun = rShouldBionicRaid;
		farmingDetails.mapName = mapName;
		farmingDetails.repeat = !repeat
		farmingDetails.raidingZone = raidzonesBW;
		farmingDetails.status = status;
	}
	return farmingDetails;
}

function runBionicRaiding(bionicPool) {
	if (!bionicPool) return false;

	if (!game.global.preMapsActive && !game.global.mapsActive) {
		mapsClicked(true);
		if (!game.global.preMapsActive) {
			mapsClicked(true);
		}
	}

	const raidingZone = challengeActive('Experience') && game.global.world > 600 ? getPageSetting('experienceEndBW') : rMapSettings.raidingZone
	if (game.global.preMapsActive) {
		selectMap(findLastBionicWithItems(bionicPool).id);
	}
	if ((findLastBionicWithItems(bionicPool).level >= raidingZone
		|| findLastBionicWithItems(bionicPool).level < raidingZone)
		&& game.global.preMapsActive) {
		runMap();
	}
}

//Experience Farm
function Experience() {

	let mapName = 'Experience'
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Experience') || !getPageSetting('experience')) return farmingDetails;

	var shouldExperience = false;
	const wonderStartZone = getPageSetting('experienceStartZone') >= 300 ? getPageSetting('experienceStartZone') : Infinity;
	const hyperspeed2 = game.talents.liquification3.purchased ? 75 : game.talents.hyperspeed2.purchased ? 50 : 0;
	const special = (Math.floor(game.global.highestLevelCleared + 1) * (hyperspeed2 / 100) >= game.global.world ? "0" : "fa");
	const mapLevel = 0;

	if (game.global.world >= wonderStartZone && game.global.world >= game.challenges.Experience.nextWonder) {
		shouldExperience = true;
		var status = 'Experience: Farming Wonders';
	}
	else {
		shouldExperience = game.global.world > 600 && game.global.world >= getPageSetting('experienceEndZone');
		if (shouldExperience) mapName = 'BionicRaiding';
		var status = 'Experience: Ending Challenge';
	}

	var repeat = game.global.world < game.challenges.Experience.nextWonder;

	if (shouldExperience) farmingDetails.shouldRun = shouldExperience;
	farmingDetails.mapName = mapName;
	farmingDetails.mapLevel = mapLevel;
	farmingDetails.autoLevel = true;
	farmingDetails.special = special;
	farmingDetails.repeat = !repeat;
	farmingDetails.status = status;

	return farmingDetails;
}

//Wither
function Wither() {

	var shouldFarm = false;
	var mapAutoLevel = Infinity;

	const mapName = 'Wither Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Wither') || !getPageSetting('rWither')) return farmingDetails;

	var jobRatio = '0,0,1,0';
	var special = 'lmc';

	if (game.global.mapRunCounter === 0 && game.global.mapsActive && mapRepeats !== 0) {
		game.global.mapRunCounter = mapRepeats;
		mapRepeats = 0;
	}

	var rAutoLevel_Repeat = rAutoLevel;
	mapAutoLevel = callAutoMapLevel(currentMap, rAutoLevel, special, -1, null, false);
	if (mapAutoLevel !== Infinity) {
		if (rAutoLevel_Repeat !== Infinity && mapAutoLevel !== rAutoLevel_Repeat) mapRepeats = game.global.mapRunCounter + 1;
		var mapLevel = mapAutoLevel;
	}

	//Gamma burst info
	var gammaMaxStacks = gammaBurstPct === 1 || game.global.mapsActive ? Infinity : autoBattle.oneTimers.Burstier.owned ? 4 : 5
	var gammaToTrigger = gammaMaxStacks - game.heirlooms.Shield.gammaBurst.stacks;
	var gammaDmg = gammaBurstPct;
	var canGamma = gammaToTrigger <= 1 ? true : false;

	var cell = game.global.lastClearedCell + 2;
	var name = game.global.gridArray[cell].name;
	var damageGoal = challengeActive('Wither') ? 4 : 2;

	var equalityAmt = equalityQuery(name, game.global.world, cell, 'world', 1, 'gamma');
	var ourDmg = calcOurDmg('min', equalityAmt, false, 'world', 'never', 0, false);
	var enemyHealth = calcEnemyHealthCore('world', game.global.world, cell, name, calcMutationHealth(game.global.world));

	//Checking if we can clear current zone.
	if (((ourDmg * (canGamma ? gammaDmg : 1)) * damageGoal) < enemyHealth) {
		shouldFarm = true;
	}

	//Checking if we can clear next zone.
	if (cell === 100) {
		equalityAmt = equalityQuery(name, game.global.world + 1, 100, 'world', 1, 'gamma');
		ourDmg = calcOurDmg('min', equalityAmt, false, 'world', 'never', 0, false);
		enemyHealth = calcEnemyHealthCore('world', game.global.world + 1, 100, 'Improbability', calcMutationHealth(game.global.world + 1));
		//Checking if we can clear current zone.
		if ((ourDmg * damageGoal) < enemyHealth) {
			shouldFarm = true;
		}
	}

	var damageTarget = enemyHealth / damageGoal;

	var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== mapLevel || (getCurrentMapObject().bonus !== special && (getCurrentMapObject().bonus !== undefined && special !== '0')));
	var status = 'Wither Farm: Curr&nbsp;Dmg:&nbsp;' + prettify(ourDmg) + " Goal&nbsp;Dmg:&nbsp;" + prettify(damageTarget);

	farmingDetails.shouldRun = shouldFarm;
	farmingDetails.mapName = mapName;
	farmingDetails.mapLevel = mapLevel;
	farmingDetails.autoLevel = true;
	farmingDetails.special = special;
	farmingDetails.jobRatio = jobRatio;
	farmingDetails.damageTarget = damageTarget;
	farmingDetails.repeat = !repeat;
	farmingDetails.status = status;

	if (currentMap === mapName && !farmingDetails.shouldRun) {
		mappingDetails(mapName, mapLevel, special);
		resetMapVars();
	}

	return farmingDetails;
}

//Quagmire
function Quagmire() {

	var rShouldQuagFarm = false;

	const mapName = 'Quagmire Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Quagmire') || !autoTrimpSettings.rQuagDefaultSettings.value.active) return farmingDetails;

	const rQFBaseSettings = autoTrimpSettings.rQuagSettings.value;
	const totalPortals = getTotalPortals();
	var rQFIndex;
	//Checking to see if any lines are to be run.
	for (var y = 0; y < rQFBaseSettings.length; y++) {
		const currSetting = rQFBaseSettings[y];
		if (!currSetting.active || currSetting.done === totalPortals + "_" + game.global.world || game.global.world !== currSetting.world || game.global.lastClearedCell + 2 < currSetting.cell) {
			continue;
		}

		if (game.global.world === currSetting.world) {
			rQFIndex = y;
			break;
		}
	}

	if (rQFIndex >= 0) {

		var rQuagFarmSettings = rQFBaseSettings[rQFIndex];
		var rQFJobRatio = rQuagFarmSettings.jobratio
		stacksum = 0;

		for (var i = 0; i < (rQFIndex + 1); i++) {
			if (!autoTrimpSettings.rQuagSettings.value[i].active) continue;
			stacksum += parseInt(autoTrimpSettings.rQuagSettings.value[i].bogs);
		}

		totalstacks = 100 - stacksum;

		if ((game.challenges.Quagmire.motivatedStacks > totalstacks))
			rShouldQuagFarm = true;

		if (currentMap === mapName && !rShouldQuagFarm) {
			mappingDetails(mapName);
			resetMapVars(rQuagFarmSettings);
		}

		var repeat = game.global.mapsActive && (getCurrentMapObject().name !== 'The Black Bog' || (game.challenges.Quagmire.motivatedStacks - totalstacks) === 1);
		var status = 'Black Bogs: ' + (game.challenges.Quagmire.motivatedStacks - totalstacks) + " remaining";

		farmingDetails.shouldRun = rShouldQuagFarm;
		farmingDetails.mapName = mapName;
		farmingDetails.jobRatio = rQFJobRatio;
		farmingDetails.bogs = totalstacks;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;
	}

	return farmingDetails;
}

function currQuest() {
	if (!challengeActive('Quest') || game.global.world < game.challenges.Quest.getQuestStartZone() || !getPageSetting('rQuest'))
		return 0;
	var questnotcomplete = game.challenges.Quest.getQuestProgress() != "Quest Complete!";
	if (game.challenges.Quest.getQuestProgress() == "Failed!") return 0;
	//Resource multipliers
	else if (game.challenges.Quest.getQuestDescription().includes("food") && questnotcomplete) return 1;
	else if (game.challenges.Quest.getQuestDescription().includes("wood") && questnotcomplete) return 2;
	else if (game.challenges.Quest.getQuestDescription().includes("metal") && questnotcomplete) return 3;
	else if (game.challenges.Quest.getQuestDescription().includes("gems") && questnotcomplete) return 4;
	else if (game.challenges.Quest.getQuestDescription().includes("science") && questnotcomplete) return 5;
	//Everything else
	else if (game.challenges.Quest.getQuestDescription() == "Complete 5 Maps at Zone level" && questnotcomplete) return 6;
	else if (game.challenges.Quest.getQuestDescription() == "One-shot 5 world enemies" && questnotcomplete) return 7;
	else if (game.challenges.Quest.getQuestDescription() == "Don't let your shield break before Cell 100" && questnotcomplete) return 8;
	else if (game.challenges.Quest.getQuestDescription() == "Don't run a map before Cell 100") return 9;
	else if (game.challenges.Quest.getQuestDescription() == "Buy a Smithy" && questnotcomplete) return 10;
	else return 0;
}

//Quest
function Quest() {

	var rShouldQuest = 0;

	const mapName = 'Quest';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Quest') || !getPageSetting('rQuest') || game.global.world < game.challenges.Quest.getQuestStartZone()) return farmingDetails;

	rShouldQuest = currQuest() == 1 ? 1 :
		currQuest() == 2 ? 2 :
			currQuest() == 3 ? 3 :
				currQuest() == 4 ? 4 :
					currQuest() == 5 ? 5 :
						currQuest() == 6 ? 6 :
							currQuest() == 7 && (calcOurDmg('min', 0, false, 'world', 'never') < game.global.gridArray[50].maxHealth) && !(game.portal.Tenacity.getMult() === Math.pow(1.4000000000000001, getPerkLevel("Tenacity") + getPerkLevel("Masterfulness"))) ? 7 :
								currQuest() == 8 ? 8 :
									currQuest() == 9 ? 9 :
										0;

	if (rShouldQuest) {
		var rQuestArray = rShouldQuest == 1 || rShouldQuest == 4 ? ['lsc', '1'] : rShouldQuest == 2 ? ['lwc', '0,1'] : rShouldQuest == 3 || rShouldQuest == 7 ? ['lmc', '0,0,1'] : rShouldQuest === 5 ? ['fa', '0,0,0,1'] : ['fa', '0,0,0,0']
		var rQuestSpecial = rQuestArray[0]
		var rQuestJobRatio = rQuestArray[1];
		var rQuestMax = rShouldQuest === 6 ? 10 : null;
		var rQuestMin = rShouldQuest === 6 ? 0 : null;

		if (game.global.mapRunCounter === 0 && game.global.mapsActive && rMapRepeats !== 0) {
			game.global.mapRunCounter = rMapRepeats;
			rMapRepeats = 0;
		}
		var rAutoLevel_Repeat = rAutoLevel;
		mapAutoLevel = callAutoMapLevel(currentMap, rAutoLevel, rQuestSpecial, rQuestMax, rQuestMin, false);
		if (mapAutoLevel !== Infinity) {
			if (rAutoLevel_Repeat !== Infinity && mapAutoLevel !== rAutoLevel_Repeat) rMapRepeats = game.global.mapRunCounter + 1;
			rQuestMapLevel = mapAutoLevel;
		}

		var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== rQuestMapLevel || (getCurrentMapObject().bonus !== rQuestSpecial && (getCurrentMapObject().bonus !== undefined && rQuestSpecial !== '0')) || (rShouldQuest == 6 && (game.global.mapBonus >= 4 || getCurrentMapObject().level - game.global.world < 0)));

		var status = 'Questing: ' + game.challenges.Quest.getQuestProgress();

		farmingDetails.shouldRun = rShouldQuest;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = rQuestMapLevel;
		farmingDetails.autoLevel = true;
		farmingDetails.special = rQuestSpecial;
		farmingDetails.jobRatio = rQuestJobRatio;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;

	}
	if (currentMap === mapName && !farmingDetails.shouldRun) {
		mappingDetails(mapName);
		resetMapVars();
		if (game.global.mapsActive) mapsClicked(true);
		if (game.global.preMapsActive && game.global.currentMapId !== '') recycleMap();
		rMapRepeats = 0;
	}

	return farmingDetails;
}

//Mayhem
function Mayhem() {

	const mapName = 'Mayhem Destacking';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Mayhem') || !getPageSetting('rMayhem')) return farmingDetails;

	var rShouldMayhem = false;
	var mapAutoLevel = Infinity;

	var destackHits = getPageSetting('rMayhemDestack') > 0 ? getPageSetting('rMayhemDestack') : Infinity;
	var destackZone = getPageSetting('rMayhemZone') > 0 ? getPageSetting('rMayhemZone') : Infinity;
	var rMayhemMapLevel = 0;
	var rMayhemMapIncrease = getPageSetting('rMayhemMapIncrease') > 0 ? getPageSetting('rMayhemMapIncrease') : 0;
	var hyperspeed2 = game.talents.liquification3.purchased ? 75 : game.talents.hyperspeed2.purchased ? 50 : 0;
	var rMayhemSpecial = (Math.floor(game.global.highestRadonLevelCleared + 1) * (hyperspeed2 / 100) >= game.global.world ? "lmc" : "fa");
	if (game.challenges.Mayhem.stacks > 0 && (HDRatio > destackHits || game.global.world >= destackZone))
		rShouldMayhem = true;

	if (game.global.mapRunCounter === 0 && game.global.mapsActive && mapRepeats !== 0) {
		game.global.mapRunCounter = mapRepeats;
		mapRepeats = 0;
	}
	var rAutoLevel_Repeat = rAutoLevel;
	mapAutoLevel = callAutoMapLevel(currentMap, rAutoLevel, rMayhemSpecial, 10, 0, false);
	if (mapAutoLevel !== Infinity) {
		if (rAutoLevel_Repeat !== Infinity && mapAutoLevel !== rAutoLevel_Repeat) mapRepeats = game.global.mapRunCounter + 1;
		rMayhemMapLevel = (mapAutoLevel + rMayhemMapIncrease > 10 ? 10 : mapAutoLevel + rMayhemMapIncrease);
	}

	var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== rMayhemMapLevel || (getCurrentMapObject().bonus !== rMayhemSpecial && (getCurrentMapObject().bonus !== undefined && rMayhemSpecial !== '0')) || game.challenges.Mayhem.stacks <= rMayhemMapLevel + 1);
	var status = 'Mayhem Destacking: ' + game.challenges.Mayhem.stacks + " remaining";

	farmingDetails.shouldRun = rShouldMayhem;
	farmingDetails.mapName = mapName;
	farmingDetails.mapLevel = rMayhemMapLevel;
	farmingDetails.autoLevel = true;
	farmingDetails.special = rMayhemSpecial;
	farmingDetails.repeat = !repeat;
	farmingDetails.status = status;

	if (currentMap === mapName && !farmingDetails.shouldRun) {
		mappingDetails(mapName, rMayhemMapLevel, rMayhemSpecial);
		resetMapVars();
	}
	return farmingDetails;
}

//Insanity Farm
function Insanity() {

	const mapName = 'Insanity Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};
	if (!challengeActive('Insanity') || !autoTrimpSettings.rInsanityDefaultSettings.value.active) return farmingDetails;

	var rShouldInsanityFarm = false;
	var mapAutoLevel = Infinity;
	const totalPortals = getTotalPortals();
	const rIFBaseSettings = autoTrimpSettings.rInsanitySettings.value;

	var rIFIndex;
	//Checking to see if any lines are to be run.
	for (var y = 0; y < rIFBaseSettings.length; y++) {
		const currSetting = rIFBaseSettings[y];
		if (!currSetting.active || currSetting.done === totalPortals + "_" + game.global.world || game.global.world !== currSetting.world || game.global.lastClearedCell + 2 < currSetting.cell) {
			continue;
		}

		if (game.global.world === currSetting.world) {
			rIFIndex = y;
			break;
		}
	}

	if (rIFIndex >= 0) {

		var rIFSettings = rIFBaseSettings[rIFIndex];
		var rIFMapLevel = rIFSettings.level;
		var rIFSpecial = rIFSettings.special;
		var rIFStacks = rIFSettings.insanity;
		var rIFJobRatio = rIFSettings.jobratio;

		if (rIFSettings.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && mapRepeats !== 0) {
				game.global.mapRunCounter = mapRepeats;
				mapRepeats = 0;
			}
			var rAutoLevel_Repeat = rAutoLevel;
			mapAutoLevel = callAutoMapLevel(currentMap, rAutoLevel, rIFSpecial, null, null, false);
			if (mapAutoLevel !== Infinity) {
				if (rAutoLevel_Repeat !== Infinity && mapAutoLevel !== rAutoLevel_Repeat) mapRepeats = game.global.mapRunCounter + 1;
				rIFMapLevel = mapAutoLevel;
			}
		}

		if (rIFStacks > game.challenges.Insanity.maxInsanity)
			rIFStacks = game.challenges.Insanity.maxInsanity;
		if (rIFStacks > game.challenges.Insanity.insanity || (rIFSettings.destack && game.challenges.Insanity.insanity > rIFStacks))
			rShouldInsanityFarm = true;

		var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== rIFMapLevel || (getCurrentMapObject().bonus !== rIFSpecial && (getCurrentMapObject().bonus !== undefined && rIFSpecial !== '0')) || rIFStacks <= game.challenges.Insanity.insanity);
		var status = 'Insanity Farming: ' + game.challenges.Insanity.insanity + "/" + rIFStacks;

		farmingDetails.shouldRun = rShouldInsanityFarm;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = rIFMapLevel;
		farmingDetails.autoLevel = rIFSettings.autoLevel;
		farmingDetails.special = rIFSpecial;
		farmingDetails.jobRatio = rIFJobRatio;
		farmingDetails.insanity = rIFStacks;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;

		if (currentMap === mapName && !farmingDetails.shouldRun) {
			mappingDetails(mapName, rIFMapLevel, rIFSpecial, rIFStacks);
			resetMapVars(rIFSettings.done);
		}

	}

	return farmingDetails;
}

//Pandemonium
function PandemoniumDestack() {

	var rShouldPandemoniumDestack = false;
	var mapAutoLevel = Infinity;

	const mapName = 'Pandemonium Destacking';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Pandemonium') || !getPageSetting('RPandemoniumOn') || game.global.world < getPageSetting('RPandemoniumZone')) return farmingDetails;

	var rPandemoniumMapLevel = 1;
	var hyperspeed2 = game.talents.liquification3.purchased ? 75 : game.talents.hyperspeed2.purchased ? 50 : 0;
	var rPandemoniumSpecial = (Math.floor(game.global.highestRadonLevelCleared + 1) * (hyperspeed2 / 100) >= game.global.world ? "lmc" : game.challenges.Pandemonium.pandemonium > 7 ? "fa" : "lmc");
	var rPandemoniumJobRatio = '0.001,0.001,1,0';


	if (game.global.mapRunCounter === 0 && game.global.mapsActive && mapRepeats !== 0) {
		game.global.mapRunCounter = mapRepeats;
		mapRepeats = 0;
	}
	var rAutoLevel_Repeat = rAutoLevel;
	mapAutoLevel = callAutoMapLevel(currentMap, rAutoLevel, rPandemoniumSpecial, 10, 1, false);
	if (mapAutoLevel !== Infinity) {
		if (rAutoLevel_Repeat !== Infinity && rAutoLevel_Repeat !== mapAutoLevel) mapRepeats = game.global.mapRunCounter + 1;
		rPandemoniumMapLevel = mapAutoLevel;
	}

	if (game.challenges.Pandemonium.pandemonium !== 0) {
		rShouldPandemoniumDestack = true;
	}

	var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== rPandemoniumMapLevel || (getCurrentMapObject().bonus !== rPandemoniumSpecial && (getCurrentMapObject().bonus !== undefined && rPandemoniumSpecial !== '0')) || ((game.challenges.Pandemonium.pandemonium - rPandemoniumMapLevel) < rPandemoniumMapLevel));
	var status = 'Pandemonium Destacking: ' + game.challenges.Pandemonium.pandemonium + " remaining";

	farmingDetails.shouldRun = rShouldPandemoniumDestack;
	farmingDetails.mapName = mapName;
	farmingDetails.mapLevel = rPandemoniumMapLevel;
	farmingDetails.autoLevel = true;
	farmingDetails.special = rPandemoniumSpecial;
	farmingDetails.jobRatio = rPandemoniumJobRatio;
	farmingDetails.pandemonium = game.challenges.Pandemonium.pandemonium;
	farmingDetails.repeat = !repeat;
	farmingDetails.status = status;

	if (currentMap === mapName && !rShouldPandemoniumDestack) {
		mappingDetails(mapName, rPandemoniumMapLevel, rPandemoniumSpecial);
		resetMapVars();
	}

	return farmingDetails;
}

//Pandemonium Equip Farming
function PandemoniumFarm() {

	const mapName = 'Pandemonium Farming';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Pandemonium') || !getPageSetting('RPandemoniumOn') || getPageSetting('RPandemoniumAutoEquip') < 2 || game.global.world === 150 || game.global.lastClearedCell + 2 < 91 || game.challenges.Pandemonium.pandemonium > 0) return farmingDetails;

	var rShouldPandemoniumFarm = false;

	var rPandemoniumJobRatio = '1,1,100,0';
	var equipCost = CheapestEquipmentCost();
	var nextEquipmentCost = equipCost[1];

	var rPandemoniumMapLevel = getPageSetting('PandemoniumFarmLevel');
	var rPandemonium_LMC = scaleToCurrentMapLocal(simpleSecondsLocal("metal", 20, true, rPandemoniumJobRatio), false, true, getPageSetting('PandemoniumFarmLevel'));
	var rPandemonium_HC = rPandemonium_LMC * 2;
	var rPandemoniumSpecial = nextEquipmentCost > rPandemonium_LMC ? 'hc' : 'lmc'

	var rPandemonium_Resource_Gain = rPandemoniumSpecial === 'hc' ? rPandemonium_HC : rPandemonium_LMC;

	//Checking if an equipment level costs less than a cache or a prestige level costs less than a jestimp and if so starts farming.
	if (getPageSetting('RPandemoniumAutoEquip') > 2 && game.global.world >= getPageSetting('RPandemoniumAEZone') && nextEquipmentCost < rPandemonium_Resource_Gain)
		rShouldPandemoniumFarm = true;

	var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== rPandemoniumMapLevel || getCurrentMapObject().bonus != rPandemoniumSpecial || nextEquipmentCost >= rPandemonium_Resource_Gain);
	var status = 'Pandemonium Farming Equips below ' + prettify(rPandemonium_Resource_Gain);

	if (rShouldPandemoniumFarm) {
		farmingDetails.shouldRun = rShouldPandemoniumFarm;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = rPandemoniumMapLevel;
		farmingDetails.autoLevel = true;
		farmingDetails.special = rPandemoniumSpecial;
		farmingDetails.jobRatio = rPandemoniumJobRatio;
		farmingDetails.gather = 'metal';
		farmingDetails.pandemonium = game.challenges.Pandemonium.pandemonium;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;
	}

	if (currentMap === mapName && !rShouldPandemoniumFarm) {
		mappingDetails(mapName, rPandemoniumMapLevel, rPandemoniumSpecial);
		resetMapVars();
	}

	return farmingDetails;
}

//Alchemy
function Alchemy() {

	var rShouldAlchFarm = false;
	var mapAutoLevel = Infinity;

	const mapName = 'Alchemy Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};


	if (!challengeActive('Alchemy') || !autoTrimpSettings.rAlchDefaultSettings.value.active) return farmingDetails;

	const totalPortals = getTotalPortals();
	const rAFBaseSettings = autoTrimpSettings.rAlchSettings.value;
	var rAFIndex;

	//Checking to see if any lines are to be run.
	for (var y = 0; y < rAFBaseSettings.length; y++) {
		const currSetting = rAFBaseSettings[y];
		if (!currSetting.active || currSetting.done === totalPortals + "_" + game.global.world || game.global.world !== currSetting.world || game.global.lastClearedCell + 2 < currSetting.cell) {
			continue;
		}

		if (game.global.world === currSetting.world) {
			rAFIndex = y;
			break;
		}
	}

	if (rAFIndex >= 0) {
		var rAFSettings = rAFBaseSettings[rAFIndex];
		var rAFMapLevel = rAFSettings.level;
		var rAFSpecial = rAFSettings.special;
		var rAFJobRatio = rAFSettings.jobratio;
		var rAFPotions = rAFSettings.potion;

		if (rAFSettings.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && mapRepeats !== 0) {
				game.global.mapRunCounter = mapRepeats;
				mapRepeats = 0;
			}
			var rAutoLevel_Repeat = rAutoLevel;
			mapAutoLevel = callAutoMapLevel(currentMap, rAutoLevel, rAFSpecial, 10, 1, false);
			if (mapAutoLevel !== Infinity) {
				if (rAutoLevel_Repeat !== Infinity && mapAutoLevel !== rAutoLevel_Repeat) mapRepeats = game.global.mapRunCounter + 1;
				rAFMapLevel = mapAutoLevel;
			}
		}

		rMFMapLevel = mapAutoLevel;
		if (rAFSpecial.includes('l') && rAFSpecial.length === 3 && PerfectMapCost(rAFMapLevel, rAFSpecial) >= game.resources.fragments.owned) rAFSpecial = rAFSpecial.charAt(0) + "sc";

		if (rAFPotions != undefined) {
			//Working out which potion the input corresponds to.
			potion = rAFPotions.charAt('0') == 'h' ? 0 :
				rAFPotions.charAt('0') == 'g' ? 1 :
					rAFPotions.charAt('0') == 'f' ? 2 :
						rAFPotions.charAt('0') == 'v' ? 3 :
							rAFPotions.charAt('0') == 's' ? 4 :
								undefined;

			//Alchemy biome selection, will select Farmlands if it's unlocked and appropriate otherwise it'll use the default map type for that herb.
			rAFBiome = alchObj.potionNames[potion] == alchObj.potionNames[0] ? game.global.farmlandsUnlocked && getFarmlandsResType() == "Metal" ? "Farmlands" : "Mountain" :
				alchObj.potionNames[potion] == alchObj.potionNames[1] ? game.global.farmlandsUnlocked && getFarmlandsResType() == "Wood" ? "Farmlands" : "Forest" :
					alchObj.potionNames[potion] == alchObj.potionNames[2] ? game.global.farmlandsUnlocked && getFarmlandsResType() == "Food" ? "Farmlands" : "Sea" :
						alchObj.potionNames[potion] == alchObj.potionNames[3] ? game.global.farmlandsUnlocked && getFarmlandsResType() == "Gems" ? "Farmlands" : "Depths" :
							alchObj.potionNames[potion] == alchObj.potionNames[4] ? game.global.farmlandsUnlocked && getFarmlandsResType() == "Any" ? "Farmlands" : game.global.decayDone ? "Plentiful" : "Random" :
								game.global.farmlandsUnlocked && getFarmlandsResType() == "Any" ? "Farmlands" : game.global.decayDone ? "Plentiful" : "Random";

			//Doing calcs to identify the total cost of all the Brews/Potions that are being farmed
			//Initialising vars
			var alchmult = rAFBiome == "Farmlands" ? 1.5 : 1;
			var potioncost = 0;
			potioncosttotal = 0;
			var potionscurrent = alchObj.potionsOwned[potion];
			//Identifying current herbs + ones that we'll get from the map we should run
			herbtotal = game.herbs[alchObj.potions[potion].cost[0][0]].cowned + (alchObj.getDropRate(game.global.world + rAFMapLevel) * alchmult);
			//Looping through each potion level and working out their cost to calc total cost
			for (x = potionscurrent; x < (rAFPotions.toString().replace(/[^\d,:-]/g, '')); x++) {
				var potioncost = Math.pow(alchObj.potions[potion].cost[0][2], x) * alchObj.potions[potion].cost[0][1];
				//Checking if the potion being farmed is a Potion and if so factors in compounding cost scaling from other potions owned
				if (!alchObj.potions[potion].enemyMult) {
					var potionsowned = 0;
					//Calculating total level of potions that aren't being farmed
					for (var y = 0; y < alchObj.potionsOwned.length; y++) {
						if (alchObj.potions[y].challenge != (challengeActive('Alchemy'))) continue;
						if (y != alchObj.potionNames.indexOf(alchObj.potionNames[potion]) && !alchObj.potions[y].enemyMult) potionsowned += alchObj.potionsOwned[y];
					}
					potioncost *= Math.pow(alchObj.allPotionGrowth, potionsowned);
				}
				//Summing cost of potion levels
				potioncosttotal += potioncost;
			}
			if (potion == undefined)
				debug('You have an incorrect value in AF: Potions, each input needs to start with h, g, f, v, or s.');
			else {
				if (rAFPotions.toString().replace(/[^\d:-]/g, '') > potionscurrent) {
					if (alchObj.canAffordPotion(alchObj.potionNames[potion])) {
						for (z = potionscurrent; z < rAFPotions.toString().replace(/[^\d:-]/g, ''); z++) {
							if (potion === 1) {
								if (game.herbs[alchObj.potions[potion].cost[0][0]].cowned > potioncosttotal)
									for (var x = potionscurrent; x < rAFPotions.toString().replace(/[^\d,:-]/g, ''); x++) {
										alchObj.craftPotion(alchObj.potionNames[potion]);
									}
							}
							else alchObj.craftPotion(alchObj.potionNames[potion]);
						}
					}
				}
				if (rAFPotions.toString().replace(/[^\d,:-]/g, '') > alchObj.potionsOwned[potion])
					rShouldAlchFarm = true;
			}

			var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== rAFMapLevel || (getCurrentMapObject().bonus !== rAFSpecial && (getCurrentMapObject().bonus !== undefined && rAFSpecial !== '0')) || herbtotal >= potioncosttotal);
			var status = 'Alchemy Farming ' + alchObj.potionNames[potion] + " (" + alchObj.potionsOwned[potion] + "/" + rAFPotions.toString().replace(/[^\d,:-]/g, '') + ")";

			farmingDetails.shouldRun = rShouldAlchFarm;
			farmingDetails.mapName = mapName;
			farmingDetails.mapLevel = rAFMapLevel;
			farmingDetails.autoLevel = rAFSettings.autoLevel;
			farmingDetails.special = rAFSpecial;
			farmingDetails.jobRatio = rAFJobRatio;
			farmingDetails.biome = rAFBiome;
			farmingDetails.herbtotal = herbtotal;
			farmingDetails.potionTotalCost = potioncosttotal;
			farmingDetails.potionName = alchObj.potionNames[potion];
			farmingDetails.potionOwned = alchObj.potionsOwned[potion];
			farmingDetails.potionGoal = rAFPotions.toString().replace(/[^\d,:-]/g, '');
			farmingDetails.repeat = !repeat;
			farmingDetails.status = status;

			if (currentMap === mapName && !farmingDetails.shouldRun) {
				mappingDetails(mapName, rAFMapLevel, rAFSpecial, alchObj.potionsOwned[potion], rAFPotions.toString().replace(/[^\d,:-]/g, ''), alchObj.potionNames[potion]);
				resetMapVars(rAFSettings);
			}
		}

	}


	if ((typeof (autoTrimpSettings.rAlchDefaultSettings.value.voidPurchase) === 'undefined' ? true : autoTrimpSettings.rAlchDefaultSettings.value.voidPurchase) && currentMap === 'Void Map' && game.global.mapsActive) {
		if (getCurrentMapObject().location == "Void" && (alchObj.canAffordPotion('Potion of the Void') || alchObj.canAffordPotion('Potion of Strength'))) {
			alchObj.craftPotion('Potion of the Void');
			alchObj.craftPotion('Potion of Strength');
		}
	}

	return farmingDetails;
}

//Glass
function Glass() {

	var shouldFarm = false;
	var mapAutoLevel = Infinity;

	const mapName = "Glass Destacking";
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Glass') || !getPageSetting('rGlass')) return farmingDetails;

	var jobRatio = '0,0,1,0';
	var special = 'lmc';
	var glassStacks = getPageSetting('rGlassStacks');
	if (glassStacks <= 0) glassStacks = Infinity;

	if (game.global.mapRunCounter === 0 && game.global.mapsActive && mapRepeats !== 0) {
		game.global.mapRunCounter = mapRepeats;
		mapRepeats = 0;
	}

	var rAutoLevel_Repeat = rAutoLevel;
	mapAutoLevel = callAutoMapLevel(currentMap, rAutoLevel, special, 10, null, false);
	if (mapAutoLevel !== Infinity) {
		if (rAutoLevel_Repeat !== Infinity && mapAutoLevel !== rAutoLevel_Repeat) mapRepeats = game.global.mapRunCounter + 1;
		var mapLevel = mapAutoLevel;
	}

	//Gamma burst info
	var gammaMaxStacks = gammaBurstPct === 1 || game.global.mapsActive ? Infinity : autoBattle.oneTimers.Burstier.owned ? 4 : 5
	var gammaToTrigger = gammaMaxStacks - game.heirlooms.Shield.gammaBurst.stacks;
	var gammaDmg = gammaBurstPct;
	var canGamma = gammaToTrigger <= 1 ? true : false;
	var damageGoal = 2;

	var equalityAmt = equalityQuery('Snimp', game.global.world, 20, 'map', 0.75, 'gamma');
	var ourDmg = calcOurDmg('min', equalityAmt, false, 'map', 'maybe', mapLevel, false);
	var enemyHealth = calcEnemyHealthCore('map', game.global.world, 20, 'Snimp') * .75;

	//Destacking
	if ((ourDmg * damageGoal) > enemyHealth && (game.challenges.Glass.shards >= glassStacks || (game.global.mapsActive && game.challenges.Glass.shards > 2))) {
		special = 'fa';
		shouldFarm = true;
		mapLevel = 0;
	}
	//Checking if we can clear next zone or if we need to farm for our optimal level.
	else if (game.global.lastClearedCell + 2 === 100 || (game.challenges.Glass.shards >= glassStacks)) {
		equalityAmt = equalityQuery('Snimp', game.global.world + 1, 20, 'map', 0.75, 'gamma');
		ourDmg = calcOurDmg('min', equalityAmt, false, 'map', 'maybe', mapLevel, false);
		enemyHealth = calcEnemyHealthCore('map', game.global.world + 1, 20, 'Snimp') * .75;
		special = 'lmc';
		//Checking if we can clear current zone.
		if ((ourDmg * damageGoal) < enemyHealth) {
			shouldFarm = true;
		}
	}

	var damageTarget = enemyHealth / damageGoal;

	var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== mapLevel || (getCurrentMapObject().bonus !== special && (getCurrentMapObject().bonus !== undefined && special !== '0')));
	var status = game.global.challengeActive + ' Farm: Curr&nbsp;Dmg:&nbsp;' + prettify(ourDmg) + " Goal&nbsp;Dmg:&nbsp;" + prettify(damageTarget);

	farmingDetails.shouldRun = shouldFarm;
	farmingDetails.mapName = mapName;
	farmingDetails.mapLevel = mapLevel;
	farmingDetails.autoLevel = true;
	farmingDetails.special = special;
	farmingDetails.jobRatio = jobRatio;
	farmingDetails.damageTarget = damageTarget;
	farmingDetails.repeat = !repeat;
	farmingDetails.status = status;

	if (currentMap === mapName && !farmingDetails.shouldRun) {
		mappingDetails(mapName, mapLevel, special);
		resetMapVars();
	}

	return farmingDetails;
}

MODULES.mapFunctions.rHFBuyPackrat = false;
rHFBuyPackrat = false;

//Hypothermia
function Hypothermia() {

	var rShouldHypoFarm = false;
	var mapAutoLevel = Infinity;

	const mapName = 'Hypothermia Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if ((!autoTrimpSettings.rHypoDefaultSettings.value.active ||
		(!challengeActive('Hypothermia') && (!autoTrimpSettings.rHypoDefaultSettings.value.packrat || !rHFBuyPackrat)))) return farmingDetails;

	if (autoTrimpSettings.rHypoDefaultSettings.value.packrat) {
		if (!rHFBuyPackrat && challengeActive('Hypothermia'))
			rHFBuyPackrat = true;
		if (rHFBuyPackrat && challengeActive('')) {
			viewPortalUpgrades();
			numTab(6, true);
			buyPortalUpgrade('Packrat');
			rHFBuyPackrat = null;
			activateClicked();
		}
	}
	rHFBonfireCostTotal = 0;

	if (!challengeActive('Hypothermia')) return farmingDetails;
	const rHFBaseSettings = autoTrimpSettings.rHypoSettings.value;
	var rHFIndex;

	//Checking to see if any lines are to be run.
	for (var y = 0; y < rHFBaseSettings.length; y++) {
		const currSetting = rHFBaseSettings[y];
		if (!currSetting.active || game.global.world !== currSetting.world || game.global.lastClearedCell + 2 < currSetting.cell) {
			continue;
		}

		if (game.global.world === currSetting.world) {
			rHFIndex = y;
			break;
		}
	}

	if (rHFIndex >= 0) {

		var rHFSettings = rHFBaseSettings[rHFIndex];
		var rHFBonfire = rHFSettings.bonfire;
		var rHFSpecial = "lwc";
		var rHFMapLevel = rHFSettings.level;
		var rHFJobRatio = rHFSettings.jobratio;
		var rHFBonfiresBuilt = game.challenges.Hypothermia.totalBonfires;
		var rHFShedCost = 0;
		//Looping through each bonfire level and working out their cost to calc total cost
		for (x = rHFBonfiresBuilt; x < rHFBonfire; x++) {
			rHFBonfireCost = 1e10 * Math.pow(100, x);
			rHFBonfireCostTotal += rHFBonfireCost;
		}
		if (rHFBonfireCostTotal > (game.resources.wood.max * (1 + (game.portal.Packrat.modifier * game.portal.Packrat.radLevel))))
			rHFShedCost += game.buildings.Shed.cost.wood();
		rHFBonfireCostTotal += rHFShedCost;

		if (rHFSettings.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && mapRepeats !== 0) {
				game.global.mapRunCounter = mapRepeats;
				mapRepeats = 0;
			}

			var rAutoLevel_Repeat = rAutoLevel;
			mapAutoLevel = callAutoMapLevel(currentMap, rAutoLevel, rHFSpecial, null, null, false);
			if (mapAutoLevel !== Infinity) {
				if (rAutoLevel_Repeat !== Infinity && mapAutoLevel !== rAutoLevel_Repeat) mapRepeats = game.global.mapRunCounter + 1;
				rHFMapLevel = mapAutoLevel;
			}
		}

		if (rHFBonfireCostTotal > game.resources.wood.owned && rHFBonfire > game.challenges.Hypothermia.totalBonfires) {
			rShouldHypoFarm = true;
		}

		var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== rHFMapLevel || (getCurrentMapObject().bonus !== rHFSpecial && (getCurrentMapObject().bonus !== undefined && rHFSpecial !== '0')) || game.resources.wood.owned > game.challenges.Hypothermia.bonfirePrice || scaleToCurrentMapLocal(simpleSecondsLocal("wood", 20, true, rHFJobRatio), false, true, rHFMapLevel) + game.resources.wood.owned > rHFBonfireCostTotal);
		var status = 'Hypo Farming to ' + prettify(rHFBonfireCostTotal) + ' wood';

		farmingDetails.shouldRun = rShouldHypoFarm;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = rHFMapLevel;
		farmingDetails.autoLevel = rHFSettings.autoLevel;
		farmingDetails.special = rHFSpecial;
		farmingDetails.jobRatio = rHFJobRatio;
		farmingDetails.bonfire = rHFBonfire;
		farmingDetails.woodGoal = rHFBonfireCostTotal;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;

		if (currentMap === mapName && !farmingDetails.shouldRun) {
			mappingDetails(mapName, rHFMapLevel, rHFSpecial, rHFBonfireCostTotal);
			resetMapVars(rHFSettings);
		}
	}

	return farmingDetails;
}

//Smithless
function Smithless() {

	var rShouldSmithless = false;
	var mapAutoLevel = Infinity;

	const mapName = 'Smithless Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Smithless') || !getPageSetting('rSmithless')) return farmingDetails;

	if (game.global.world % 25 === 0 && game.global.lastClearedCell == -1 && game.global.gridArray[0].ubersmith) {

		var rSmithlessJobRatio = '0,0,1,0';
		var rSmithlessSpecial = 'lmc';
		var rSmithlessMax = game.global.mapBonus != 10 ? 10 : null;
		var rSmithlessMin = game.global.mapBonus != 10 ? 0 : null;

		if (game.global.mapRunCounter === 0 && game.global.mapsActive && mapRepeats !== 0) {
			game.global.mapRunCounter = mapRepeats;
			mapRepeats = 0;
		}
		var rAutoLevel_Repeat = rAutoLevel;
		mapAutoLevel = callAutoMapLevel(currentMap, rAutoLevel, rSmithlessSpecial, rSmithlessMax, rSmithlessMin, false);
		if (mapAutoLevel !== Infinity) {
			if (rAutoLevel_Repeat !== Infinity && mapAutoLevel !== rAutoLevel_Repeat) mapRepeats = game.global.mapRunCounter + 1;
			rSmithlessMapLevel = mapAutoLevel;
		}

		var name = game.global.gridArray[0].name
		var gammaDmg = gammaBurstPct;
		var equalityAmt = equalityQuery(name, game.global.world, 1, 'world', 1, 'gamma')
		var ourDmg = calcOurDmg('min', equalityAmt, false, 'world', 'never', 0, false);
		var ourDmgTenacity = ourDmg;

		//Map Bonus
		if (game.global.mapBonus > 0 && game.global.mapBonus !== 10) {
			ourDmgTenacity /= 1 + 0.2 * game.global.mapBonus;
			ourDmgTenacity *= 5;
		}
		//Tenacity
		if (game.portal.Tenacity.radLevel > 0) {
			if (!(game.portal.Tenacity.getMult() === Math.pow(1.4000000000000001, getPerkLevel("Tenacity") + getPerkLevel("Masterfulness")))) {
				ourDmgTenacity /= game.portal.Tenacity.getMult();
				ourDmgTenacity *= Math.pow(1.4000000000000001, getPerkLevel("Tenacity") + getPerkLevel("Masterfulness"));
			}
		}

		ourDmgTenacity *= 2;
		if (Rgetequips((game.global.world + rSmithlessMapLevel), false) > 0) ourDmgTenacity *= 1000;

		var totalDmgTenacity = (ourDmgTenacity * 2 + (ourDmgTenacity * gammaDmg * 2))

		var enemyHealth = calcEnemyHealthCore('world', game.global.world, 1, name);
		enemyHealth *= 3e15;
		const smithyThreshhold = [1, 0.01, 0.000001];
		const smithyThreshholdIndex = [0.000001, 0.01, 1];

		while (smithyThreshhold.length > 0 && totalDmgTenacity < (enemyHealth * smithyThreshhold[0])) {
			smithyThreshhold.shift();
		}

		if (smithyThreshhold.length === 0) return farmingDetails;

		var totalDmg = (ourDmg * 2 + (ourDmg * gammaDmg * 2))
		var damageTarget = (enemyHealth * smithyThreshhold[0]) / totalDmg;

		if (totalDmg < enemyHealth) {
			rShouldSmithless = true;
		}

		var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== rSmithlessMapLevel || (getCurrentMapObject().bonus !== rSmithlessSpecial && (getCurrentMapObject().bonus !== undefined && rSmithlessSpecial !== '0')));
		var status = 'Smithless: Want ' + damageTarget.toFixed(2) + 'x more damage for ' + (smithyThreshholdIndex.indexOf(smithyThreshhold[0]) + 1) + '/3';

		farmingDetails.shouldRun = rShouldSmithless;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = rSmithlessMapLevel;
		farmingDetails.autoLevel = true;
		farmingDetails.special = rSmithlessSpecial;
		farmingDetails.jobRatio = rSmithlessJobRatio;
		farmingDetails.damageTarget = damageTarget;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;

		if (currentMap === mapName && !farmingDetails.shouldRun) {
			mappingDetails(mapName, rSmithlessMapLevel, rSmithlessSpecial, (smithyThreshholdIndex.indexOf(smithyThreshhold[0]) + 1));
			resetMapVars();
		}

	}

	return farmingDetails;
}

MODULES.mapFunctions.desolationContinueRunning = false;

//Desolation
function Desolation() {

	const mapName = 'Desolation Destacking';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (game.global.stringVersion < '5.9.0') return farmingDetails;
	if (!challengeActive('Desolation') || !getPageSetting('rDesolation')) return farmingDetails;

	var rShouldDesolation = false;
	var mapAutoLevel = Infinity;

	var destackHits = getPageSetting('rDesolationDestack') > 0 ? getPageSetting('rDesolationDestack') : Infinity;
	var destackZone = getPageSetting('rDesolationZone') > 0 ? getPageSetting('rDesolationZone') : Infinity;
	var destackStacks = getPageSetting('rDesolationStacks') > 0 ? getPageSetting('rDesolationStacks') : 0;
	var rDesolationMapLevel = 0;
	var rDesolationMapIncrease = getPageSetting('rDesolationMapIncrease') > 0 ? getPageSetting('rDesolationMapIncrease') : 0;
	var hyperspeed2 = game.talents.liquification3.purchased ? 75 : game.talents.hyperspeed2.purchased ? 50 : 0;
	var rDesolationSpecial = (Math.floor(game.global.highestRadonLevelCleared + 1) * (hyperspeed2 / 100) >= game.global.world ? "lmc" : "fa");

	if (game.challenges.Desolation.chilled >= destackStacks && (HDRatio > destackHits || game.global.world >= destackZone))
		rShouldDesolation = true;

	if (game.global.mapRunCounter === 0 && game.global.mapsActive && mapRepeats !== 0) {
		game.global.mapRunCounter = mapRepeats;
		mapRepeats = 0;
	}
	var rAutoLevel_Repeat = rAutoLevel;
	mapAutoLevel = callAutoMapLevel(currentMap, rAutoLevel, rDesolationSpecial, 10, (0 + rDesolationMapIncrease), false);
	if (mapAutoLevel !== Infinity) {
		if (rAutoLevel_Repeat !== Infinity && mapAutoLevel !== rAutoLevel_Repeat) mapRepeats = game.global.mapRunCounter + 1;
		rDesolationMapLevel = mapAutoLevel;
	}
	if (!rShouldDesolation && (MODULES.mapFunctions.desolationContinueRunning || (game.global.mapsActive && rMapSettings.mapName === 'Desolation Destacking'))) {
		if (game.challenges.Desolation.chilled > 0) {
			rShouldDesolation = true;
			MODULES.mapFunctions.desolationContinueRunning = true;
		}
		if (!game.jobs.Explorer.locked && game.challenges.Desolation.chilled === 0) {
			if (game.global.mapBonus === 10) {
				mapsClicked(true);
				recycleMap();
			}
			MODULES.mapFunctions.desolationContinueRunning = false;
		}
	}

	var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== rDesolationMapLevel || (getCurrentMapObject().bonus !== rDesolationSpecial && (getCurrentMapObject().bonus !== undefined && rDesolationSpecial !== '0')) || game.challenges.Desolation.chilled <= rDesolationMapLevel + 1);
	var status = 'Desolation Destacking: ' + game.challenges.Desolation.chilled + " remaining";

	farmingDetails.shouldRun = rShouldDesolation;
	farmingDetails.mapName = mapName;
	farmingDetails.mapLevel = rDesolationMapLevel;
	farmingDetails.autoLevel = true;
	farmingDetails.special = rDesolationSpecial;
	farmingDetails.repeat = !repeat;
	farmingDetails.status = status;

	if (currentMap === mapName && !farmingDetails.shouldRun) {
		mappingDetails(mapName, rDesolationMapLevel, rDesolationSpecial);
		resetMapVars();
	}
	return farmingDetails;
}

//HD Farm
function HDFarm() {

	const mapName = 'HD Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (game.global.universe === 1 && !autoTrimpSettings.hHDFarmDefaultSettings.value.active) return farmingDetails;
	if (game.global.universe === 2 && !autoTrimpSettings.rHDFarmDefaultSettings.value.active) return farmingDetails;

	const isC3 = game.global.runningChallengeSquared || challengeActive('Mayhem') || challengeActive('Pandemonium') || challengeActive('Desolation');
	const isDaily = challengeActive('Daily');
	const dontRecycleMaps = challengeActive('Unbalance') || challengeActive('Trappapalooza') || challengeActive('Archaeology') || challengeActive('Berserk') || game.portal.Frenzy.frenzyStarted !== -1 || !newArmyRdy();
	const totalPortals = getTotalPortals();
	const metalShred = isDaily && typeof (game.global.dailyChallenge.hemmorrhage) !== 'undefined' && dailyModifiers.hemmorrhage.getResources(game.global.dailyChallenge.hemmorrhage.strength).includes('metal');
	const rHDFBaseSetting = game.global.universe === 1 ? autoTrimpSettings.hHDFarmSettings.value : autoTrimpSettings.rHDFarmSettings.value;
	const rHDFDefaultSetting = game.global.universe === 1 ? autoTrimpSettings.hHDFarmDefaultSettings.value : autoTrimpSettings.rHDFarmDefaultSettings.value;
	const currChall = game.global.challengeActive;
	var rShouldHDFarm = false;
	var rShouldSkip = false;
	var mapAutoLevel = Infinity;

	var rHDFIndex;
	for (var y = 0; y < rHDFBaseSetting.length; y++) {
		const currSetting = rHDFBaseSetting[y];
		if (!currSetting.active || currSetting.done === totalPortals + "_" + game.global.world || currSetting.world > game.global.world || game.global.world > currSetting.endzone) {
			continue;
		}
		if (currSetting.runType !== 'All') {
			if (!isC3 && !isDaily && (currSetting.runType !== 'Filler' ||
				(currSetting.runType === 'Filler' && (currSetting.challenge !== 'All' && currSetting.challenge !== currChall)))) continue;
			if (isDaily && currSetting.runType !== 'Daily') continue;
			if (isC3 && (currSetting.runType !== 'C3' ||
				(currSetting.runType === 'C3' && (currSetting.challenge3 !== 'All' && currSetting.challenge3 !== currChall)))) continue;
		}
		if (game.global.world >= currSetting.world && game.global.lastClearedCell + 2 >= currSetting.cell) {
			rHDFIndex = y;
			break;
		}
		else
			continue;
	}

	if (rHDFIndex >= 0) {
		var rHDFSettings = rHDFBaseSetting[rHDFIndex];
		var rHDFMapLevel = rHDFSettings.level;
		var rHDFSpecial = getAvailableSpecials('lmc');
		var rHDFJobRatio = '0,0,1,0';
		var hdType = rHDFSettings.hdType;
		var rHDFMax = hdType === 'world' && game.global.mapBonus != 10 ? 10 : null;
		var rHDFMin = hdType === 'world' && game.global.mapBonus != 10 ? 0 : null;
		var rHDFshredMapCap = autoTrimpSettings.rHDFarmDefaultSettings.value.shredMapCap;
		var rHDFmapCap = rHDFDefaultSetting.mapCap;

		var rHDFmaxMaps = metalShred ? rHDFshredMapCap : rHDFmapCap;

		if (rHDFSettings.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && mapRepeats !== 0) {
				game.global.mapRunCounter = mapRepeats;
				mapRepeats = 0;
			}

			var rAutoLevel_Repeat = rAutoLevel;
			mapAutoLevel = callAutoMapLevel(currentMap, rAutoLevel, rHDFSpecial, rHDFMax, rHDFMin, false);
			if (mapAutoLevel !== Infinity) {
				if (rAutoLevel_Repeat !== Infinity && mapAutoLevel !== rAutoLevel_Repeat) mapRepeats = game.global.mapRunCounter + 1;
				rHDFMapLevel = mapAutoLevel;
			}
		}
		let hdRatio = hdType === 'world' ? HDRatio : hdType === 'void' ? voidHDRatio : hdType === 'map' ? mapHDRatio : null;
		if (hdRatio === null) return farmingDetails;

		if (hdRatio > equipfarmdynamicHD(rHDFIndex))
			rShouldHDFarm = true;
		//Skipping farm if map repeat value is greater than our max maps value
		if (rShouldHDFarm && game.global.mapsActive && currentMap === mapName && game.global.mapRunCounter >= rHDFmaxMaps) {
			rShouldHDFarm = false;
		}
		if (currentMap !== mapName && equipfarmdynamicHD(rHDFIndex) > hdRatio)
			rShouldSkip = true;

		if (((currentMap === mapName && !rShouldHDFarm) || rShouldSkip) && HDRatio !== Infinity) {
			hdRatio = calcHDRatio(game.global.world, hdType);
			if (!rShouldSkip) mappingDetails(mapName, rHDFMapLevel, rHDFSpecial, hdRatio, equipfarmdynamicHD(rHDFIndex));
			if (getPageSetting('rMapRepeatCount') && rShouldSkip) debug("HD Farm (Z" + game.global.world + ") skipped as HD Ratio goal has been met (" + hdRatio.toFixed(2) + "/" + equipfarmdynamicHD(rHDFIndex).toFixed(2) + ").");
			resetMapVars(rHDFSettings);
			if (!dontRecycleMaps && game.global.mapsActive) {
				mapsClicked(true);
				recycleMap();
			}
		}

		var repeat = game.global.mapsActive && ((getCurrentMapObject().level - game.global.world) !== rHDFMapLevel || (getCurrentMapObject().bonus !== rHDFSpecial && (getCurrentMapObject().bonus !== undefined && rHDFSpecial !== '0')));
		var status = 'HD&nbsp;Farm&nbsp;to:&nbsp;' + equipfarmdynamicHD(rHDFIndex).toFixed(2) + '<br>\
		Current&nbsp;HD:&nbsp;' + hdRatio.toFixed(2) + '<br>\
		Maps:&nbsp;' + (game.global.mapRunCounter + 1) + '/' + rHDFmaxMaps;

		farmingDetails.shouldRun = rShouldHDFarm;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = rHDFMapLevel;
		farmingDetails.autoLevel = rHDFSettings.autoLevel;
		farmingDetails.special = rHDFSpecial;
		farmingDetails.jobRatio = rHDFJobRatio;
		farmingDetails.HDRatio = equipfarmdynamicHD(rHDFIndex);
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;
	}

	return farmingDetails;
}

function FarmingDecision() {
	var farmingDetails = {
		shouldRun: false,
		mapName: ''
	}

	//Resetting map run counter to 0 when in world
	if (!game.global.mapsActive && !game.global.preMapsActive) {
		game.global.mapRunCounter = 0;
	}

	//Won't map till after cell 90 on Lead on Even zones
	if (challengeActive('Lead') && !game.global.runningChallengeSquared && (game.global.world % 2 == 0 || game.global.lastClearedCell + 2 <= 90)) {
		return farmingDetails;
	}
	if (!game.global.mapsUnlocked) return farmingDetails;
	if (game.global.universe === 1 && !autoTrimpSettings.AutoMaps.value) return farmingDetails;
	if (game.global.universe === 2 && !autoTrimpSettings.RAutoMaps.value) return farmingDetails;

	//U1 map settings to check for.
	if (game.global.universe === 1) var mapTypes = [PrestigeClimb(), MapFarm(), PrestigeRaiding(), BionicRaiding(), HDFarm(), VoidMaps(), MapBonus(), Experience(), MapDestacking()];

	//Skipping map farming if in Decay and above stack count user input
	if (decaySkipMaps()) mapTypes = [PrestigeClimb(), VoidMaps()];
	if (challengeActive('Mapology')) mapTypes = [PrestigeClimb(), BionicRaiding(), VoidMaps()];

	//U2 map settings to check for.
	if (game.global.universe === 2) var mapTypes = [Desolation(), Quest(), PandemoniumDestack(), PrestigeClimb(), SmithyFarm(), MapFarm(), TributeFarm(), WorshipperFarm(), MapDestacking(), PrestigeRaiding(), Mayhem(), Insanity(), PandemoniumFarm(), Alchemy(), Hypothermia(), HDFarm(), VoidMaps(), Quagmire(), Glass(), MapBonus(), Smithless(), Wither()];

	for (const map of mapTypes) {
		if (map.shouldRun) {
			return map;
		}
	}

	return farmingDetails;
}

//RAMP - Prestige Raiding
function RAMPplusMapToRun(number, raidzones) {
	var map;

	map = (raidzones - game.global.world - number);

	if ((raidzones - number).toString().slice(-1) == 0) map = map - 5
	if ((raidzones - number).toString().slice(-1) == 9) map = map - 5
	if ((raidzones - number).toString().slice(-1) == 8) map = map - 5
	if ((raidzones - number).toString().slice(-1) == 7) map = map - 5
	if ((raidzones - number).toString().slice(-1) == 6) map = map - 5
	return map;
}

function RAMPshouldrunmap(number, raidzones) {
	var go = false;
	var actualraidzone = (raidzones - number);
	if (Rgetequips(actualraidzone, false) > 0) go = true;

	return go;
}

function RAMPplusPres(number, raidzones) {
	document.getElementById("biomeAdvMapsSelect").value = game.global.farmlandsUnlocked ? "Farmlands" : "Plentiful";
	document.getElementById("mapLevelInput").value = game.global.world;
	document.getElementById("advExtraLevelSelect").value = RAMPplusMapToRun(number, raidzones);
	document.getElementById("advSpecialSelect").value = "p";
	document.getElementById("lootAdvMapsRange").value = 9;
	document.getElementById("difficultyAdvMapsRange").value = 9;
	document.getElementById("sizeAdvMapsRange").value = 9;
	document.getElementById("advPerfectCheckbox").dataset.checked = true;
	updateMapCost();
	if (updateMapCost(true) <= game.resources.fragments.owned) return updateMapCost(true);
	document.getElementById("advPerfectCheckbox").dataset.checked = false;
	if (updateMapCost(true) <= game.resources.fragments.owned) return updateMapCost(true);
	document.getElementById("biomeAdvMapsSelect").value = "Random";
	if (updateMapCost(true) <= game.resources.fragments.owned) return updateMapCost(true);

	while (lootAdvMapsRange.value > 0 && updateMapCost(true) > game.resources.fragments.owned) {
		lootAdvMapsRange.value -= 1;
	}
	while (difficultyAdvMapsRange.value > 0 && sizeAdvMapsRange.value > 0 && updateMapCost(true) > game.resources.fragments.owned) {
		difficultyAdvMapsRange.value -= 1;
		if (updateMapCost(true) <= game.resources.fragments.owned) break;
		sizeAdvMapsRange.value -= 1;
	}
	if (updateMapCost(true) <= game.resources.fragments.owned) return updateMapCost(true);
	if (updateMapCost(true) > game.resources.fragments.owned) {
		document.getElementById("advSpecialSelect").value = "0";
		updateMapCost();
	}
	if (document.getElementById("advSpecialSelect").value == "0") return updateMapCost(true);
}

function RAMPplusPresfragmax(number, raidzones) {
	document.getElementById("biomeAdvMapsSelect").value = game.global.farmlandsUnlocked ? "Farmlands" : game.global.decayDone ? "Plentiful" : "Mountains";
	document.getElementById("mapLevelInput").value = game.global.world;
	incrementMapLevel(1);
	document.getElementById("advExtraLevelSelect").value = RAMPplusMapToRun(number, raidzones);
	document.getElementById("advSpecialSelect").value = "p";
	document.getElementById("lootAdvMapsRange").value = 9;
	document.getElementById("difficultyAdvMapsRange").value = 9;
	document.getElementById("sizeAdvMapsRange").value = 9;
	document.getElementById("advPerfectCheckbox").dataset.checked = true;
	updateMapCost();
	return updateMapCost(true);
}

function RAMPplusPresfragmin(number, raidzones) {
	document.getElementById("biomeAdvMapsSelect").value = game.global.farmlandsUnlocked ? "Farmlands" : game.global.decayDone ? "Plentiful" : "Mountains";
	document.getElementById("mapLevelInput").value = game.global.world;
	document.getElementById("advExtraLevelSelect").value = RAMPplusMapToRun(number, raidzones);
	document.getElementById("advSpecialSelect").value = "p";
	document.getElementById("lootAdvMapsRange").value = 0;
	document.getElementById("difficultyAdvMapsRange").value = 9;
	document.getElementById("sizeAdvMapsRange").value = 9;
	document.getElementById("advPerfectCheckbox").dataset.checked = false;
	updateMapCost();
	if (updateMapCost(true) <= game.resources.fragments.owned) {
		return updateMapCost(true);
	}
	if (updateMapCost(true) > game.resources.fragments.owned) {
		document.getElementById("biomeAdvMapsSelect").value = "Random";
		updateMapCost();
	}
	if (updateMapCost(true) <= game.resources.fragments.owned) return updateMapCost(true);

	while (difficultyAdvMapsRange.value > 0 && sizeAdvMapsRange.value > 0 && updateMapCost(true) > game.resources.fragments.owned) {
		difficultyAdvMapsRange.value -= 1;
		if (updateMapCost(true) <= game.resources.fragments.owned) break;
		sizeAdvMapsRange.value -= 1;
	}
	if (updateMapCost(true) <= game.resources.fragments.owned) return updateMapCost(true);

	document.getElementById("advSpecialSelect").value = "fa";
	updateMapCost();

	if (updateMapCost(true) <= game.resources.fragments.owned) return updateMapCost(true);

	document.getElementById("advSpecialSelect").value = "0";
	updateMapCost();
	return updateMapCost(true);
}

function RAMPfrag(raidzones, fragtype) {
	var cost = 0;

	if (Rgetequips(raidzones, false)) {
		if (fragtype == 1) cost += RAMPplusPresfragmin(0);
		else if (fragtype == 2) cost += RAMPplusPresfragmax(0);
	}
	if (Rgetequips((raidzones - 1), false)) {
		if (fragtype == 1) cost += RAMPplusPresfragmin(1);
		else if (fragtype == 2) cost += RAMPplusPresfragmax(1);
	}
	if (Rgetequips((raidzones - 2), false)) {
		if (fragtype == 1) cost += RAMPplusPresfragmin(2);
		else if (fragtype == 2) cost += RAMPplusPresfragmax(2);
	}
	if (Rgetequips((raidzones - 3), false)) {
		if (fragtype == 1) cost += RAMPplusPresfragmin(3);
		else if (fragtype == 2) cost += RAMPplusPresfragmax(3);
	}
	if (Rgetequips((raidzones - 4), false)) {
		if (fragtype == 1) cost += RAMPplusPresfragmin(4);
		else if (fragtype == 2) cost += RAMPplusPresfragmax(4);
	}

	if (game.resources.fragments.owned >= cost) return true;
	else return false;
}

function fragmap() {
	var fragmentsOwned = game.resources.fragments.owned
	document.getElementById("biomeAdvMapsSelect").value = game.global.farmlandsUnlocked ? "Farmlands" : game.global.decayDone ? "Plentiful" : "Mountains";
	document.getElementById("advExtraLevelSelect").value = 0;
	document.getElementById("advSpecialSelect").value = "fa";
	document.getElementById("lootAdvMapsRange").value = 9;
	document.getElementById("difficultyAdvMapsRange").value = 9;
	document.getElementById("sizeAdvMapsRange").value = 9;
	document.getElementById("advPerfectCheckbox").dataset.checked = true;
	document.getElementById("mapLevelInput").value = game.talents.mapLoot.purchased ? game.global.world - 1 : game.global.world;
	updateMapCost();

	if (updateMapCost(true) > fragmentsOwned) {
		document.getElementById("biomeAdvMapsSelect").value = "Random";
		updateMapCost();
	}
	if (updateMapCost(true) > fragmentsOwned) {
		document.getElementById("advPerfectCheckbox").dataset.checked = false;
		updateMapCost();
	}

	while (difficultyAdvMapsRange.value > 0 && sizeAdvMapsRange.value > 0 && updateMapCost(true) > fragmentsOwned) {
		if (difficultyAdvMapsRange.value !== 0) difficultyAdvMapsRange.value -= 1;
		if (updateMapCost(true) <= fragmentsOwned) break;
		if (sizeAdvMapsRange.value !== 0) sizeAdvMapsRange.value -= 1;
	}
	if (updateMapCost(true) <= fragmentsOwned) return updateMapCost(true);

	if (updateMapCost(true) > fragmentsOwned) {
		document.getElementById("advSpecialSelect").value = 0;
		updateMapCost();
	}
}

function mapCost(pluslevel, special, biome, onlyPerfect) {
	maplevel = pluslevel < 0 ? game.global.world + pluslevel : game.global.world;
	if (!pluslevel || pluslevel < 0) pluslevel = 0;
	if (!special) special = '0';
	if (!biome) biome = game.global.farmlandsUnlocked && game.global.universe == 2 ? "Farmlands" : game.global.decayDone ? "Plentiful" : "Random";
	document.getElementById("biomeAdvMapsSelect").value = biome;
	document.getElementById("advExtraLevelSelect").value = pluslevel;
	document.getElementById("advSpecialSelect").value = special;
	document.getElementById("lootAdvMapsRange").value = 9;
	document.getElementById("difficultyAdvMapsRange").value = 9;
	document.getElementById("sizeAdvMapsRange").value = 9;
	document.getElementById("advPerfectCheckbox").dataset.checked = true;
	document.getElementById("mapLevelInput").value = maplevel;
	updateMapCost();

	if (!onlyPerfect) {
		if (updateMapCost(true) > game.resources.fragments.owned) {
			document.getElementById("biomeAdvMapsSelect").value = "Random";
			updateMapCost();
		}
		if (updateMapCost(true) > game.resources.fragments.owned) {
			document.getElementById("advPerfectCheckbox").dataset.checked = false;
			updateMapCost();
		}

		while (difficultyAdvMapsRange.value > 0 && sizeAdvMapsRange.value > 0 && updateMapCost(true) > game.resources.fragments.owned) {
			difficultyAdvMapsRange.value -= 1;
			if (updateMapCost(true) <= game.resources.fragments.owned) break;
			sizeAdvMapsRange.value -= 1;
		}
		if (updateMapCost(true) <= game.resources.fragments.owned) return updateMapCost(true);

		if (updateMapCost(true) > game.resources.fragments.owned) {
			document.getElementById("advSpecialSelect").value = 0;
			updateMapCost();
		}
	}

	return updateMapCost(true);
}

function fragMapFarmCost() {
	var cost = 0;

	cost = PerfectMapCost(rMapSettings.mapLevel, rMapSettings.special);

	if (game.resources.fragments.owned >= cost)
		return true;
	else
		return false;
}

function rFragmentFarm() {

	var rFragMapBought = false;
	//Worshipper farming
	var rFragCheck = true;
	if (fragMapFarmCost() == true) {
		rFragCheck = true;
		MODULES.maps.fragmentFarming = false;
	} else if (fragMapFarmCost() == false) {
		MODULES.maps.fragmentFarming = true;
		rFragCheck = false;
		if (!rFragCheck && rInitialFragmentMapID == undefined && !rFragMapBought && game.global.preMapsActive) {
			//debug("Check complete for fragment farming map");
			fragmap();
			if ((updateMapCost(true) <= game.resources.fragments.owned)) {
				buyMap();
				rFragMapBought = true;
				if (rFragMapBought) {
					rInitialFragmentMapID = game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1].id;
					//debug("Fragment farming map purchased");
				}
			}
		}
		if (!rFragCheck && game.global.preMapsActive && !game.global.mapsActive && rFragMapBought && rInitialFragmentMapID != undefined) {
			debug("Fragment farming for a " + (rMapSettings.mapLevel >= 0 ? "+" : "") + rMapSettings.mapLevel + " " + rMapSettings.special + " map.");
			selectedMap = rInitialFragmentMapID;
			selectMap(rInitialFragmentMapID);
			runMap();
			rFragmentMapID = rInitialFragmentMapID;
			rInitialFragmentMapID = undefined;
		}
		if (!rFragCheck && !game.global.repeatMap && game.resources.fragments.owned < PerfectMapCost(rMapSettings.mapLevel, rMapSettings.special)) repeatClicked();
		if (!rFragCheck && game.resources.fragments.owned >= PerfectMapCost(rMapSettings.mapLevel, rMapSettings.special) && game.global.mapsActive && rFragMapBought && rFragmentMapID != undefined) {
			if (fragMapFarmCost() == false) {
				if (!game.global.repeatMap) {
					repeatClicked();
				}
			} else if (fragMapFarmCost() == true) {
				if (game.global.repeatMap) {
					repeatClicked();
				}
				if (game.global.preMapsActive && rFragMapBought && rFragmentMapID != undefined) {
					rFragMapBought = false;
				}
				rFragCheck = true;
				MODULES.maps.fragmentFarming = false;
				debug("Fragment farming successful")
			}
		}
	} else {
		rFragCheck = true;
		MODULES.maps.fragmentFarming = false;
		debug("Fragment farming successful")
	}

	if (rFragCheck) {
		PerfectMapCost(rMapSettings.mapLevel, rMapSettings.special)
	}

	updateMapCost();
}

function PerfectMapCost(pluslevel, special, biome) {
	maplevel = pluslevel < 0 ? game.global.world + pluslevel : game.global.world;
	if (!pluslevel || pluslevel < 0) pluslevel = 0;
	if (!special) special = '0';
	if (!biome) biome = game.global.farmlandsUnlocked && game.global.universe == 2 ? "Farmlands" : game.global.decayDone ? "Plentiful" : "Random";
	document.getElementById("biomeAdvMapsSelect").value = biome;
	document.getElementById("advExtraLevelSelect").value = pluslevel;
	document.getElementById("advSpecialSelect").value = special;
	document.getElementById("lootAdvMapsRange").value = 9;
	document.getElementById("difficultyAdvMapsRange").value = 9;
	document.getElementById("sizeAdvMapsRange").value = 9;
	document.getElementById("advPerfectCheckbox").dataset.checked = true;
	document.getElementById("mapLevelInput").value = maplevel;
	updateMapCost();

	return updateMapCost(true);
}

function RShouldFarmMapCost(pluslevel, special, biome) {
	//Pre-init
	maplevel = pluslevel < 0 ? game.global.world + pluslevel : game.global.world;
	if (!pluslevel || pluslevel < 0) pluslevel = 0;
	if (!special) special = getAvailableSpecials('lmc');
	if (!biome) biome = game.global.farmlandsUnlocked && game.global.universe == 2 ? "Farmlands" : game.global.decayDone ? "Plentiful" : "Mountains";

	//Working out appropriate map settings
	document.getElementById("mapLevelInput").value = maplevel;
	document.getElementById("advExtraLevelSelect").value = pluslevel;
	document.getElementById("biomeAdvMapsSelect").value = biome;
	document.getElementById("advSpecialSelect").value = special;
	updateMapCost();
	return updateMapCost(true);
}

function RShouldFarmMapCreation(pluslevel, special, biome, difficulty, loot, size) {
	//Pre-Init
	if (!pluslevel) pluslevel = 0;
	if (!special) special = getAvailableSpecials('lmc');
	if (!biome) biome = game.global.farmlandsUnlocked && game.global.universe == 2 ? "Farmlands" : game.global.decayDone ? "Plentiful" : "Mountains";
	if (!difficulty) difficulty = 0.75;
	if (!loot) loot = game.global.farmlandsUnlocked && game.singleRunBonuses.goldMaps.owned ? 3.6 : game.global.farmlandsUnlocked ? 2.6 : game.singleRunBonuses.goldMaps.owned ? 2.85 : 1.85;
	if (!size) size = 20;

	for (var mapping in game.global.mapsOwnedArray) {
		if (!game.global.mapsOwnedArray[mapping].noRecycle && (
			(game.global.world + pluslevel) == game.global.mapsOwnedArray[mapping].level) &&
			(game.global.mapsOwnedArray[mapping].bonus == special || game.global.mapsOwnedArray[mapping].bonus === undefined && special === '0') &&
			game.global.mapsOwnedArray[mapping].location == biome/*  &&
			game.global.mapsOwnedArray[mapping].difficulty == difficulty &&
			game.global.mapsOwnedArray[mapping].loot == loot &&
			game.global.mapsOwnedArray[mapping].size == size */) {

			return (game.global.mapsOwnedArray[mapping].id);
		}
	}
	return ("create");
}

function rRunMap() {
	if (game.options.menu.pauseGame.enabled) return;
	if (game.global.lookingAtMap === "") return;
	if (game.achievements.mapless.earnable) {
		game.achievements.mapless.earnable = false;
		game.achievements.mapless.lastZone = game.global.world;
	}
	if (challengeActive('Quest') && game.challenges.Quest.questId == 5 && !game.challenges.Quest.questComplete) {
		game.challenges.Quest.questProgress++;
		if (game.challenges.Quest.questProgress == 1) game.challenges.Quest.failQuest();
	}
	var mapId = game.global.lookingAtMap;
	game.global.preMapsActive = false;
	game.global.mapsActive = true;
	game.global.currentMapId = mapId;
	mapsSwitch(true);
	var mapObj = getCurrentMapObject();
	if (mapObj.bonus) {
		game.global.mapExtraBonus = mapObj.bonus;
	}
	if (game.global.lastClearedMapCell == -1) {
		buildMapGrid(mapId);
		drawGrid(true);

		if (mapObj.location == "Void") {
			game.global.voidDeaths = 0;
			game.global.voidBuff = mapObj.voidBuff;
			setVoidBuffTooltip();
		}
	}
	if (challengeActive('Insanity')) game.challenges.Insanity.drawStacks();
	if (challengeActive('Pandemonium')) game.challenges.Pandemonium.drawStacks();
}