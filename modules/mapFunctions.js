MODULES.mapFunctions = {};

MODULES.mapFunctions.portalAfterVoids = false;
MODULES.mapFunctions.hasHealthFarmed = '';
MODULES.mapFunctions.runUniqueMap = '';
MODULES.mapFunctions.challengeContinueRunning = false;
MODULES.mapFunctions.hypothermia = { buyPackrat: false, }
MODULES.mapFunctions.desolation = { gearScum: false, }

//Unique Maps
MODULES.uniqueMaps = {
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
		zone: 50,
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

//Void Maps
MODULES.voidPrefixes = Object.freeze({
	'Poisonous': 10,
	'Destructive': 11,
	'Heinous': 20,
	'Deadly': 30
});

MODULES.voidSuffixes = Object.freeze({
	'Descent': 7.077,
	'Void': 8.822,
	'Nightmare': 9.436,
	'Pit': 10.6
});

function isDoingSpire() {
	if (!game.global.spireActive) return false;
	const settingPrefix = hdStats.isC3 ? 'c2' : hdStats.isDaily ? 'd' : '';
	var spireNo = getPageSetting(settingPrefix + 'IgnoreSpiresUntil');
	if (spireNo === -1 || spireNo === 0) return true;
	var spireZone = (1 + spireNo) * 100;
	return game.global.world >= spireZone;
}

function exitSpireCell() {
	if (!game.global.spireActive) return;
	const settingPrefix = hdStats.isC3 ? 'c2' : hdStats.isDaily ? 'd' : '';
	if (getPageSetting(settingPrefix + 'ExitSpireCell') <= 0) return;

	isDoingSpire() && game.global.lastClearedCell > getPageSetting(settingPrefix + 'ExitSpireCell') - 1 && endSpire()
}

//Unique Maps Pt.2
function shouldRunUniqueMap(map) {
	const mapData = MODULES.uniqueMaps[map.name];
	const uniqueMapSetting = getPageSetting('uniqueMapSettingsArray');

	if (mapSettings.mapName === 'Desolation Destacking') return false;
	if (mapSettings.mapName === 'Pandemonium Destacking') return false;
	if (mapSettings.mapName === 'Mayhem Destacking') return false;
	if (mapData === undefined || game.global.world < mapData.zone) {
		return false;
	}
	if (game.global.universe !== mapData.universe) {
		return false;
	}
	if (!hdStats.isC3 && mapData.challenges.includes(hdStats.currChallenge) && !challengeActive('')) {
		return true;
	}
	//Remove speed run check for now
	/* if (mapData.speedrun && shouldSpeedRun(game.achievements[mapData.speedrun])) {
		return true;
	} */

	if (MODULES.mapFunctions.runUniqueMap === map.name) {
		if (game.global.mapsActive && getCurrentMapObject().location === MODULES.mapFunctions.runUniqueMap) MODULES.mapFunctions.runUniqueMap = '';
		return true;
	}
	//Check to see if the cell is liquified and if so we can replace the cell condition with it
	const liquified = game.global.gridArray && game.global.gridArray[0] && game.global.gridArray[0].name === "Liquimp";

	if (game.global.universe === 1) {
		if (map.name === 'The Block') {
			//We need Shieldblock
			if (!game.upgrades.Shieldblock.allowed && getPageSetting('equipShieldBlock')) {
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
				if (getPageSetting('spamMessages').map_Details && game.global.preMapsActive) debug('Running ' + map.name + ' on zone ' + game.global.world + '.', "map_Details");
				return true;
			}
		} else if (map.name === 'The Prison') {
			if (game.mapUnlocks.ThePrison.canRunOnce && uniqueMapSetting.The_Prison.enabled && game.global.world >= uniqueMapSetting.The_Prison.zone && (game.global.lastClearedCell + 2 >= uniqueMapSetting.The_Prison.cell || liquified)) {
				if (getPageSetting('spamMessages').map_Details && game.global.preMapsActive) debug('Running ' + map.name + ' on zone ' + game.global.world + '.', "map_Details");
				return true;
			}
		} else if (map.name === 'Imploding Star') {
			if (game.mapUnlocks.ImplodingStar.canRunOnce && uniqueMapSetting.Imploding_Star.enabled && game.global.world >= uniqueMapSetting.Imploding_Star.zone && (game.global.lastClearedCell + 2 >= uniqueMapSetting.Imploding_Star.cell || liquified)) {
				if (getPageSetting('spamMessages').map_Details && game.global.preMapsActive) debug('Running ' + map.name + ' on zone ' + game.global.world + '.', "map_Details");
				return true;
			}
		}
	} else if (game.global.universe === 2) {
		if (mapSettings.mapName === 'Quagmire Farm' && map.name === 'The Black Bog') {
			return true;
		}
		else if (map.name === 'Big Wall') {
			// we need Bounty
			if (!game.upgrades.Bounty.allowed && !game.talents.bounty.purchased) {
				return true;
			}
		} else if (map.name === 'Dimension of Rage') {
			// unlock the portal
			if (document.getElementById("portalBtn").style.display === "none" && game.upgrades.Rage.done === 1 && uniqueMapSetting.Dimension_of_Rage.enabled && game.global.world >= uniqueMapSetting.Dimension_of_Rage.zone && game.global.lastClearedCell + 2 >= uniqueMapSetting.Dimension_of_Rage.cell) {
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
				if (getPageSetting('spamMessages').map_Details && game.global.preMapsActive) debug('Running ' + map.name + ' on zone ' + game.global.world + '.', "map_Details");
				return true;
			}
		} else if (map.name === 'Melting Point') {
			// maybe get extra smithies
			var currChallenge = hdStats.currChallenge.toLowerCase()
			meltsmithy =
				(currChallenge === 'Mayhem' || currChallenge === 'Pandemonium' || currChallenge === 'Desolation') && getPageSetting(currChallenge) && getPageSetting(currChallenge + 'MP') > 0 ? getPageSetting(currChallenge + 'MP') :
					hdStats.isC3 && uniqueMapSetting.MP_Smithy_C3.enabled && uniqueMapSetting.MP_Smithy_C3.value > 0 ? uniqueMapSetting.MP_Smithy_C3.value :
						hdStats.isDaily && uniqueMapSetting.MP_Smithy_Daily.enabled && uniqueMapSetting.MP_Smithy_Daily.value > 0 ? uniqueMapSetting.MP_Smithy_Daily.value :
							!hdStats.isC3 && !hdStats.isDaily && uniqueMapSetting.MP_Smithy.enabled && uniqueMapSetting.MP_Smithy.value > 0 ? uniqueMapSetting.MP_Smithy.value :
								Infinity;
			if (game.mapUnlocks.SmithFree.canRunOnce &&
				((!hdStats.isC3 && !hdStats.isDaily && uniqueMapSetting.Melting_Point.enabled && game.global.world >= uniqueMapSetting.Melting_Point.zone && game.global.lastClearedCell + 2 >= uniqueMapSetting.Melting_Point.cell) ||
					(meltsmithy !== Infinity && meltsmithy <= game.buildings.Smithy.owned))) {
				if (getPageSetting('spamMessages').map_Details && game.global.preMapsActive) debug('Running ' + map.name + ' at ' + game.buildings.Smithy.owned + ' smithies on zone ' + game.global.world + '.', "map_Details");
				return true;
			}
		} else if (map.name === 'Frozen Castle') {
			// maybe get the treasure
			var frozencastle = !challengeActive('Hypothermia') && uniqueMapSetting.Frozen_Castle.enabled && game.global.world >= uniqueMapSetting.Frozen_Castle.zone && game.global.lastClearedCell + 2 >= uniqueMapSetting.Frozen_Castle.cell;
			var hypoDefaultSettings = getPageSetting('hypothermiaSettings')[0];
			var hypothermia = challengeActive('Hypothermia') && mapSettings.mapName !== 'Void Maps' &&
				hypoDefaultSettings.active && game.global.world >= (hypoDefaultSettings.frozencastle[0] !== undefined ? parseInt(hypoDefaultSettings.frozencastle[0]) : 200) &&
				game.global.lastClearedCell + 2 >= (hypoDefaultSettings.frozencastle[1] !== undefined ? parseInt(hypoDefaultSettings.frozencastle[1]) : 99);
			if (frozencastle || hypothermia) {
				if (getPageSetting('spamMessages').map_Details && game.global.preMapsActive) debug('Running ' + map.name + ' on zone ' + game.global.world + '.', "map_Details");
				return true;
			}
		}
	}
	return false;
}

function recycleMap_AT(forceAbandon) {
	if (!getPageSetting('autoMaps')) return;
	if (!getPageSetting('recycleExplorer') && game.jobs.Explorer.locked === 1) return;
	if (!forceAbandon && (challengeActive('Unbalance') || challengeActive('Trappapalooza') || challengeActive('Archaeology') || challengeActive('Berserk') || game.portal.Frenzy.frenzyStarted !== -1 || !newArmyRdy() || mapSettings.mapName === 'Prestige Raiding' || mapSettings.mapName === 'Prestige Climb')) return;

	//If we're done mapping AND in a map, then exit map to either world if autoMaps is enabled or to map chamber if not.
	if (game.global.mapsActive) {
		mapsClicked(true);
	}
}

//Check to see if we are running Atlantrimp or if we should be.
function runningAtlantrimp() {
	var runAtlantrimp = false;
	if (getPageSetting('autoMaps') > 0 && mapSettings.atlantrimp) runAtlantrimp = true;
	else if (game.global.mapsActive && (getCurrentMapObject().location === 'Atlantrimp' || getCurrentMapObject().location === 'Trimple Of Doom')) runAtlantrimp = true;

	return runAtlantrimp;
}

function runUniqueMap(mapName) {
	if (game.global.mapsActive && getCurrentMapObject().name === mapName) return;
	if (challengeActive('Insanity')) return;
	if (mapName === 'Atlantrimp' && game.global.universe === 1) mapName = 'Trimple Of Doom';
	var zone = game.global.world;
	var cell = game.global.lastClearedCell + 2;
	if (mapName === 'Melting Point' && (!game.mapUnlocks.SmithFree.canRunOnce || zone < 55 || (zone === 55 && cell < 56))) return;
	if ((mapName === 'Atlantrimp' || mapName === 'Trimple Of Doom') && (!game.mapUnlocks.AncientTreasure.canRunOnce || zone < 33 || (zone === 33 && cell < 32))) return;

	MODULES.mapFunctions.runUniqueMap = mapName;
	if (game.global.mapsActive && getCurrentMapObject().name !== mapName) {
		recycleMap_AT();
	}

	if (game.global.preMapsActive && game.global.currentMapId === '') {
		for (var map in game.global.mapsOwnedArray) {
			if (game.global.mapsOwnedArray[map].name === mapName) {
				selectMap(game.global.mapsOwnedArray[map].id);
				runMap_AT();
				debug('Running ' + mapName + ' on zone ' + game.global.world + '.', "map_Details");
			}
		}
	}
}

function getVoidMapDifficulty(map) {
	if (!map) {
		return 99999;
	}
	var score = 0;
	for (const [prefix, weight] of Object.entries(MODULES.voidPrefixes)) {
		if (map.name.includes(prefix)) {
			score += weight;
			break;
		}
	}
	for (const [suffix, weight] of Object.entries(MODULES.voidSuffixes)) {
		if (map.name.includes(suffix)) {
			score += weight;
			break;
		}
	}
	return score;
}

function selectEasierVoidMap(map1, map2) {
	if (getVoidMapDifficulty(map2) > getVoidMapDifficulty(map1)) {
		return map1;
	} else {
		return map2;
	}
}

function voidMaps() {

	var shouldMap = false;
	const mapName = 'Void Map';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	const baseSettings = getPageSetting('voidMapSettings');
	const defaultSettings = baseSettings ? baseSettings[0] : null;
	if (defaultSettings === null) return farmingDetails;

	if (!defaultSettings.active && !mapSettings.portalAfterVoids && !MODULES.mapFunctions.portalAfterVoids) return farmingDetails;

	const voidReduction = hdStats.isDaily ? dailyModiferReduction() : 0;
	const dailyAddition = dailyOddOrEven();
	const zoneAddition = dailyAddition.active ? 1 : 0;

	var settingIndex = null;

	var dropdowns = ['hdRatio', 'voidHDRatio'];
	var hdTypes = ['hdType', 'hdType2'];

	var hdObject = {
		world: {
			hdStat: hdStats.hdRatio,
			hdStatVoid: hdStats.vhdRatio,
			name: 'World HD Ratio',
		},
		map: {
			hdStat: hdStats.hdRatioMap,
			name: 'Map HD Ratio',
		},
		void: {
			hdStat: hdStats.hdRatioVoid,
			hdStatVoid: hdStats.vhdRatioVoid,
			name: 'Void HD Ratio',
		},
		hitsSurvived: {
			hdStat: hdStats.hitsSurvived,
			name: 'Hits Survived',
		},
		hitsSurvivedVoid: {
			hdStat: hdStats.hitsSurvivedVoid,
			name: 'Hits Survived Void',
		},
		maplevel: {
			hdStat: hdStats.autoLevel,
			name: 'Map Level',
		},
	};

	for (var y = 0; y < baseSettings.length; y++) {
		if (y === 0) continue;
		const currSetting = baseSettings[y];
		var world = currSetting.world + voidReduction;
		var maxVoidZone = currSetting.maxvoidzone + voidReduction;

		if (dailyAddition.active) {
			if (dailyAddition.skipZone) continue;
			if (!settingShouldRun(currSetting, world, 0) && !settingShouldRun(currSetting, world, zoneAddition)) continue;
		}
		else if (!settingShouldRun(currSetting, world, 0)) continue;
		for (var x = 0; x < zoneAddition + 1; x++) {
			//Running voids regardless of HD if we reach our max void zone / Running voids if our voidHDRatio is greater than our target value. Will automatically run voids if HD Ratio on next zone is too high! aka can't gamma burst
			var skipLine = 0;
			for (var item in dropdowns) {
				var obj = hdObject[currSetting[hdTypes[item]]];
				var hdSetting = obj.hdStat;
				if (obj.hdStatVoid) hdSetting = obj.hdStatVoid;
				if (currSetting[dropdowns[item]] > hdSetting) skipLine++;
			}
			if (skipLine === 2 && maxVoidZone !== game.global.world) continue;

			if (maxVoidZone === game.global.world || game.global.world - world >= 0) {
				settingIndex = y;
				break;
			}
			world += zoneAddition;
			maxVoidZone += zoneAddition;
		}

		if (settingIndex !== null) {
			if (!mapSettings.hdType && getPageSetting('autoMaps')) {

				//Need to improve the void hd ratio inputs so that they match the dropdowns the user has selected.
				var dropdownTitles = ['dropdown', 'dropdown2'];

				for (var item in dropdowns) {
					var obj = hdObject[currSetting[hdTypes[item]]];
					mapSettings[dropdownTitles[item]] = {
						name: obj.name,
						hdRatio: obj.hdStat,
					}
					var hdSetting = obj.hdStat;
					if (hdSetting.hdStatVoid) hdSetting = obj.hdStatVoid;
					//If our HD Ratio is less than our target then track that this is what caused VMs to run.
					if (currSetting[dropdowns[item]] < hdSetting) {
						mapSettings.voidTrigger = obj.name;
					}
				}
				if (!mapSettings.voidTrigger) mapSettings.voidTrigger = 'Zone';
			}
			mapSettings.voidHDIndex = y;
			break;
		}
	}

	if (settingIndex !== null || (mapSettings.voidHDIndex && mapSettings.voidHDIndex !== Infinity && baseSettings[mapSettings.voidHDIndex].world <= game.global.world && baseSettings[mapSettings.voidHDIndex].maxvoidzone >= game.global.world) || mapSettings.portalAfterVoids || MODULES.mapFunctions.portalAfterVoids) {
		var setting = {};
		if (settingIndex === null && !mapSettings.voidHDIndex) {
			var portalSetting = challengeActive('Daily') ? getPageSetting('dailyHeliumHrPortal') : getPageSetting('heliumHrPortal');
			if (portalSetting === 2 && getZoneEmpowerment(game.global.world) !== 'Poison') return farmingDetails;
			if (dailyAddition.skipZone) return farmingDetails;

			setting = {
				cell: 1,
				jobratio: defaultSettings.jobratio ? defaultSettings.jobratio : "0,0,1",
				world: game.global.world,
				portalAfter: true,
			}
			mapSettings.portalAfterVoids = true;
			mapSettings.voidTrigger = (resource() + " Per Hour (") + autoTrimpSettings.heliumHrPortal.name()[portalSetting] + ")";
		} else {
			setting = baseSettings[settingIndex !== null && settingIndex >= 0 ? settingIndex : mapSettings.voidHDIndex];
		}

		var jobRatio = mapSettings.portalAfterVoids || baseSettings[settingIndex] !== undefined ? setting.jobratio : defaultSettings.jobratio;
		mapSettings.portalAfterVoids = mapSettings.portalAfterVoids || baseSettings[settingIndex] !== undefined ? setting.portalAfter : false;

		if (game.global.totalVoidMaps > 0) {
			shouldMap = true;
			//Uses a bone charge if the user has toggled the setting on.
			if (defaultSettings.boneCharge && !mapSettings.boneChargeUsed && game.permaBoneBonuses.boosts.charges > 0 && !game.options.menu.pauseGame.enabled) {
				debug('Consumed 1 bone shrine charge on zone ' + game.global.world + " and gained " + boneShrineOutput(1), "bones");
				buyJobs(jobRatio);
				game.permaBoneBonuses.boosts.consume();
				mapSettings.boneChargeUsed = true;
			}

			//Identifying if we need to do any form of HD Farming before actually running voids
			//If we do then run HD Farm and stop this function until it has been completed.
			if (defaultSettings.voidFarm && (defaultSettings.hitsSurvived > hdStats.hitsSurvivedVoid || defaultSettings.hdRatio < hdStats.vhdRatioVoid)) {
				//Print farming message if we haven't already started HD Farming for stats.
				if (!mapSettings.voidFarm)
					debug('Void Maps (z' + game.global.world + 'c' + (game.global.lastClearedCell + 2) + ') farming for stats before running void maps.', "map_Details");
				return hdFarm(true, true);
			}
		}

		var stackedMaps = Fluffy.isRewardActive('void') ? countStackedVoidMaps() : 0;
		var status = 'Void Maps: ' + game.global.totalVoidMaps + ((stackedMaps) ? " (" + stackedMaps + " stacked)" : "") + ' remaining'

		farmingDetails.shouldRun = shouldMap;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = game.global.world;
		farmingDetails.jobRatio = jobRatio;
		farmingDetails.autoLevel = false;
		farmingDetails.repeat = false;
		farmingDetails.status = status;
		//This is a check for the whichHitsSurvived function to see which type of hitsSurvived we should be looking at.
		farmingDetails.voidHitsSurvived = true;
		//Saving settings here so that we don't need to store them in global variables. They'll just be wiped after Void Maps has finished running.
		//They all need to be copied into HDFarm() as well due to pre-void farming.
		if (mapSettings.boneChargeUsed) farmingDetails.boneChargeUsed = mapSettings.boneChargeUsed;
		if (mapSettings.voidHDIndex) farmingDetails.voidHDIndex = mapSettings.voidHDIndex;
		if (mapSettings.dropdown) farmingDetails.dropdown = mapSettings.dropdown;
		if (mapSettings.dropdown2) farmingDetails.dropdown2 = mapSettings.dropdown2;
		if (mapSettings.voidTrigger) farmingDetails.voidTrigger = mapSettings.voidTrigger;
		if (mapSettings.portalAfterVoids) farmingDetails.portalAfterVoids = mapSettings.portalAfterVoids;
	}

	if (mapSettings.mapName === mapName && !shouldMap) {
		mappingDetails(mapName, null, null, null, null, null);
		resetMapVars();
		if (mapSettings.portalAfterVoids) autoPortalCheck(game.global.world);
		/* delete mapSettings.voidHitsSurvived;
		delete mapSettings.boneChargeUsed;
		delete mapSettings.voidHDIndex;
		delete mapSettings.dropdown;
		delete mapSettings.dropdown2;
		delete mapSettings.voidTrigger;
		delete mapSettings.portalAfterVoids; */
	}

	return farmingDetails;
}

function mapBonus() {

	var shouldMap = false;
	var mapAutoLevel = Infinity;
	const mapName = 'Map Bonus';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	//Initialise variables
	const mapBonusZone = getPageSetting('mapBonusZone');
	const baseSettings = getPageSetting('mapBonusSettings');
	var defaultSettings = baseSettings ? baseSettings[0] : null;
	if (defaultSettings === null) return farmingDetails;
	var mapBonusRatio = getPageSetting('mapBonusRatio');
	//Will get map stacks if below our set hd threshold.
	var healthCheck = mapBonusRatio > 0 && hdStats.hdRatio > mapBonusRatio && getPageSetting('mapBonusStacks') > game.global.mapBonus;
	var healthStacks = healthCheck ? getPageSetting('mapBonusStacks') : 0;
	//Will get max map bonus stacks if we are doing an active spire.
	var spireCheck = getPageSetting('MaxStacksForSpire') && isDoingSpire();
	var spireStacks = spireCheck ? 10 : 0;

	var settingIndex = null;
	if (defaultSettings.active && !healthCheck && !spireCheck) {
		for (var y = 0; y < baseSettings.length; y++) {
			if (y === 0) continue;
			//Skip iterating lines if map bonus is capped.
			if (game.global.mapBonus === 10) continue;
			const currSetting = baseSettings[y];
			var world = currSetting.world;
			if (!settingShouldRun(currSetting, world, 0)) continue;
			if (currSetting.hdRatio > 0 && hdStats.hdRatio < currSetting.hdRatio) continue;

			if (game.global.world - mapBonusZone[y] >= 0)
				settingIndex = mapBonusZone.indexOf(mapBonusZone[y]);
			else
				continue;
		}
	}

	if ((settingIndex !== null && settingIndex >= 0) || healthCheck || spireCheck) {
		if (healthCheck || spireCheck) {
			//Set default settings. If empty then set some of them.
			var defaultEmpty = Object.keys(defaultSettings).length === 1;
			defaultSettings = {
				jobratio: defaultEmpty ? "0,1,3" : defaultSettings.jobratio,
				autoLevel: true,
				level: 0,
				special: defaultEmpty ? "lmc" : defaultSettings.special,
				repeat: Math.max(spireStacks, healthStacks),
			}
		}
		//Initialise variables for map settings.
		var setting = settingIndex !== null ? baseSettings[settingIndex] : defaultSettings;
		var repeatCounter = setting.repeat;
		var mapLevel = setting.level;
		var autoLevel = setting.autoLevel;
		var jobRatio = setting.jobratio;
		var mapSpecial = setting.special !== '0' ? getAvailableSpecials(setting.special) : '0';

		//Factor in siphonology for U1.
		var minZone = game.global.universe === 1 ? (0 - game.portal.Siphonology.level) : 0
		//If auto level enabled will get the level of the map we should run.
		if (autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeats !== 0) {
				game.global.mapRunCounter = MODULES.maps.mapRepeats;
				MODULES.maps.mapRepeats = 0;
			}

			var autoLevel_Repeat = mapSettings.levelCheck;
			mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, 10, minZone);
			if (mapAutoLevel !== Infinity) {
				if (autoLevel_Repeat !== Infinity && mapAutoLevel !== autoLevel_Repeat) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
				mapLevel = mapAutoLevel;
			}
		}

		if (repeatCounter > game.global.mapBonus) {
			shouldMap = true;
		}
		var repeat = game.global.mapBonus >= (repeatCounter - 1);

		var status = (spireCheck ? 'Spire ' : '') + 'Map Bonus: ' + game.global.mapBonus + "/" + repeatCounter;

		farmingDetails.shouldRun = shouldMap;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = mapLevel;
		farmingDetails.autoLevel = autoLevel;
		farmingDetails.jobRatio = jobRatio;
		farmingDetails.special = mapSpecial;
		farmingDetails.mapRepeats = repeatCounter;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;
		farmingDetails.settingIndex = settingIndex;
	}
	//Display setting run message. Reset map vars that were used.
	if (mapSettings.mapName === mapName && (game.global.mapBonus >= repeatCounter || !farmingDetails.shouldRun)) {
		mappingDetails(mapName, mapSettings.mapLevel, mapSettings.special);
		resetMapVars();
		MODULES.maps.mapRepeats = 0;
	}
	return farmingDetails;
}

function mapFarm() {

	var shouldMap = false;
	var mapAutoLevel = Infinity;
	const mapName = 'Map Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	const baseSettings = getPageSetting('mapFarmSettings');
	const defaultSettings = baseSettings ? baseSettings[0] : null;
	if (defaultSettings === null) return farmingDetails;

	if (!defaultSettings.active) return farmingDetails;
	const dailyAddition = dailyOddOrEven();
	const zoneAddition = dailyAddition.active ? 1 : 0;

	var settingIndex;

	for (var y = 0; y < baseSettings.length; y++) {
		if (y === 0) continue;
		var currSetting = baseSettings[y];
		var world = currSetting.world;
		if (currSetting.atlantrimp && !game.mapUnlocks.AncientTreasure.canRunOnce) continue;

		//Ensure we don't eternally farm if daily reset timer is low enough that it will start again next zone
		//Checks against current portal counter to see if it has already been run this portal.
		if (currSetting.mapType === 'Daily Reset') {
			var totalPortals = getTotalPortals();
			if (currSetting.done && currSetting.done.split('_')[0] === totalPortals.toString()) continue;
		}

		if (dailyAddition.active) {
			if (dailyAddition.skipZone) continue;
			if (!settingShouldRun(currSetting, world, 0) && !settingShouldRun(currSetting, world, zoneAddition)) continue;
		}
		else if (!settingShouldRun(currSetting, world, 0)) continue;
		if (currSetting.hdRatio > 0 && hdStats.hdRatio < currSetting.hdRatio) continue;

		for (var x = 0; x < zoneAddition + 1; x++) {
			if (game.global.world === world || ((game.global.world - world) % currSetting.repeatevery === 0)) {
				settingIndex = y;
				break;
			}
			world += zoneAddition;
		}
		if (settingIndex >= 0) break;
	}

	if (settingIndex >= 0) {
		var setting = baseSettings[settingIndex];
		var mapLevel = setting.level;
		var mapSpecial = setting.special;
		var repeatCounter = setting.repeat;
		if (repeatCounter === -1) repeatCounter = Infinity;
		var jobRatio = setting.jobratio;
		var shouldAtlantrimp = !game.mapUnlocks.AncientTreasure.canRunOnce ? false : setting.atlantrimp;
		var gather = setting.gather;
		var mapType = setting.mapType;
		var repeatCheck =
			mapType === 'Daily Reset' ? updateDailyClock(true).split(':').reduce((acc, time) => (60 * acc) + +time) :
				mapType === 'Portal Time' ? (getGameTime() - game.global.portalTime) / 1000 :
					game.global.mapRunCounter;

		if (setting.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeats !== 0) {
				game.global.mapRunCounter = MODULES.maps.mapRepeats;
				MODULES.maps.mapRepeats = 0;
			}

			var autoLevel_Repeat = mapSettings.levelCheck;
			mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, null, null);
			if (mapAutoLevel !== Infinity) {
				if (autoLevel_Repeat !== Infinity && mapAutoLevel !== autoLevel_Repeat) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
				mapLevel = mapAutoLevel;
			}
		}

		var repeatNumber = repeatCounter === Infinity ? '∞' : repeatCounter;
		if (mapType === 'Portal Time' || mapType === 'Daily Reset') {
			repeatCounter = repeatCounter.split(':').reduce((acc, time) => (60 * acc) + +time);
		}

		//When running Wither make sure map level is lower than 0 so that we don't accumulate extra stacks.
		if (challengeActive('Wither') && mapLevel >= 0)
			mapLevel = -1;
		//If you're running Transmute and the mapSpecial variable is either LMC or SMC it changes it to LSC/SSC.
		mapSpecial = (getAvailableSpecials(mapSpecial))

		if (mapType === 'Daily Reset' ? repeatCounter < repeatCheck : repeatCounter > repeatCheck)
			shouldMap = true;

		//Marking setting as complete if we've run enough maps.
		if (mapSettings.mapName === mapName && (mapType === 'Daily Reset' ? repeatCheck <= repeatCounter : repeatCheck >= repeatCounter)) {
			mappingDetails(mapName, mapLevel, mapSpecial);
			resetMapVars(setting);
			shouldMap = false;
			if (shouldAtlantrimp) runUniqueMap('Atlantrimp');
			saveSettings();
		}
		var repeat = repeatCheck + 1 === repeatCounter;
		var status = 'Map Farm: ' +
			(mapType === 'Daily Reset' ? (setting.repeat + ' / ' + updateDailyClock(true)) :
				mapType === 'Portal Time' ? (formatSecondsAsClock((getGameTime() - game.global.portalTime) / 1000, 4 - setting.repeat.split(':').length) + ' / ' + setting.repeat) :
					(repeatCheck + "/" + repeatNumber));

		farmingDetails.shouldRun = shouldMap;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = mapLevel;
		farmingDetails.autoLevel = setting.autoLevel;
		farmingDetails.jobRatio = jobRatio;
		farmingDetails.special = mapSpecial;
		farmingDetails.mapType = mapType;
		farmingDetails.mapRepeats = repeatCounter;
		farmingDetails.gather = gather;
		farmingDetails.runAtlantrimp = shouldAtlantrimp;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;
		farmingDetails.settingIndex = settingIndex;
	}

	return farmingDetails;
}

function tributeFarm() {

	var shouldMap = false;
	var mapAutoLevel = Infinity;
	const mapName = 'Tribute Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	const baseSettings = getPageSetting('tributeFarmSettings');
	const defaultSettings = baseSettings ? baseSettings[0] : null;
	if (defaultSettings === null) return farmingDetails;

	if (!defaultSettings.active || (game.buildings.Tribute.locked && game.jobs.Meteorologist.locked)) return farmingDetails;

	const dailyAddition = dailyOddOrEven();
	const zoneAddition = dailyAddition.active ? 1 : 0;

	var settingIndex;

	for (var y = 0; y < baseSettings.length; y++) {
		if (y === 0) continue;
		var currSetting = baseSettings[y];
		var world = currSetting.world;
		if (dailyAddition.active) {
			if (dailyAddition.skipZone) continue;
			if (!settingShouldRun(currSetting, world, 0) && !settingShouldRun(currSetting, world, zoneAddition)) continue;
		}
		else if (!settingShouldRun(currSetting, world, 0)) continue;

		for (var x = 0; x < zoneAddition + 1; x++) {
			if (game.global.world === world || ((game.global.world - world) % currSetting.repeatevery === 0)) {
				settingIndex = y;
				break;
			}
			world += zoneAddition;
		}
		if (settingIndex >= 0) break;
	}

	if (settingIndex >= 0) {
		//Initialing variables
		var setting = baseSettings[settingIndex];
		var mapLevel = setting.level;
		var tributeGoal = game.buildings.Tribute.locked === 1 ? 0 : setting.tributes;
		var meteorologistGoal = game.jobs.Meteorologist.locked === 1 ? 0 : setting.mets;
		var mapSpecial = getAvailableSpecials('lsc', true);
		var biome = getBiome(null, 'Sea');
		var jobRatio = setting.jobratio;
		var shouldBuyBuildings = setting.buildings;
		var shouldAtlantrimp = !game.mapUnlocks.AncientTreasure.canRunOnce ? false : setting.atlantrimp;

		//AutoLevel code.
		if (setting.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeats !== 0) {
				game.global.mapRunCounter = MODULES.maps.mapRepeats;
				MODULES.maps.mapRepeats = 0;
			}
			var autoLevel_Repeat = mapSettings.levelCheck;
			mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, null, null);
			if (mapAutoLevel !== Infinity) {
				if (autoLevel_Repeat !== Infinity && mapAutoLevel !== autoLevel_Repeat) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
				mapLevel = mapAutoLevel;
			}
		}

		if (challengeActive('Wither') && mapLevel >= 0)
			mapLevel = -1;

		//When mapType is set as Map Count work out how many Tributes/Mets we can farm in the amount of maps specified.
		if (setting.mapType === 'Map Count') {
			if (tributeGoal !== 0) {
				var tributeMaps = mapSettings.mapName === mapName ? tributeGoal - game.global.mapRunCounter : tributeGoal;
				var tributeTime = tributeMaps * 25;
				if (tributeMaps > 4) tributeTime += (Math.floor(tributeMaps / 5) * 45);
				var foodEarnedTributes = game.resources.food.owned + scaleToCurrentMap_AT(simpleSeconds_AT("food", tributeTime, jobRatio), false, true, mapLevel);
				tributeGoal = game.buildings.Tribute.purchased + calculateMaxAfford_AT(game.buildings.Tribute, true, false, false, false, 1, foodEarnedTributes);
			}
			if (meteorologistGoal !== 0) {
				var meteorologistTime = (mapSettings.mapName === mapName ? meteorologistGoal - game.global.mapRunCounter : meteorologistGoal) * 25;
				if (meteorologistGoal > 4) meteorologistTime += (Math.floor(meteorologistGoal / 5) * 45);
				var foodEarnedMets = game.resources.food.owned + scaleToCurrentMap_AT(simpleSeconds_AT("food", meteorologistTime, jobRatio), false, true, mapLevel);
				meteorologistGoal = game.jobs.Meteorologist.owned + calculateMaxAfford_AT(game.jobs.Meteorologist, false, false, true, false, 1, foodEarnedMets);
			}
		}

		if (tributeGoal > game.buildings.Tribute.purchased || meteorologistGoal > game.jobs.Meteorologist.owned) {
			shouldMap = true;
		}

		if (shouldMap && tributeGoal > game.buildings.Tribute.purchased && !getPageSetting('buildingsType')) buyTributes();

		//Figuring out if we have enough resources to run Atlantrimp when setting is enabled.
		if (shouldAtlantrimp && (shouldMap) && (game.global.world > 33 || (game.global.world === 33 && game.global.lastClearedCell + 2 > 50))) {
			var tributeCost = 0;
			var metCost = 0;

			if (tributeGoal > game.buildings.Tribute.purchased) {
				for (var x = 0; x < tributeGoal - game.buildings.Tribute.purchased; x++) {
					tributeCost += Math.pow(1.05, game.buildings.Tribute.purchased) * 10000;
				}
			}
			if (meteorologistGoal > game.jobs.Meteorologist.owned) {
				for (var x = 0; x < meteorologistGoal - game.jobs.Meteorologist.owned; x++) {
					metCost += Math.pow(game.jobs.Meteorologist.cost.food[1], game.jobs.Meteorologist.owned + x) * game.jobs.Meteorologist.cost.food[0];
				}
			}
			var totalTrFCost = tributeCost + metCost;

			var barnCost = 0;
			if (totalTrFCost > (game.resources.food.max * (1 + (game.portal.Packrat.modifier * game.portal.Packrat.radLevel))))
				barnCost += game.buildings.Barn.cost.food();
			totalTrFCost += barnCost;

			//Figuring out how much Food we'd farm in the time it takes to run Atlantrimp. Seconds is 165 due to avg of 5x caches (20s per), 4x chronoimps (5s per), 1x jestimp (45s)
			var resourceFarmed = scaleToCurrentMap_AT(simpleSeconds_AT("food", 165, jobRatio), false, true, mapLevel);

			if ((totalTrFCost > game.resources.food.owned - barnCost + resourceFarmed) && game.resources.food.owned > totalTrFCost / 2) {
				runUniqueMap('Atlantrimp');
			}
		}
		//Recycles map if we don't need to finish it for meeting the tribute/meteorologist requirements
		if (mapSettings.mapName === mapName && !shouldMap) {
			mappingDetails(mapName, mapLevel, mapSpecial, tributeGoal, meteorologistGoal);
			resetMapVars(setting);
			if (game.global.mapsActive) recycleMap_AT();
			shouldBuyBuildings = false;
			return farmingDetails;
		}

		var status = tributeGoal > game.buildings.Tribute.owned ?
			'Tribute Farm: ' + game.buildings.Tribute.owned + "/" + tributeGoal :
			'Meteorologist Farm: ' + game.jobs.Meteorologist.owned + "/" + meteorologistGoal;

		farmingDetails.shouldRun = shouldMap;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = mapLevel;
		farmingDetails.autoLevel = setting.autoLevel;
		farmingDetails.jobRatio = jobRatio;
		farmingDetails.special = mapSpecial;
		farmingDetails.biome = biome;
		farmingDetails.shouldTribute = tributeGoal > game.buildings.Tribute.purchased;
		farmingDetails.tribute = tributeGoal;
		farmingDetails.shouldMeteorologist = meteorologistGoal > game.jobs.Meteorologist.owned;
		farmingDetails.meteorologist = meteorologistGoal;
		farmingDetails.runAtlantrimp = shouldAtlantrimp;
		farmingDetails.buyBuildings = shouldBuyBuildings;
		farmingDetails.repeat = true;
		farmingDetails.status = status;
		farmingDetails.settingIndex = settingIndex;
	}

	return farmingDetails;
}

function smithyFarm() {

	var shouldMap = false;
	var mapAutoLevel = Infinity;
	const mapName = 'Smithy Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	const baseSettings = getPageSetting('smithyFarmSettings');
	const defaultSettings = baseSettings ? baseSettings[0] : null;
	if (defaultSettings === null) return farmingDetails;

	if (game.buildings.Smithy.locked) return farmingDetails;
	if (challengeActive('Transmute') || challengeActive('Pandemonium')) return farmingDetails;
	if (!defaultSettings.active && !challengeActive('Quest')) return farmingDetails;
	if (challengeActive('Quest') && (currQuest() !== 10 && !(game.global.world >= getPageSetting('questSmithyZone') && defaultSettings.active))) return farmingDetails;

	var shouldSmithyGemFarm = false;
	var shouldSmithyWoodFarm = false;
	var shouldSmithyMetalFarm = false;

	const dailyAddition = dailyOddOrEven();
	const zoneAddition = dailyAddition.active ? 1 : 0;

	var settingIndex;

	for (var y = 0; y < baseSettings.length; y++) {
		if (y === 0) continue;
		var currSetting = baseSettings[y];
		var world = currSetting.world;
		if (dailyAddition.active) {
			if (dailyAddition.skipZone) continue;
			if (!settingShouldRun(currSetting, world, 0) && !settingShouldRun(currSetting, world, zoneAddition)) continue;
		}
		else if (!settingShouldRun(currSetting, world, 0)) continue;

		for (var x = 0; x < zoneAddition + 1; x++) {
			if (game.global.world === world || ((game.global.world - world) % currSetting.repeatevery === 0)) {
				settingIndex = y;
				break;
			}
			world += zoneAddition;
		}
		if (settingIndex >= 0) break;
	}

	if (settingIndex >= 0 || currQuest() === 10) {

		var mapBonus;
		if (game.global.mapsActive) mapBonus = getCurrentMapObject().bonus;

		var rSFSettings = baseSettings[settingIndex];
		var mapLevel = challengeActive('Quest') ? -1 : rSFSettings.level;
		var mapSpecial = getAvailableSpecials('lmc', true);
		var biome = getBiome();
		var jobRatio = '0,0,0,0';
		var smithyGoal = challengeActive('Quest') && currQuest() === 10 ? getPageSetting('questSmithyMaps') : rSFSettings.repeat;

		if (currQuest() === 10 || rSFSettings.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeatsSmithy !== [0, 0, 0] && typeof getCurrentMapObject().bonus !== 'undefined') {
				if (mapBonus === 'lsc' || mapBonus === 'ssc') game.global.mapRunCounter = MODULES.maps.mapRepeatsSmithy[0];
				else if (mapBonus === 'lwc' || mapBonus === 'swc') game.global.mapRunCounter = MODULES.maps.mapRepeatsSmithy[1];
				else if (mapBonus === 'lmc' || mapBonus === 'smc') game.global.mapRunCounter = MODULES.maps.mapRepeatsSmithy[2];
			}

			var autoLevel_Repeat = mapSettings.levelCheck;
			mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, null, null);
			if (mapAutoLevel !== Infinity) {
				if (autoLevel_Repeat !== Infinity && mapAutoLevel !== autoLevel_Repeat) {
					if (game.global.mapsActive && typeof mapBonus !== 'undefined') {
						if (mapBonus === 'lsc' || mapBonus === 'ssc') MODULES.maps.mapRepeatsSmithy[0] = (game.global.mapRunCounter + 1);
						else if (mapBonus === 'lwc' || mapBonus === 'swc') MODULES.maps.mapRepeatsSmithy[1] = (game.global.mapRunCounter + 1);
						else if (mapBonus === 'lmc' || mapBonus === 'smc') MODULES.maps.mapRepeatsSmithy[2] = (game.global.mapRunCounter + 1);
					}
				}
				mapLevel = mapAutoLevel;
			}
		}
		if (challengeActive('Wither') && mapLevel >= 0)
			mapLevel = -1;

		//Initialising base food & metal vars for calcs later on
		var woodBase = scaleToCurrentMap_AT(simpleSeconds_AT("wood", 1, '0,1,0'), false, true, mapLevel);
		var metalBase = scaleToCurrentMap_AT(simpleSeconds_AT("metal", 1, '0,0,1'), false, true, mapLevel);

		//When mapType is set as Map Count work out how many Smithies we can farm in the amount of maps specified.
		if ((currQuest() === 10 || rSFSettings.mapType === 'Map Count') && smithyGoal !== 0) {
			var smithyCount = 0;
			//Checking total map count user wants to run
			var totalMaps = mapSettings.mapName === mapName ? smithyGoal - game.global.mapRunCounter : smithyGoal;
			//Calculating cache + jestimp + chronoimp
			var mapTime = totalMaps * 25;
			if (totalMaps > 4) mapTime += (Math.floor(totalMaps / 5) * 45);
			var smithy_Cost_Mult = game.buildings.Smithy.cost.gems[1];

			//Calculating wood & metal earned then using that info to identify how many Smithies you can afford from those values.
			var woodEarned = woodBase * mapTime;
			var metalEarned = metalBase * mapTime;
			var woodSmithies = game.buildings.Smithy.purchased + getMaxAffordable(Math.pow((smithy_Cost_Mult), game.buildings.Smithy.owned) * game.buildings.Smithy.cost.wood[0], (game.resources.wood.owned + woodEarned), (smithy_Cost_Mult), true);
			var metalSmithies = game.buildings.Smithy.purchased + getMaxAffordable(Math.pow((smithy_Cost_Mult), game.buildings.Smithy.owned) * game.buildings.Smithy.cost.wood[0], (game.resources.metal.owned + metalEarned), (smithy_Cost_Mult), true);

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
				if ((rSFWoodMapCount + rSFMetalMapCount) > smithyGoal) smithyGoal = smithyCount - 1
				else smithyGoal = smithyCount;
			}
			else smithyGoal = 1;
		}

		resourceGoal = 0;
		var smithyGemCost = getBuildingItemPrice(game.buildings.Smithy, 'gems', false, smithyGoal - game.buildings.Smithy.purchased);
		var smithyWoodCost = getBuildingItemPrice(game.buildings.Smithy, 'wood', false, smithyGoal - game.buildings.Smithy.purchased);
		var smithyMetalCost = getBuildingItemPrice(game.buildings.Smithy, 'metal', false, smithyGoal - game.buildings.Smithy.purchased);

		if (smithyGoal > game.buildings.Smithy.purchased) {
			if (smithyWoodCost > game.resources.wood.owned) {
				shouldSmithyWoodFarm = true;
				mapSpecial = getAvailableSpecials('lwc', true);
				biome = getBiome(null, 'Forest');
				jobRatio = '0,1,0,0';
				resourceGoal = prettify(smithyWoodCost) + ' wood.';
			}
			else if (smithyMetalCost > game.resources.metal.owned) {
				shouldSmithyMetalFarm = true;
				mapSpecial = getAvailableSpecials('lmc', true);
				biome = getBiome(null, 'Mountain');
				jobRatio = '0,0,1,0';
				resourceGoal = prettify(smithyMetalCost) + ' metal.';
			}
			else if (smithyGemCost > game.resources.gems.owned) {
				shouldSmithyGemFarm = true;
				mapSpecial = getAvailableSpecials('lsc', true);
				biome = getBiome(null, 'Sea');
				jobRatio = '1,0,0,0';
				resourceGoal = prettify(smithyGemCost) + ' gems.';
			}
			shouldMap = true;
		}

		//Overrides to purchase smithies under the following circumstances
		//1. If the user has either the AT AutoStructure setting OR the AT AutoStructure Smithy setting disabled.
		//2. If the user is running Hypothermia and is specifically Smithy Farming.
		if ((!getPageSetting('buildingsType') || !getPageSetting('buildingSettingsArray').Smithy.enabled || challengeActive('Hypothermia')) && shouldMap && smithyGoal > game.buildings.Smithy.purchased && canAffordBuilding('Smithy', false, false, false, false, 1)) {
			buyBuilding("Smithy", true, true, 1);
		}

		//Recycles map if we don't need to finish it for meeting the farm requirements
		if (mapSettings.mapName === mapName) {
			if (getPageSetting('autoMaps') && game.global.mapsActive && typeof mapBonus !== 'undefined' && ((!shouldSmithyGemFarm && mapBonus.includes('sc')) || (!shouldSmithyWoodFarm && mapBonus.includes('wc')) || (!shouldSmithyMetalFarm && mapBonus.includes('mc')))) {
				var mapProg = game.global.mapsActive ? ((getCurrentMapCell().level - 1) / getCurrentMapObject().size) : 0;
				var mappingLength = (mapProg > 0 ? Number(((game.global.mapRunCounter + mapProg)).toFixed(2)) : game.global.mapRunCounter);
				if (mapBonus === 'lsc' || mapBonus === 'ssc') MODULES.maps.mapRepeatsSmithy[0] = mappingLength;
				else if (mapBonus === 'lwc' || mapBonus === 'swc') MODULES.maps.mapRepeatsSmithy[1] = mappingLength;
				else if (mapBonus === 'lmc' || mapBonus === 'smc') MODULES.maps.mapRepeatsSmithy[2] = mappingLength;
				recycleMap_AT();
			}
			if (!shouldMap) {
				mappingDetails(mapName, mapLevel, mapSpecial, smithyGoal);
				MODULES.maps.mapRepeatsSmithy = [0, 0, 0];
				if (!challengeActive('Quest') && rSFSettings.meltingPoint) runUniqueMap('Melting Point');
				resetMapVars(rSFSettings);
				return farmingDetails;
			}
		}

		var status = 'Smithy Farming for ' + resourceGoal;

		farmingDetails.shouldRun = shouldMap;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = mapLevel;
		farmingDetails.autoLevel = currQuest() === 10 ? true : rSFSettings.autoLevel;
		farmingDetails.jobRatio = jobRatio;
		farmingDetails.special = mapSpecial;
		farmingDetails.biome = biome;
		farmingDetails.smithies = smithyGoal;
		farmingDetails.gemFarm = shouldSmithyGemFarm;
		farmingDetails.repeat = true;
		farmingDetails.status = status;
		farmingDetails.settingIndex = settingIndex;

		if (!shouldMap) resetMapVars(rSFSettings);
	}
	return farmingDetails;
}

function worshipperFarm() {

	var shouldMap = false;
	var mapAutoLevel = Infinity;
	const mapName = 'Worshipper Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	const baseSettings = getPageSetting('worshipperFarmSettings');
	const defaultSettings = baseSettings ? baseSettings[0] : null;
	if (defaultSettings === null) return farmingDetails;

	if (game.jobs.Worshipper.locked || !defaultSettings.active) return farmingDetails;
	const dailyAddition = dailyOddOrEven();
	const zoneAddition = dailyAddition.active ? 1 : 0;

	var shouldSkip = false;

	var settingIndex;

	for (var y = 0; y < baseSettings.length; y++) {
		if (y === 0) continue;
		var currSetting = baseSettings[y];
		var world = currSetting.world;
		if (dailyAddition.active) {
			if (dailyAddition.skipZone) continue;
			if (!settingShouldRun(currSetting, world, 0) && !settingShouldRun(currSetting, world, zoneAddition)) continue;
		}
		else if (!settingShouldRun(currSetting, world, 0)) continue;

		for (var x = 0; x < zoneAddition + 1; x++) {
			if (game.global.world === world || ((game.global.world - world) % currSetting.repeatevery === 0)) {
				settingIndex = y;
				break;
			}
			world += zoneAddition;
		}
		if (settingIndex >= 0) break;
	}

	if (settingIndex >= 0) {
		var setting = baseSettings[settingIndex];
		var worshipperGoal = setting.worshipper;
		var mapLevel = setting.level;
		var jobRatio = setting.jobratio;
		var mapSpecial = getAvailableSpecials('lsc', true);
		var biome = getBiome(null, 'Sea');

		if (setting.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeats !== 0) {
				game.global.mapRunCounter = MODULES.maps.mapRepeats;
				MODULES.maps.mapRepeats = 0;
			}
			var autoLevel_Repeat = mapSettings.levelCheck;
			mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, null, null);
			if (mapAutoLevel !== Infinity) {
				if (autoLevel_Repeat !== Infinity && mapAutoLevel !== autoLevel_Repeat) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
				mapLevel = mapAutoLevel;
			}
		}

		if (challengeActive('Wither') && mapLevel >= 0) mapLevel = -1;
		if (defaultSettings.shipSkipEnabled && game.jobs.Worshipper.owned !== 50 && (scaleToCurrentMap_AT(simpleSeconds_AT("food", 20, jobRatio), false, true, mapLevel) < (game.jobs.Worshipper.getCost() * defaultSettings.shipskip))) {
			shouldSkip = true;
		}

		if (game.jobs.Worshipper.owned !== 50 && worshipperGoal > game.jobs.Worshipper.owned)
			shouldMap = true;



		if (((mapSettings.mapName === mapName && !shouldMap) || shouldSkip)) {
			if (!shouldSkip) mappingDetails(mapName, mapLevel, mapSpecial);
			if (getPageSetting('spamMessages').map_Skip && shouldSkip) {
				debug("Skipping Worshipper farming on zone " + game.global.world + " as 1 " + mapSpecial + " map doesn't provide " + defaultSettings.shipskip + " or more Worshippers. Evaluate your map settings to correct this", 'map_Skip');
			}
			resetMapVars(setting);
		}

		if (mapSettings.mapName === mapName && !shouldMap) {
			mappingDetails(mapName, mapLevel, mapSpecial);
			resetMapVars(setting);
		}

		var status = 'Worshipper Farm: ' + game.jobs.Worshipper.owned + "/" + worshipperGoal;

		farmingDetails.shouldRun = shouldMap;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = mapLevel;
		farmingDetails.autoLevel = setting.autoLevel;
		farmingDetails.jobRatio = jobRatio;
		farmingDetails.special = mapSpecial;
		farmingDetails.biome = biome;
		farmingDetails.worshipper = worshipperGoal;
		farmingDetails.repeat = true;
		farmingDetails.status = status;
		farmingDetails.settingIndex = settingIndex;
		farmingDetails.gather = 'food';

	}
	return farmingDetails;
}

//Daily (bloodthirst), Balance, Unbalance & Storm Destacking
function mapDestacking() {

	const mapName = 'Destacking';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (
		!(getPageSetting('balance') && challengeActive('Balance')) &&
		!(getPageSetting('unbalance') && challengeActive('Unbalance')) &&
		!(getPageSetting('storm') && challengeActive('Storm')) &&
		!(challengeActive('Daily') && getPageSetting('bloodthirstDestack') && typeof game.global.dailyChallenge.bloodthirst !== 'undefined')
	)
		return farmingDetails;

	var shouldMap = false;
	var mapLevel = -(game.global.world - 6);
	var mapSpecial = getAvailableSpecials('fa');
	var destackValue = 0;

	//Balance Destacking
	if (challengeActive('Balance')) {
		var balanceZone = getPageSetting('balanceZone') > 0 ? getPageSetting('balanceZone') : Infinity;
		var balanceStacks = getPageSetting('balanceStacks') > 0 ? getPageSetting('balanceStacks') : Infinity;
		shouldMap = ((gammaMaxStacks(true) - game.heirlooms.Shield.gammaBurst.stacks !== 0) && game.global.world >= balanceZone && (game.challenges.Balance.balanceStacks >= balanceStacks || (getPageSetting('balanceImprobDestack') && game.global.lastClearedCell + 2 === 100 && game.challenges.Balance.balanceStacks !== 0)));
		destackValue = game.challenges.Balance.balanceStacks;
	}

	//Unbalance Destacking
	if (challengeActive('Unbalance')) {
		var unbalanceZone = getPageSetting('unbalanceZone') > 0 ? getPageSetting('unbalanceZone') : Infinity;
		var unbalanceStacks = getPageSetting('unbalanceStacks') > 0 ? getPageSetting('unbalanceStacks') : Infinity;
		shouldMap = ((gammaMaxStacks(true) - game.heirlooms.Shield.gammaBurst.stacks !== 0) && game.global.world >= unbalanceZone && (game.challenges.Unbalance.balanceStacks >= unbalanceStacks || (getPageSetting('unbalanceImprobDestack') && game.global.lastClearedCell + 2 === 100 && game.challenges.Unbalance.balanceStacks !== 0)));
		destackValue = game.challenges.Unbalance.balanceStacks;
	}

	//Bloodthirst Destacking
	if (challengeActive('Daily') && !game.global.mapsActive && game.global.dailyChallenge.bloodthirst.stacks >= dailyModifiers.bloodthirst.getFreq(game.global.dailyChallenge.bloodthirst.strength) - 1) {
		shouldMap = true;
		destackValue = game.global.dailyChallenge.bloodthirst.stacks;
	}

	//Storm Destacking
	if (challengeActive('Storm')) {
		var stormZone = getPageSetting('stormZone') > 0 ? getPageSetting('stormZone') : Infinity;
		var stormStacks = getPageSetting('stormStacks') > 0 ? getPageSetting('stormStacks') : Infinity;
		shouldMap = (game.global.world >= stormZone && (game.challenges.Storm.beta >= stormStacks && game.challenges.Storm.beta !== 0));
		destackValue = game.challenges.Storm.beta;
	}

	//Setting up variable for challengeContinueRunning to run maps until we reach 0 stacks
	if (!MODULES.mapFunctions.challengeContinueRunning && shouldMap && game.global.mapsActive && destackValue > 0) MODULES.mapFunctions.challengeContinueRunning = true;

	//Recycling maps if we have 0 stacks
	if (game.global.mapsActive && getCurrentMapObject().level === 6 &&
		(
			(challengeActive('Balance') && !shouldMap && game.challenges.Balance.balanceStacks === 0) ||
			(challengeActive('Daily') && !shouldMap && game.global.dailyChallenge.bloodthirst.stacks === 0) ||
			(challengeActive('Unbalance') && !shouldMap && game.challenges.Unbalance.balanceStacks === 0) ||
			(challengeActive('Storm') && !shouldMap && game.challenges.Storm.beta === 0)
		)
	) {
		MODULES.mapFunctions.challengeContinueRunning = false;
		recycleMap_AT();
	}

	//Force mapping if we are in a map and haven't yet reached 0 stacks.
	if (MODULES.mapFunctions.challengeContinueRunning) shouldMap = true;

	var repeat = game.global.mapsActive && (getCurrentMapObject().size - getCurrentMapCell().level) > destackValue;

	var status = 'Destacking: ' + destackValue + ' stacks remaining';

	farmingDetails.shouldRun = shouldMap;
	farmingDetails.mapName = mapName;
	farmingDetails.mapLevel = mapLevel;
	farmingDetails.autoLevel = false;
	farmingDetails.special = mapSpecial;
	farmingDetails.destack = destackValue;
	farmingDetails.repeat = !repeat;
	farmingDetails.status = status;


	return farmingDetails;
}

function prestigeRaiding() {

	var shouldMap = false;
	const mapName = 'Prestige Raiding'
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	const baseSettings = getPageSetting('raidingSettings');
	const defaultSettings = baseSettings ? baseSettings[0] : null;
	if (defaultSettings === null) return farmingDetails;

	if (!defaultSettings.active) return farmingDetails;


	var settingIndex;

	for (var y = 0; y < baseSettings.length; y++) {
		if (y === 0) continue;
		const currSetting = baseSettings[y];
		var targetPrestige = challengeActive('Mapology') && getPageSetting('mapology') ? autoTrimpSettings['mapologyPrestige'].selected : currSetting.prestigeGoal !== 'All' ? MODULES.equipment[currSetting.prestigeGoal].upgrade : 'GamesOP';
		var raidZones = currSetting.raidingzone;

		var world = currSetting.world;
		if (!settingShouldRun(currSetting, world, 0)) continue;
		//Checks to see what our raid zone should be
		if (currSetting.repeatevery !== 0 && game.global.world > currSetting.world) {
			var times = currSetting.repeatevery;
			var repeats = Math.round((game.global.world - currSetting.world) / times);
			if (repeats > 0) raidZones += (times * repeats);
		}
		//Skips if we don't have the required prestige available.
		var equipsToFarm = equipsToGet(raidZones, targetPrestige)[0];
		if (equipsToFarm === 0) continue;
		if (game.global.world === currSetting.world || ((game.global.world - currSetting.world) % currSetting.repeatevery === 0)) {
			settingIndex = y;
			break;
		}
	}

	if (settingIndex >= 0) {
		//Setting up variables and checking if we should use daily settings instead of normal Prestige Farm settings
		var setting = baseSettings[settingIndex];
		var recycleMaps = defaultSettings.recycle;
		var fragSetting = setting.raidingDropdown;
		var incrementMaps = defaultSettings.incrementMaps;

		//Reduce raid zone to the value of the last prestige item we need to farm
		while (equipsToFarm === equipsToGet(raidZones - 1, targetPrestige)[0]) {
			raidZones--;
		}

		if (equipsToGet(raidZones, targetPrestige)[0] > 0) {
			shouldMap = true;
		}

		var mapSpecial = getAvailableSpecials('p');
		var status = 'Prestige Raiding: ' + equipsToGet(raidZones, targetPrestige)[0] + ' items remaining';

		if (mapSettings.prestigeFragMapBought) status = 'Prestige frag farm to: ' + prettify(prestigeTotalFragCost(raidZones, targetPrestige, mapSpecial, incrementMaps, true));

		var mapsToRun = game.global.mapsActive ? equipsToGet(getCurrentMapObject().level, targetPrestige)[1] : Infinity;
		var specialInMap = game.global.mapsActive && game.global.mapGridArray[getCurrentMapObject().size - 2].special === targetPrestige;

		var repeat = mapsToRun === 1 || (specialInMap && mapsToRun === 2);

		if (mapSettings.prestigeMapArray && mapSettings.prestigeMapArray[0] !== undefined && shouldMap) {
			if (game.global.mapsOwnedArray[getMapIndex(mapSettings.prestigeMapArray[0])] === undefined || (game.global.mapsActive && equipsToGet(getCurrentMapObject().level)[0] === 0)) {
				debug("There was an error with your purchased map(s). Restarting the raiding procedure.");
				delete mapSettings.prestigeMapArray;
			}
		}

		farmingDetails.shouldRun = shouldMap;
		farmingDetails.mapName = mapName;
		farmingDetails.autoLevel = false;
		farmingDetails.mapLevel = raidZones - game.global.world;
		farmingDetails.recycle = recycleMaps;
		farmingDetails.prestigeGoal = targetPrestige;
		farmingDetails.fragSetting = fragSetting;
		farmingDetails.raidzones = raidZones;
		farmingDetails.special = mapSpecial;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;
		farmingDetails.settingIndex = settingIndex;
		farmingDetails.incrementMaps = incrementMaps;
		if (mapSettings.prestigeMapArray) farmingDetails.prestigeMapArray = mapSettings.prestigeMapArray;
		if (mapSettings.prestigeFragMapBought) farmingDetails.prestigeFragMapBought = mapSettings.prestigeFragMapBought;
	}

	//Resetting variables and recycling the maps used
	if (!shouldMap && mapSettings.mapName === mapName) {
		mappingDetails(mapName, mapSettings.mapLevel, mapSettings.special);
		if (defaultSettings.recycle && game.global.preMapsActive && mapSettings.prestigeMapArray) {
			for (var x = 0; x < mapSettings.prestigeMapArray.length; x++) {
				recycleMap(getMapIndex(mapSettings.prestigeMapArray[x]));
			}
			delete mapSettings.prestigeMapArray;
		}
		resetMapVars();
	}

	return farmingDetails;
}

//Running Prestige Raid Code
function runPrestigeRaiding() {
	if (mapSettings.mapName !== 'Prestige Raiding') return;
	if (!getPageSetting('autoMaps')) return;
	var raidzones = mapSettings.raidzones;
	const targetPrestige = mapSettings.prestigeGoal
	const mapSpecial = mapSettings.special;
	const incrementMaps = mapSettings.incrementMaps;

	//Initialising prestigeMapArray if it doesn't exist. This is used to store the maps we buy so we can run them later.
	if (!mapSettings.prestigeMapArray) mapSettings.prestigeMapArray = new Array(5);
	if (!mapSettings.prestigeFragMapBought) mapSettings.prestigeFragMapBought = false;

	const canAffordMaps = prestigeTotalFragCost(raidzones, targetPrestige, mapSpecial, incrementMaps);

	if (mapSettings.prestigeMapArray[0] === undefined) {
		if (canAffordMaps) {
			if (mapSettings.prestigeFragMapBought) {
				if (game.global.repeatMap)
					repeatClicked();
				if (game.global.preMapsActive)
					mapSettings.prestigeFragMapBought = false;
			}
		}
		//If we can't afford the maps we need to farm fragments
		//Check if we can afford the fragment farming map and if so buy it and run it
		//Otherwise this will be stuck here ....forever?????
		else if (game.global.preMapsActive) {
			//Set sliders to appropriate levels for what we can currently afford.
			mapCost(game.talents.mapLoot.purchased ? -1 : 0, getAvailableSpecials('fa'), getBiome('fragments'), [9, 9, 9], false);
			//Buy and run the frag farming mao
			buyMap();
			selectMap(game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1].id);
			runMap();
			debug("Prestige Raiding running fragment farming map", "maps");
			mapSettings.prestigeFragMapBought = true;
		}
	}

	if (!mapSettings.prestigeFragMapBought && game.global.preMapsActive) {
		//Recycle maps if 5 below the map limit to ensure we can purchase maximum amount of maps we could need
		if (game.global.mapsOwnedArray.length >= 95) recycleBelow(true);
		//Misc UI stuff to have the user know what's going on if this fails somehow
		document.getElementById("mapLevelInput").value = game.global.world;
		incrementMapLevel(1);
		//Buy the maps we need IF we haven't already purchased them and prints out a message stating they've been bought
		//Should really say map level for this, right???
		if (mapSettings.prestigeMapArray[0] === undefined) {
			for (var x = 0; x < 5; x++) {
				if (!incrementMaps && x > 0) break;
				if (prestigeMapHasEquips(x, raidzones, targetPrestige)) {
					prestigeRaidingSliders(x, raidzones, mapSpecial);
					if ((updateMapCost(true) <= game.resources.fragments.owned)) {
						buyMap();
						var purchasedMap = game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1];
						mapSettings.prestigeMapArray[x] = purchasedMap.id;
						debug("Prestige Raiding" + " (z" + game.global.world + ") bought a level " + purchasedMap.level + " map. Purchase #" + [(x + 1)], "map_Details");
					}
				}
			}
			mapSettings.prestigeMapArray = mapSettings.prestigeMapArray.filter(function (e) { return e.replace(/(\r\n|\n|\r)/gm, "") });
		}

		for (var x = mapSettings.prestigeMapArray.length - 1; x > -1; x--) {
			if (game.global.preMapsActive && prestigeMapHasEquips(x, raidzones, targetPrestige)) {
				if (mapSettings.prestigeMapArray[x] !== undefined) {
					var purchasedMap = game.global.mapsOwnedArray[getMapIndex(mapSettings.prestigeMapArray[x])];
					if (purchasedMap === undefined) {
						debug("Prestige Raiding - Error with finding the purchased map. Skipping this map and moving on to the next one.");
						mapSettings.prestigeMapArray[x] = undefined;
						continue;
					}
					debug("Prestige Raiding" + " (z" + game.global.world + ") running a level " + (purchasedMap.level) + " map. Map #" + [(mapSettings.prestigeMapArray.length - x)], "map_Details");
					selectMap(mapSettings.prestigeMapArray[x]);
					runMap_AT();
				}
				//If errors occur then delete prestigeMapArray and attempt to start the raiding process again.
				//HOPEFULLY this fixes any potential issues that transpire due to my terrible coding.
				else {
					delete mapSettings.prestigeMapArray;
					debug("Prestige Raiding - Error with finding the purchased map. Restarting the raiding procedure.");
					return;
				}
			}
		}
	}

	if (game.global.preMapsActive)
		runMap_AT();
}

function prestigeClimb() {

	var shouldMap = false;
	const mapName = 'Prestige Climb';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName,
	};

	if (challengeActive('Frugal')) return farmingDetails;
	if (game.jobs.Explorer.locked) return farmingDetails;

	var targetPrestige = challengeActive('Mapology') && getPageSetting('mapology') ? getPageSetting('mapologyPrestige') : getPageSetting('Prestige');
	if (targetPrestige === "Off") return farmingDetails;


	const mapLevel = 0;

	//If we're past the zone we want to farm for all prestiges in then set targetPrestige to the highest prestige available.
	//equipsToGet will automatically change GambesOP to Breastplate if the Slow challenge has not yet been completed.
	if (getPageSetting('ForcePresZ') >= 0 && game.global.world >= getPageSetting('ForcePresZ')) {
		targetPrestige = 'GambesOP';
	}
	shouldMap = equipsToGet(game.global.world, targetPrestige)[0] > 0;

	//Figure out how many equips to farm for & maps to run to get to that value
	const prestigeInfo = equipsToGet(game.global.world, targetPrestige);
	const prestigeToFarmFor = prestigeInfo[0];
	const mapsToRun = prestigeInfo[1];

	//Prestige Skip
	//2 or more unbought prestiges
	if (shouldMap && getPageSetting('PrestigeSkip')) {
		const prestigeList = ['Dagadder', 'Bootboost', 'Megamace', 'Hellishmet', 'Polierarm', 'Pantastic', 'Axeidic', 'Smoldershoulder', 'Greatersword', 'Bestplate', 'Harmbalest', 'GambesOP'];
		var numUnbought = 0;
		//Loop through prestiges in upgrade window to check how many equips we have unbought prestiges for
		for (const p of prestigeList) {
			if (game.upgrades[p].allowed - game.upgrades[p].done > 0)
				numUnbought++;
		}
		//If there are 2 or more unbought prestiges in our upgrades window then disable prestige farming
		if (numUnbought >= 2)
			shouldMap = false;
	}

	const mapSpecial = getAvailableSpecials('p');

	if (mapSettings.mapName === mapName && !shouldMap) {
		mappingDetails(mapName, 0, mapSpecial);
		resetMapVars();
	}

	if (!shouldMap) return farmingDetails;

	if (game.options.menu.mapLoot.enabled !== 1) toggleSetting('mapLoot');
	const status = 'Prestige Climb: ' + prestigeToFarmFor + ' items remaining';

	const repeat = !(
		game.global.mapsActive && (
			mapsToRun > (getCurrentMapObject().bonus === 'p' && (game.global.lastClearedMapCell !== getCurrentMapObject().size - 2) ? 2 : 1))
	);

	farmingDetails.shouldRun = shouldMap;
	farmingDetails.mapName = mapName;
	farmingDetails.status = status;
	farmingDetails.repeat = !repeat;
	farmingDetails.mapLevel = mapLevel;
	farmingDetails.autoLevel = true;
	farmingDetails.special = mapSpecial;
	farmingDetails.prestigeToFarmFor = prestigeToFarmFor;
	farmingDetails.mapsToRun = mapsToRun;

	return farmingDetails;
}

function findLastBionicWithItems(bionicPool) {

	if (game.global.world < 115 || !bionicPool)
		return;
	if (challengeActive('Mapology') && !getPageSetting('mapology')) return;
	const targetPrestige = challengeActive('Mapology') && getPageSetting('mapology') ? autoTrimpSettings['mapologyPrestige'].selected : 'GambesOP';

	if (bionicPool.length > 1) {
		bionicPool.sort(function (bionicA, bionicB) { return bionicA.level - bionicB.level });
		while (bionicPool.length > 1 && equipsToGet(bionicPool[0].level, targetPrestige)[0] === 0) {
			if (challengeActive('Experience') && game.global.world > 600 && bionicPool[0].level >= getPageSetting('experienceEndBW')) break;
			bionicPool.shift();
			if (equipsToGet(bionicPool[0].level, targetPrestige)[0] !== 0) break;
		}
	}

	return bionicPool[0];
}

function bionicRaiding() {

	var shouldMap = false;
	const mapName = 'Bionic Raiding'
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	const baseSettings = getPageSetting('bionicRaidingSettings');
	const defaultSettings = baseSettings ? baseSettings[0] : null;
	if (defaultSettings === null) return farmingDetails;

	if (!defaultSettings.active) return farmingDetails;
	if (challengeActive('Experience') && game.global.world > 600) return farmingDetails;


	var settingIndex;

	for (var y = 0; y < baseSettings.length; y++) {
		if (y === 0) continue;
		const currSetting = baseSettings[y];
		var targetPrestige = challengeActive('Mapology') && getPageSetting('mapology') ? autoTrimpSettings['mapologyPrestige'].selected : currSetting.prestigeGoal !== 'All' ? MODULES.equipment[currSetting.prestigeGoal].upgrade : 'GamesOP';
		var raidZones = currSetting.raidingzone

		var world = currSetting.world;
		if (!settingShouldRun(currSetting, world, 0)) continue;

		if (currSetting.repeatevery !== 0 && game.global.world > currSetting.world) {
			var times = currSetting.repeatevery;
			var repeats = Math.round((game.global.world - currSetting.world) / times);
			if (repeats > 0) raidZones += (times * repeats);
		}
		if (equipsToGet(raidZones, targetPrestige)[0] === 0) continue;
		if (game.global.world === currSetting.world || ((game.global.world - currSetting.world) % currSetting.repeatevery === 0)) {
			settingIndex = y;
			break;
		}
	}

	if (settingIndex >= 0) {
		//Setting up variables and checking if we should use daily settings instead of normal Prestige Farm settings
		var rBionicRaidingSetting = baseSettings[settingIndex];
		var raidzonesBW = raidZones;

		if (equipsToGet(raidzonesBW, targetPrestige)[0] > 0) {
			shouldMap = true;
		}
		var status = 'Raiding to BW' + raidzonesBW + ': ' + equipsToGet(raidzonesBW, targetPrestige)[0] + ' items remaining';

		var mapsToRun = game.global.mapsActive ? equipsToGet(getCurrentMapObject().level, targetPrestige)[1] : Infinity;
		var specialInMap = game.global.mapsActive && game.global.mapGridArray[getCurrentMapObject().size - 2].special === targetPrestige;
		var repeat = (game.global.mapsActive &&
			(mapsToRun === 1 || (specialInMap && mapsToRun === 2) ||
				getCurrentMapObject().location !== 'Bionic')
		);

		farmingDetails.shouldRun = shouldMap;
		farmingDetails.mapName = mapName;
		farmingDetails.repeat = !repeat
		farmingDetails.raidingZone = raidzonesBW;
		farmingDetails.status = status;
		farmingDetails.settingIndex = settingIndex;
	}

	if (mapSettings.mapName === mapName && !shouldMap) {
		mappingDetails(mapName, 0);
		resetMapVars();
	}

	return farmingDetails;
}

function runBionicRaiding(bionicPool) {
	if (!bionicPool) return false;
	if (!getPageSetting('autoMaps')) return false;

	if (!game.global.preMapsActive && !game.global.mapsActive) {
		mapsClicked(true);
		if (!game.global.preMapsActive) {
			mapsClicked(true);
		}
	}

	const raidingZone = challengeActive('Experience') && game.global.world > 600 ? getPageSetting('experienceEndBW') : mapSettings.raidingZone
	if (game.global.preMapsActive) {
		selectMap(findLastBionicWithItems(bionicPool).id);
	}
	if ((findLastBionicWithItems(bionicPool).level >= raidingZone
		|| findLastBionicWithItems(bionicPool).level < raidingZone)
		&& game.global.preMapsActive) {
		runMap();
	}
}

function toxicity() {

	var shouldMap = false;
	const mapName = 'Toxicity';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	const baseSettings = getPageSetting('toxicitySettings');
	const defaultSettings = baseSettings ? baseSettings[0] : null;
	if (defaultSettings === null) return farmingDetails;

	if (!defaultSettings.active) return farmingDetails;
	if (!challengeActive('Toxicity')) return farmingDetails;
	var settingIndex;

	for (var y = 0; y < baseSettings.length; y++) {
		if (y === 0) continue;
		var currSetting = baseSettings[y];
		var world = currSetting.world;

		if (!settingShouldRun(currSetting, world, 0)) continue;

		if (game.global.world === world || ((game.global.world - world) % currSetting.repeatevery === 0)) {
			settingIndex = y;
			break;
		}
	}

	if (settingIndex !== null && settingIndex >= 0) {

		var setting = baseSettings[settingIndex];

		const currentStacks = game.challenges.Toxicity.stacks;
		const stackGoal = setting.repeat > 1500 ? 1500 : setting.repeat;
		const mapSpecial = getAvailableSpecials(setting.special);
		var mapLevel = setting.level;

		//AutoLevel code.
		if (setting.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeats !== 0) {
				game.global.mapRunCounter = MODULES.maps.mapRepeats;
				MODULES.maps.mapRepeats = 0;
			}
			var autoLevel_Repeat = mapSettings.levelCheck;
			mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, null, null);
			if (mapAutoLevel !== Infinity) {
				if (autoLevel_Repeat !== Infinity && mapAutoLevel !== autoLevel_Repeat) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
				mapLevel = mapAutoLevel;
			}
		}
		if (stackGoal > currentStacks) {
			shouldMap = true;
		}

		var cellsToClear = 0;
		if (game.global.mapsActive) {
			cellsToClear = getCurrentMapObject().size - getCurrentMapCell().level;
			cellsToClear = Math.ceil(cellsToClear / maxOneShotPower(true));
		}

		var repeat = game.global.mapsActive && cellsToClear > (stackGoal - currentStacks);
		var status = 'Toxicity: ' + currentStacks + '/' + stackGoal + ' stacks';

		if (mapSettings.mapName === mapName && !shouldMap) {
			mappingDetails(mapName, mapLevel, mapSpecial);
			resetMapVars();
			if (game.global.mapsActive) recycleMap_AT();
		}

		farmingDetails.shouldRun = shouldMap;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = mapLevel;
		farmingDetails.autoLevel = true;
		farmingDetails.special = mapSpecial;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;
		farmingDetails.stackGoal = stackGoal;
		farmingDetails.currentStacks = currentStacks;
		farmingDetails.cellsToClear = cellsToClear;

	}
	return farmingDetails;
}

function experience() {

	var shouldMap = false;
	var mapName = 'Experience';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Experience') || !getPageSetting('experience')) return farmingDetails;

	const wonderStartZone = getPageSetting('experienceStartZone') >= 300 ? getPageSetting('experienceStartZone') : Infinity;
	const mapSpecial = hdStats.hyperspeed ? "0" : "fa";
	const mapLevel = 0;
	var status = '';
	if (game.global.world >= wonderStartZone && game.global.world >= game.challenges.Experience.nextWonder) {
		shouldMap = true;
		status = 'Experience: Farming Wonders';
	}
	else {
		shouldMap = game.global.world > 600 && game.global.world >= (Math.max(605, getPageSetting('experienceEndZone')));
		if (shouldMap) mapName = 'Bionic Raiding';
		status = 'Experience: Ending Challenge';
	}
	var repeat = game.global.world < game.challenges.Experience.nextWonder;

	if (mapSettings.mapName === mapName && !shouldMap) {
		mappingDetails(mapName, mapLevel, mapSpecial);
		resetMapVars();
	}

	if (shouldMap) farmingDetails.shouldRun = shouldMap;
	farmingDetails.mapName = mapName;
	farmingDetails.mapLevel = mapLevel;
	farmingDetails.autoLevel = true;
	farmingDetails.special = mapSpecial;
	farmingDetails.repeat = !repeat;
	farmingDetails.status = status;

	return farmingDetails;
}

function wither() {

	var shouldMap = false;
	const mapName = 'Wither Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Wither') || !getPageSetting('wither')) return farmingDetails;
	if (game.challenges.Wither.healImmunity > 0) return farmingDetails;

	var mapAutoLevel = Infinity;
	var jobRatio = '0,0,1,0';
	var mapSpecial = getAvailableSpecials('lmc', true);

	if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeats !== 0) {
		game.global.mapRunCounter = MODULES.maps.mapRepeats;
		MODULES.maps.mapRepeats = 0;
	}

	var autoLevel_Repeat = mapSettings.levelCheck;
	mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, -1, null);
	if (mapAutoLevel !== Infinity) {
		if (autoLevel_Repeat !== Infinity && mapAutoLevel !== autoLevel_Repeat) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
		var mapLevel = mapAutoLevel;
	}

	//Gamma burst info
	var gammaToTrigger = gammaMaxStacks(true) - game.heirlooms.Shield.gammaBurst.stacks;
	var gammaDmg = MODULES.heirlooms.gammaBurstPct;
	var canGamma = gammaToTrigger <= 1 ? true : false;

	var cell = game.global.lastClearedCell + 2;
	var name = game.global.gridArray[(cell - 1)].name;
	var damageGoal = 4;

	var equalityAmt = equalityQuery(name, game.global.world, cell, 'world', 1, 'gamma');
	var ourDmg = calcOurDmg('min', equalityAmt, false, 'world', 'never', 0, false);
	var enemyHealth = calcEnemyHealthCore('world', game.global.world, cell, name, calcMutationHealth(game.global.world));

	//Checking if we can clear current zone.
	if (((ourDmg * (canGamma ? gammaDmg : 1)) * damageGoal) < enemyHealth) {
		shouldMap = true;
	}

	//Checking if we can clear next zone.
	if (cell === 100) {
		equalityAmt = equalityQuery(name, game.global.world + 1, 100, 'world', 1, 'gamma');
		ourDmg = calcOurDmg('min', equalityAmt, false, 'world', 'never', 0, false);
		enemyHealth = calcEnemyHealthCore('world', game.global.world + 1, 100, 'Improbability', calcMutationHealth(game.global.world + 1));
		//Checking if we can clear current zone.
		if ((ourDmg * damageGoal) < enemyHealth) {
			shouldMap = true;
		}
	}

	var damageTarget = enemyHealth / damageGoal;

	var status = 'Wither Farm: Curr&nbsp;Dmg:&nbsp;' + prettify(ourDmg) + " Goal&nbsp;Dmg:&nbsp;" + prettify(damageTarget);

	farmingDetails.shouldRun = shouldMap;
	farmingDetails.mapName = mapName;
	farmingDetails.mapLevel = mapLevel;
	farmingDetails.autoLevel = true;
	farmingDetails.special = mapSpecial;
	farmingDetails.jobRatio = jobRatio;
	farmingDetails.damageTarget = damageTarget;
	farmingDetails.repeat = true;
	farmingDetails.status = status;

	if (mapSettings.mapName === mapName && !farmingDetails.shouldRun) {
		mappingDetails(mapName, mapLevel, mapSpecial);
		resetMapVars();
	}

	return farmingDetails;
}

function quagmire() {

	var shouldMap = false;
	const mapName = 'Quagmire Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	const baseSettings = getPageSetting('quagmireSettings');
	const defaultSettings = baseSettings ? baseSettings[0] : null;
	if (defaultSettings === null) return farmingDetails;

	if (!challengeActive('Quagmire') || !defaultSettings.active) return farmingDetails;

	var settingIndex;
	//Checking to see if any lines are to be run.
	for (var y = 0; y < baseSettings.length; y++) {
		if (y === 0) continue;
		const currSetting = baseSettings[y];
		var world = currSetting.world;
		if (!settingShouldRun(currSetting, world, 0)) continue;

		if (game.global.world === currSetting.world) {
			settingIndex = y;
			break;
		}
	}

	if (settingIndex >= 0) {
		var setting = baseSettings[settingIndex];
		var jobRatio = setting.jobratio;
		bogTotal = 0;

		for (var i = 0; i < (settingIndex + 1); i++) {
			if (!baseSettings[i].active) continue;
			bogTotal += parseInt(baseSettings[i].bogs);
		}

		bogsToRun = 100 - bogTotal;

		if ((game.challenges.Quagmire.motivatedStacks > bogsToRun))
			shouldMap = true;

		if (mapSettings.mapName === mapName && !shouldMap) {
			mappingDetails(mapName);
			resetMapVars(setting);
		}

		var repeat = game.global.mapsActive && (getCurrentMapObject().name !== 'The Black Bog' || (game.challenges.Quagmire.motivatedStacks - bogsToRun) === 1);
		var status = 'Black Bogs: ' + (game.challenges.Quagmire.motivatedStacks - bogsToRun) + " remaining";

		farmingDetails.shouldRun = shouldMap;
		farmingDetails.mapName = mapName;
		farmingDetails.jobRatio = jobRatio;
		farmingDetails.bogs = bogsToRun;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;
		farmingDetails.settingIndex = settingIndex;
	}

	return farmingDetails;
}

function currQuest() {
	if (!challengeActive('Quest') || game.global.world < game.challenges.Quest.getQuestStartZone() || !getPageSetting('quest'))
		return 0;
	var questnotcomplete = game.challenges.Quest.getQuestProgress() !== "Quest Complete!";
	if (game.challenges.Quest.getQuestProgress() === "Failed!") return 0;
	//Resource multipliers
	else if (game.challenges.Quest.getQuestDescription().includes("food") && questnotcomplete) return 1;
	else if (game.challenges.Quest.getQuestDescription().includes("wood") && questnotcomplete) return 2;
	else if (game.challenges.Quest.getQuestDescription().includes("metal") && questnotcomplete) return 3;
	else if (game.challenges.Quest.getQuestDescription().includes("gems") && questnotcomplete) return 4;
	else if (game.challenges.Quest.getQuestDescription().includes("science") && questnotcomplete) return 5;
	//Everything else
	else if (game.challenges.Quest.getQuestDescription() === "Complete 5 Maps at Zone level" && questnotcomplete) return 6;
	else if (game.challenges.Quest.getQuestDescription() === "One-shot 5 world enemies" && questnotcomplete) return 7;
	else if (game.challenges.Quest.getQuestDescription() === "Don't let your shield break before Cell 100" && questnotcomplete) return 8;
	else if (game.challenges.Quest.getQuestDescription() === "Don't run a map before Cell 100") return 9;
	else if (game.challenges.Quest.getQuestDescription() === "Buy a Smithy" && questnotcomplete) return 10;
	else return 0;
}

function quest() {

	var mapAutoLevel = Infinity;
	var shouldQuest = 0;
	const mapName = 'Quest';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Quest') || !getPageSetting('quest') || game.global.world < game.challenges.Quest.getQuestStartZone()) return farmingDetails;

	shouldQuest = currQuest() === 1 ? 1 :
		currQuest() === 2 ? 2 :
			currQuest() === 3 ? 3 :
				currQuest() === 4 ? 4 :
					currQuest() === 5 ? 5 :
						currQuest() === 6 ? 6 :
							currQuest() === 7 && (calcOurDmg('min', 0, false, 'world', 'never') < calcEnemyHealthCore('world', game.global.world, 50, 'Turtlimp')) && !(game.portal.Tenacity.getMult() === Math.pow(1.4000000000000001, getPerkLevel("Tenacity") + getPerkLevel("Masterfulness"))) ? 7 :
								currQuest() === 8 ? 8 :
									currQuest() === 9 ? 9 :
										0;


	if (shouldQuest && shouldQuest !== 8) {
		var questArray = shouldQuest === 1 || shouldQuest === 4 ? ['lsc', '1'] : shouldQuest === 2 ? ['lwc', '0,1'] : shouldQuest === 3 || shouldQuest === 7 ? ['lmc', '0,0,1'] : shouldQuest === 5 ? ['fa', '0,0,0,1'] : ['fa', '1,1,1,0']
		var mapSpecial = questArray[0]
		var jobRatio = questArray[1];
		var questMax = shouldQuest === 6 ? 10 : null;
		var questMin = shouldQuest === 6 || (shouldQuest === 7 && game.global.mapBonus !== 10) ? 0 : null;
		var mapLevel = 0;

		if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeats !== 0) {
			game.global.mapRunCounter = MODULES.maps.mapRepeats;
			MODULES.maps.mapRepeats = 0;
		}
		var autoLevel_Repeat = mapSettings.levelCheck;
		mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, questMax, questMin);
		if (mapAutoLevel !== Infinity) {
			if (autoLevel_Repeat !== Infinity && mapAutoLevel !== autoLevel_Repeat) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
			mapLevel = mapAutoLevel;
		}

		var repeat = shouldQuest === 6 && (game.global.mapBonus >= 4 || (game.global.mapsActive && getCurrentMapObject().level - game.global.world < 0));

		var status = 'Questing: ' + game.challenges.Quest.getQuestProgress();

		farmingDetails.shouldRun = shouldQuest;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = mapLevel;
		farmingDetails.autoLevel = true;
		farmingDetails.special = mapSpecial;
		farmingDetails.jobRatio = jobRatio;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;

	}
	if (mapSettings.mapName === mapName && !farmingDetails.shouldRun) {
		mappingDetails(mapName);
		resetMapVars();
		if (game.global.mapsActive) mapsClicked(true);
		if (game.global.preMapsActive && game.global.currentMapId !== '') recycleMap_AT();
	}

	return farmingDetails;
}

function mayhem() {

	var mapAutoLevel = Infinity;
	var shouldMap = false;
	const mapName = 'Mayhem Destacking';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Mayhem') || !getPageSetting('mayhem')) return farmingDetails;


	var destackHits = getPageSetting('mayhemDestack') > 0 ? getPageSetting('mayhemDestack') : Infinity;
	var destackZone = getPageSetting('mayhemZone') > 0 ? getPageSetting('mayhemZone') : Infinity;
	var mapLevel = 0;
	var mayhemMapIncrease = getPageSetting('mayhemMapIncrease') > 0 ? getPageSetting('mayhemMapIncrease') : 0;
	var mapSpecial = hdStats.hyperspeed ? "lmc" : "fa";
	if (game.challenges.Mayhem.stacks > 0 && (hdStats.hdRatio > destackHits || game.global.world >= destackZone))
		shouldMap = true;

	if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeats !== 0) {
		game.global.mapRunCounter = MODULES.maps.mapRepeats;
		MODULES.maps.mapRepeats = 0;
	}
	var autoLevel_Repeat = mapSettings.levelCheck;
	mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, 10, (0 + mayhemMapIncrease));
	if (mapAutoLevel !== Infinity) {
		if (autoLevel_Repeat !== Infinity && mapAutoLevel !== autoLevel_Repeat) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
		mapLevel = mapAutoLevel;
	}

	var repeat = game.challenges.Mayhem.stacks <= mapLevel + 1;
	var status = 'Mayhem Destacking: ' + game.challenges.Mayhem.stacks + " remaining";

	farmingDetails.shouldRun = shouldMap;
	farmingDetails.mapName = mapName;
	farmingDetails.mapLevel = mapLevel;
	farmingDetails.autoLevel = true;
	farmingDetails.special = mapSpecial;
	farmingDetails.repeat = !repeat;
	farmingDetails.status = status;

	if (mapSettings.mapName === mapName && !farmingDetails.shouldRun) {
		mappingDetails(mapName, mapLevel, mapSpecial);
		resetMapVars();
	}
	return farmingDetails;
}

function insanity() {

	var mapAutoLevel = Infinity;
	var shouldMap = false;
	const mapName = 'Insanity Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	const baseSettings = getPageSetting('insanitySettings');
	const defaultSettings = baseSettings ? baseSettings[0] : null;
	if (defaultSettings === null) return farmingDetails;

	if (!challengeActive('Insanity') || !defaultSettings.active) return farmingDetails;

	var settingIndex;
	//Checking to see if any lines are to be run.
	for (var y = 0; y < baseSettings.length; y++) {
		if (y === 0) continue;
		const currSetting = baseSettings[y];
		var world = currSetting.world;
		if (!settingShouldRun(currSetting, world, 0)) continue;

		if (game.global.world === currSetting.world) {
			settingIndex = y;
			break;
		}
	}

	if (settingIndex >= 0) {

		var setting = baseSettings[settingIndex];
		var mapLevel = setting.level;
		var mapSpecial = setting.special;
		var insanityGoal = setting.insanity;
		var jobRatio = setting.jobratio;

		if (setting.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeats !== 0) {
				game.global.mapRunCounter = MODULES.maps.mapRepeats;
				MODULES.maps.mapRepeats = 0;
			}
			var autoLevel_Repeat = mapSettings.levelCheck;
			mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, null, null);
			if (mapAutoLevel !== Infinity) {
				if (autoLevel_Repeat !== Infinity && mapAutoLevel !== autoLevel_Repeat) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
				mapLevel = mapAutoLevel;
			}
		}

		if (insanityGoal > game.challenges.Insanity.maxInsanity)
			insanityGoal = game.challenges.Insanity.maxInsanity;
		if (insanityGoal > game.challenges.Insanity.insanity || (setting.destack && game.challenges.Insanity.insanity > insanityGoal))
			shouldMap = true;

		var repeat = insanityGoal <= game.challenges.Insanity.insanity;
		var status = 'Insanity Farming: ' + game.challenges.Insanity.insanity + "/" + insanityGoal;

		farmingDetails.shouldRun = shouldMap;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = mapLevel;
		farmingDetails.autoLevel = setting.autoLevel;
		farmingDetails.special = mapSpecial;
		farmingDetails.jobRatio = jobRatio;
		farmingDetails.insanity = insanityGoal;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;
		farmingDetails.settingIndex = settingIndex;

		if (mapSettings.mapName === mapName && !farmingDetails.shouldRun) {
			mappingDetails(mapName, mapLevel, mapSpecial, insanityGoal);
			resetMapVars(setting.done);
		}

	}

	return farmingDetails;
}

function pandemoniumDestack() {

	var shouldMap = false;
	var mapAutoLevel = Infinity;
	const mapName = 'Pandemonium Destacking';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Pandemonium') || !getPageSetting('pandemonium') || game.global.world < getPageSetting('pandemoniumZone')) return farmingDetails;

	var destackHits = getPageSetting('pandemoniumDestack') > 0 ? getPageSetting('pandemoniumDestack') : Infinity;
	var destackZone = getPageSetting('pandemoniumZone') > 0 ? getPageSetting('pandemoniumZone') : Infinity;

	if (destackHits === Infinity && destackZone === Infinity) return farmingDetails;

	var mapLevel = 1;
	var mapSpecial = hdStats.hyperspeed ? "lmc" : game.challenges.Pandemonium.pandemonium > 7 ? "fa" : "lmc";
	var jobRatio = '0.001,0.001,1,0';


	if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeats !== 0) {
		game.global.mapRunCounter = MODULES.maps.mapRepeats;
		MODULES.maps.mapRepeats = 0;
	}
	var autoLevel_Repeat = mapSettings.levelCheck;
	mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, 10, 1);
	if (mapAutoLevel !== Infinity) {
		if (autoLevel_Repeat !== Infinity && autoLevel_Repeat !== mapAutoLevel) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
		mapLevel = mapAutoLevel;
	}

	if (game.challenges.Pandemonium.pandemonium > 0 && (hdStats.hdRatio > destackHits || game.global.world >= destackZone))
		shouldMap = true;

	var repeat = (game.challenges.Pandemonium.pandemonium - mapLevel) < mapLevel;
	var status = 'Pandemonium Destacking: ' + game.challenges.Pandemonium.pandemonium + " remaining";

	farmingDetails.shouldRun = shouldMap;
	farmingDetails.mapName = mapName;
	farmingDetails.mapLevel = mapLevel;
	farmingDetails.autoLevel = true;
	farmingDetails.special = mapSpecial;
	farmingDetails.jobRatio = jobRatio;
	farmingDetails.pandemonium = game.challenges.Pandemonium.pandemonium;
	farmingDetails.repeat = !repeat;
	farmingDetails.status = status;

	if (mapSettings.mapName === mapName && !shouldMap) {
		mappingDetails(mapName, mapLevel, mapSpecial);
		resetMapVars();
	}

	return farmingDetails;
}

//Pandemonium Equip Farming
function pandemoniumFarm() {

	var mapAutoLevel = Infinity;
	var shouldMap = false;
	const mapName = 'Pandemonium Farming';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Pandemonium') || !getPageSetting('pandemonium') || getPageSetting('pandemoniumAE') < 2 || game.global.world === 150 || game.global.lastClearedCell + 2 < 91 || game.challenges.Pandemonium.pandemonium > 0) return farmingDetails;

	var jobRatio = '1,1,100,0';
	var equipCost = cheapestEquipmentCost();
	var nextEquipmentCost = equipCost[1];

	var destackHits = getPageSetting('pandemoniumDestack') > 0 ? getPageSetting('pandemoniumDestack') : Infinity;
	var mapLevel = 1;
	var destackZone = getPageSetting('pandemoniumAEZone') > 0 ? getPageSetting('pandemoniumAEZone') : Infinity;

	var autoLevel_Repeat = mapSettings.levelCheck;
	mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, null, null);
	if (mapAutoLevel !== Infinity) {
		if (autoLevel_Repeat !== Infinity && autoLevel_Repeat !== mapAutoLevel) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
		mapLevel = mapAutoLevel;
	}

	var pandemonium_LMC = scaleToCurrentMap_AT(simpleSeconds_AT("metal", 20, jobRatio), false, true, mapLevel);
	var mapSpecial = nextEquipmentCost > pandemonium_LMC ? 'hc' : 'lmc'
	var resourceGain = mapSpecial === 'hc' ? pandemonium_LMC * 2 : pandemonium_LMC;

	//Checking if an equipment level costs less than a cache or a prestige level costs less than a jestimp and if so starts farming.
	if (destackZone >= 2 && nextEquipmentCost < resourceGain && (hdStats.hdRatio > destackHits || game.global.world >= destackZone))
		shouldMap = true;

	var repeat = nextEquipmentCost >= resourceGain;
	var status = 'Pandemonium Farming Equips below ' + prettify(resourceGain);

	if (shouldMap) {
		farmingDetails.shouldRun = shouldMap;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = mapLevel;
		farmingDetails.autoLevel = true;
		farmingDetails.special = mapSpecial;
		farmingDetails.jobRatio = jobRatio;
		farmingDetails.gather = 'metal';
		farmingDetails.pandemonium = game.challenges.Pandemonium.pandemonium;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;
	}

	if (mapSettings.mapName === mapName && !shouldMap) {
		mappingDetails(mapName, mapLevel, mapSpecial);
		resetMapVars();
	}

	return farmingDetails;
}

function alchemy() {

	var shouldMap = false;
	var mapAutoLevel = Infinity;
	const mapName = 'Alchemy Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	const baseSettings = getPageSetting('alchemySettings');
	const defaultSettings = baseSettings ? baseSettings[0] : null;
	if (defaultSettings === null) return farmingDetails;

	if (!challengeActive('Alchemy') || !defaultSettings.active) return farmingDetails;

	var settingIndex;

	//Checking to see if any lines are to be run.
	for (var y = 0; y < baseSettings.length; y++) {
		if (y === 0) continue;
		const currSetting = baseSettings[y];
		var world = currSetting.world;
		if (!settingShouldRun(currSetting, world, 0)) continue;
		if (game.global.world === currSetting.world) {
			settingIndex = y;
			break;
		}
	}

	if (settingIndex >= 0) {
		var setting = baseSettings[settingIndex];
		var mapLevel = setting.level;
		var mapSpecial = setting.special;
		var jobRatio = setting.jobratio;
		var potionGoal = setting.potion;

		if (setting.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeats !== 0) {
				game.global.mapRunCounter = MODULES.maps.mapRepeats;
				MODULES.maps.mapRepeats = 0;
			}
			var autoLevel_Repeat = mapSettings.levelCheck;
			mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, 10, 1);
			if (mapAutoLevel !== Infinity) {
				if (autoLevel_Repeat !== Infinity && mapAutoLevel !== autoLevel_Repeat) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
				mapLevel = mapAutoLevel;
			}
		}

		mapLevel = mapAutoLevel;

		if (mapSpecial.includes('l') && mapSpecial.length === 3 && perfectMapCost(mapLevel, mapSpecial) >= game.resources.fragments.owned) mapSpecial = mapSpecial.charAt(0) + "sc";

		if (potionGoal !== undefined) {
			//Working out which potion the input corresponds to.
			potion = potionGoal.charAt('0') === 'h' ? 0 :
				potionGoal.charAt('0') === 'g' ? 1 :
					potionGoal.charAt('0') === 'f' ? 2 :
						potionGoal.charAt('0') === 'v' ? 3 :
							potionGoal.charAt('0') === 's' ? 4 :
								undefined;

			//Alchemy biome selection, will select Farmlands if it's unlocked and appropriate otherwise it'll use the default map type for that herb.
			const biome = alchObj.potionNames[potion] === alchObj.potionNames[0] ? game.global.farmlandsUnlocked && getFarmlandsResType() === "Metal" ? "Farmlands" : "Mountain" :
				alchObj.potionNames[potion] === alchObj.potionNames[1] ? game.global.farmlandsUnlocked && getFarmlandsResType() === "Wood" ? "Farmlands" : "Forest" :
					alchObj.potionNames[potion] === alchObj.potionNames[2] ? game.global.farmlandsUnlocked && getFarmlandsResType() === "Food" ? "Farmlands" : "Sea" :
						alchObj.potionNames[potion] === alchObj.potionNames[3] ? game.global.farmlandsUnlocked && getFarmlandsResType() === "Gems" ? "Farmlands" : "Depths" :
							alchObj.potionNames[potion] === alchObj.potionNames[4] ? game.global.farmlandsUnlocked && getFarmlandsResType() === "Any" ? "Farmlands" : game.global.decayDone ? "Plentiful" : "Random" :
								game.global.farmlandsUnlocked && getFarmlandsResType() === "Any" ? "Farmlands" : game.global.decayDone ? "Plentiful" : "Random";

			//Doing calcs to identify the total cost of all the Brews/Potions that are being farmed
			//Initialising vars
			var herbMult = biome === "Farmlands" ? 1.5 : 1;
			var potionCost = 0;
			var potionCostTotal = 0;
			var potionscurrent = alchObj.potionsOwned[potion];
			//Identifying current herbs + ones that we'll get from the map we should run
			var herbTotal = game.herbs[alchObj.potions[potion].cost[0][0]].cowned + (alchObj.getDropRate(game.global.world + mapLevel) * herbMult);

			/* //When mapType is set as Map Count work out how many of each Potion/Brew we can farm in the amount of maps specified.
			if (setting.mapType === 'Map Count') {
				var potion = Number(potionGoal.toString().replace(/[^\d,:-]/g, ''))
				if (potion !== 0) {
				}
			} */

			//Looping through each potion level and working out their cost to calc total cost
			for (var x = potionscurrent; x < (potionGoal.toString().replace(/[^\d,:-]/g, '')); x++) {
				var potionCost = Math.pow(alchObj.potions[potion].cost[0][2], x) * alchObj.potions[potion].cost[0][1];
				//Checking if the potion being farmed is a Potion and if so factors in compounding cost scaling from other potions owned
				if (!alchObj.potions[potion].enemyMult) {
					var potionsowned = 0;
					//Calculating total level of potions that aren't being farmed
					for (var y = 0; y < alchObj.potionsOwned.length; y++) {
						if (alchObj.potions[y].challenge !== (challengeActive('Alchemy'))) continue;
						if (y !== alchObj.potionNames.indexOf(alchObj.potionNames[potion]) && !alchObj.potions[y].enemyMult) potionsowned += alchObj.potionsOwned[y];
					}
					potionCost *= Math.pow(alchObj.allPotionGrowth, potionsowned);
				}
				//Summing cost of potion levels
				potionCostTotal += potionCost;
			}
			if (potionGoal.toString().replace(/[^\d:-]/g, '') > potionscurrent) {
				if (alchObj.canAffordPotion(alchObj.potionNames[potion])) {
					for (var z = potionscurrent; z < potionGoal.toString().replace(/[^\d:-]/g, ''); z++) {
						if (potion === 1) {
							if (game.herbs[alchObj.potions[potion].cost[0][0]].cowned > potionCostTotal)
								for (var x = potionscurrent; x < potionGoal.toString().replace(/[^\d,:-]/g, ''); x++) {
									alchObj.craftPotion(alchObj.potionNames[potion]);
								}
						}
						else alchObj.craftPotion(alchObj.potionNames[potion]);
					}
				}
			}
			if (potionGoal.toString().replace(/[^\d,:-]/g, '') > alchObj.potionsOwned[potion])
				shouldMap = true;

			var repeat = herbTotal >= potionCostTotal;
			var status = 'Alchemy Farming ' + alchObj.potionNames[potion] + " (" + alchObj.potionsOwned[potion] + "/" + potionGoal.toString().replace(/[^\d,:-]/g, '') + ")";

			farmingDetails.shouldRun = shouldMap;
			farmingDetails.mapName = mapName;
			farmingDetails.mapLevel = mapLevel;
			farmingDetails.autoLevel = setting.autoLevel;
			farmingDetails.special = mapSpecial;
			farmingDetails.jobRatio = jobRatio;
			farmingDetails.biome = biome;
			farmingDetails.herbTotal = herbTotal;
			farmingDetails.potionTotalCost = potionCostTotal;
			farmingDetails.potionName = alchObj.potionNames[potion];
			farmingDetails.potionOwned = alchObj.potionsOwned[potion];
			farmingDetails.potionGoal = potionGoal.toString().replace(/[^\d,:-]/g, '');
			farmingDetails.repeat = !repeat;
			farmingDetails.status = status;
			farmingDetails.settingIndex = settingIndex;

			if (mapSettings.mapName === mapName && !farmingDetails.shouldRun) {
				mappingDetails(mapName, mapLevel, mapSpecial, alchObj.potionsOwned[potion], potionGoal.toString().replace(/[^\d,:-]/g, ''), alchObj.potionNames[potion]);
				resetMapVars(setting);
			}
		}

	}


	if ((typeof (defaultSettings.voidPurchase) === 'undefined' ? true : defaultSettings.voidPurchase) && mapSettings.mapName === 'Void Map' && game.global.mapsActive) {
		if (getCurrentMapObject().location === "Void" && (alchObj.canAffordPotion('Potion of the Void') || alchObj.canAffordPotion('Potion of Strength'))) {
			alchObj.craftPotion('Potion of the Void');
			alchObj.craftPotion('Potion of Strength');
		}
	}

	return farmingDetails;
}

function glass() {

	var shouldFarm = false;
	var mapAutoLevel = Infinity;
	var mapName = 'Glass ';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Glass') || !getPageSetting('glass')) return farmingDetails;

	var mapLevel = 0;
	var jobRatio = '0,0,1,0';
	var mapSpecial = getAvailableSpecials('lmc', true);
	var glassStacks = getPageSetting('glassStacks');
	if (glassStacks <= 0) glassStacks = Infinity;

	//Auto level junk - Maybe pop this into its own function?
	if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeats !== 0) {
		game.global.mapRunCounter = MODULES.maps.mapRepeats;
		MODULES.maps.mapRepeats = 0;
	}

	var autoLevel_Repeat = mapSettings.levelCheck;
	mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, 10, null);
	if (mapAutoLevel !== Infinity) {
		if (autoLevel_Repeat !== Infinity && mapAutoLevel !== autoLevel_Repeat) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
		mapLevel = mapAutoLevel;
	}

	//Gamma burst info
	var gammaTriggerStacks = gammaMaxStacks();
	var gammaToTrigger = gammaTriggerStacks - game.heirlooms.Shield.gammaBurst.stacks;
	if (game.global.mapsActive) gammaToTrigger = Infinity;
	var gammaDmg = MODULES.heirlooms.gammaBurstPct;
	var canGamma = gammaToTrigger <= 1 ? true : false;
	var damageGoal = 2;

	var equalityAmt = equalityQuery('Snimp', game.global.world, 20, 'map', 0.75, 'gamma');
	var ourDmg = calcOurDmg('min', equalityAmt, false, 'map', 'maybe', mapLevel, false);
	var enemyHealth = calcEnemyHealthCore('map', game.global.world, 20, 'Snimp') * .75;
	if (glassStacks <= gammaTriggerStacks) ourDmg *= gammaDmg;

	//Destacking
	if (!canGamma && MODULES.mapFunctions.challengeContinueRunning || ((ourDmg * damageGoal) > enemyHealth && game.challenges.Glass.shards >= glassStacks)) {
		mapSpecial = getAvailableSpecials('fa');
		shouldFarm = true;
		mapLevel = 0;
		mapName += 'Destacking'
	}
	//Farming if we don't have enough damage to clear stacks!
	else if (!canGamma && (ourDmg * damageGoal) < enemyHealth) {
		mapName += 'Farming'
		shouldFarm = true;
		MODULES.mapFunctions.challengeContinueRunning = false;
	}
	//Checking if we can clear +0 maps on the next zone.
	else if (game.global.lastClearedCell + 2 === 100) {
		equalityAmt = equalityQuery('Snimp', game.global.world + 1, 20, 'map', 0.75, 'gamma');
		ourDmg = calcOurDmg('min', equalityAmt, false, 'map', 'maybe', mapLevel, false);
		enemyHealth = calcEnemyHealthCore('map', game.global.world + 1, 20, 'Snimp') * .75;
		mapName += 'Farming'
		//Checking if we can clear current zone.
		if ((ourDmg * damageGoal) < enemyHealth) {
			shouldFarm = true;
			MODULES.mapFunctions.challengeContinueRunning = false;
		}
	}

	if (MODULES.mapFunctions.challengeContinueRunning || (game.global.mapsActive && mapSettings.mapName === 'Glass Destacking')) {
		if (game.challenges.Glass.shards > 0) {
			shouldFarm = true;
			MODULES.mapFunctions.challengeContinueRunning = true;
		}
		else {
			if (game.challenges.Glass.shards === 0) recycleMap_AT();
			MODULES.mapFunctions.challengeContinueRunning = false;
			shouldFarm = false;
		}
	}

	var damageTarget = enemyHealth / damageGoal;

	var status;
	if (mapName.includes('Destack')) status = mapName + " " + game.challenges.Glass.shards + " stacks remaining";
	else status = game.global.challengeActive + ' Farm: Curr&nbsp;Dmg:&nbsp;' + prettify(ourDmg) + " Goal&nbsp;Dmg:&nbsp;" + prettify(damageTarget);

	farmingDetails.shouldRun = shouldFarm;
	farmingDetails.mapName = mapName;
	farmingDetails.mapLevel = mapLevel;
	farmingDetails.autoLevel = true;
	farmingDetails.special = mapSpecial;
	farmingDetails.jobRatio = jobRatio;
	farmingDetails.damageTarget = damageTarget;
	farmingDetails.repeat = true;
	farmingDetails.status = status;

	if (mapSettings.mapName === mapName && !farmingDetails.shouldRun) {
		mappingDetails(mapName, mapLevel, mapSpecial);
		resetMapVars();
	}

	return farmingDetails;
}


function hypothermia() {

	var shouldMap = false;
	var mapAutoLevel = Infinity;
	const mapName = 'Hypothermia Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};
	const baseSettings = getPageSetting('hypothermiaSettings');
	const defaultSettings = baseSettings ? baseSettings[0] : null;
	if (defaultSettings === null) return farmingDetails;

	if ((!defaultSettings.active ||
		(!challengeActive('Hypothermia') && (!defaultSettings.packrat || !MODULES.mapFunctions.hypothermia.buyPackrat)))) return farmingDetails;

	if (defaultSettings.packrat) {
		if (!MODULES.mapFunctions.hypothermia.buyPackrat && challengeActive('Hypothermia'))
			MODULES.mapFunctions.hypothermia.buyPackrat = true;
		if (MODULES.mapFunctions.hypothermia.buyPackrat && challengeActive('')) {
			viewPortalUpgrades();
			numTab(6, true);
			buyPortalUpgrade('Packrat');
			MODULES.mapFunctions.hypothermia.buyPackrat = null;
			activateClicked();
		}
	}

	if (!challengeActive('Hypothermia')) return farmingDetails;
	var settingIndex;

	//Checking to see if any lines are to be run.
	for (var y = 0; y < baseSettings.length; y++) {
		if (y === 0) continue;
		const currSetting = baseSettings[y];
		var world = currSetting.world;
		if (!settingShouldRun(currSetting, world, 0)) continue;

		if (game.global.world === currSetting.world) {
			settingIndex = y;
			break;
		}
	}

	if (settingIndex >= 0) {

		var setting = baseSettings[settingIndex];
		var bonfireGoal = setting.bonfire;
		var mapSpecial = getAvailableSpecials("lwc", true);
		var mapLevel = setting.level;
		var jobRatio = setting.jobratio;
		var shedCost = 0;
		var bonfireCostTotal = 0;
		var bonfireCost;
		//Looping through each bonfire level and working out their cost to calc total cost
		for (var x = game.challenges.Hypothermia.totalBonfires; x < bonfireGoal; x++) {
			bonfireCost = 1e10 * Math.pow(100, x);
			bonfireCostTotal += bonfireCost;
		}
		if (bonfireCostTotal > (game.resources.wood.max * (1 + (game.portal.Packrat.modifier * game.portal.Packrat.radLevel))))
			shedCost += game.buildings.Shed.cost.wood();
		bonfireCostTotal += shedCost;

		if (setting.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeats !== 0) {
				game.global.mapRunCounter = MODULES.maps.mapRepeats;
				MODULES.maps.mapRepeats = 0;
			}

			var autoLevel_Repeat = mapSettings.levelCheck;
			mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, null, null);
			if (mapAutoLevel !== Infinity) {
				if (autoLevel_Repeat !== Infinity && mapAutoLevel !== autoLevel_Repeat) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
				mapLevel = mapAutoLevel;
			}
		}

		if (bonfireCostTotal > game.resources.wood.owned && bonfireGoal > game.challenges.Hypothermia.totalBonfires) {
			shouldMap = true;
		}

		var repeat = game.resources.wood.owned > game.challenges.Hypothermia.bonfirePrice || scaleToCurrentMap_AT(simpleSeconds_AT("wood", 20, jobRatio), false, true, mapLevel) + game.resources.wood.owned > bonfireCostTotal;
		var status = 'Hypo Farming to ' + prettify(bonfireCostTotal) + ' wood';

		farmingDetails.shouldRun = shouldMap;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = mapLevel;
		farmingDetails.autoLevel = setting.autoLevel;
		farmingDetails.special = mapSpecial;
		farmingDetails.jobRatio = jobRatio;
		farmingDetails.bonfire = bonfireGoal;
		farmingDetails.woodGoal = bonfireCostTotal;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;
		farmingDetails.settingIndex = settingIndex;

		if (mapSettings.mapName === mapName && !farmingDetails.shouldRun) {
			mappingDetails(mapName, mapLevel, mapSpecial, bonfireCostTotal);
			resetMapVars(setting);
		}
	}

	return farmingDetails;
}

function desolation(forceDestack) {

	var shouldMap = false;
	var mapAutoLevel = Infinity;
	const mapName = 'Desolation Destacking';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Desolation') || !getPageSetting('desolation')) return farmingDetails;
	if (!MODULES.mapFunctions.challengeContinueRunning && game.challenges.Desolation.chilled === 0) return farmingDetails;


	var destackHits = getPageSetting('desolationDestack') > 0 ? getPageSetting('desolationDestack') : Infinity;
	var destackZone = getPageSetting('desolationZone') > 0 ? getPageSetting('desolationZone') : Infinity;
	var destackStacks = getPageSetting('desolationStacks') > 0 ? getPageSetting('desolationStacks') : 300;
	var destackOnlyZone = getPageSetting('desolationOnlyDestackZone') > 0 ? getPageSetting('desolationOnlyDestackZone') : Infinity;
	var mapLevel = 0;
	var mapSpecial = hdStats.hyperspeed ? "lmc" : "fa";
	var sliders = [9, 9, 9];
	var biome = getBiome();
	var equality = false;

	//Forcing destack before doing any farmings.
	if (forceDestack) {
		destackZone = game.global.world;
		destackStacks = 0;
	}

	if (MODULES.mapFunctions.challengeContinueRunning || (game.challenges.Desolation.chilled >= destackStacks && (hdStats.hdRatio > destackHits || game.global.world >= destackZone || game.global.world >= destackOnlyZone)))
		shouldMap = true;

	if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeats !== 0) {
		game.global.mapRunCounter = MODULES.maps.mapRepeats;
		MODULES.maps.mapRepeats = 0;
	}
	if (game.global.world < destackOnlyZone && !game.jobs.Explorer.locked) {
		var autoLevel_Repeat = mapSettings.levelCheck;
		mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, 10, 0);
		if (mapAutoLevel !== Infinity) {
			if (autoLevel_Repeat !== Infinity && mapAutoLevel !== autoLevel_Repeat) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
			mapLevel = mapAutoLevel;
		}
	} else if (shouldMap) {
		sliders = [0, 0, 9];
		if (mapSpecial === 'lmc' || game.jobs.Explorer.locked) mapSpecial = '0';
		else mapSpecial = 'fa';

		biome = getBiome('fragConservation');
		var trimpHealth = calcOurHealth(false, 'map');
		for (var y = 10; y >= 0; y--) {
			mapLevel = y;
			if (game.global.mapsActive && mapSettings.mapName === mapName && (getCurrentMapObject().bonus === undefined ? '0' : getCurrentMapObject().bonus) === mapSpecial && (getCurrentMapObject().level - game.global.world) === mapLevel) break;
			if (mapLevel === 0) break;
			if (game.resources.fragments.owned < minMapFrag(mapLevel, mapSpecial, 'Random', sliders)) continue;
			var enemyDmg = calcEnemyAttackCore('map', game.global.world + y, 1, 'Snimp', false, false, game.portal.Equality.radLevel) * 0.84 * 4;
			if (enemyDmg > trimpHealth) continue;
			break;
		}
		if (game.global.mapsActive && getCurrentMapObject().level !== game.global.world + mapLevel) {
			recycleMap_AT();
		}
		equality = true;
	}

	if (MODULES.mapFunctions.challengeContinueRunning || (forceDestack && game.challenges.Desolation.chilled > 0) || (game.global.mapsActive && mapSettings.mapName === 'Desolation Destacking')) {
		if (game.challenges.Desolation.chilled > 0) {
			shouldMap = true;
			MODULES.mapFunctions.challengeContinueRunning = true;
		}
		else {
			if (game.challenges.Desolation.chilled === 0) recycleMap_AT(true);
			MODULES.mapFunctions.challengeContinueRunning = false;
			shouldMap = false;
		}
	}

	var repeat = game.challenges.Desolation.chilled <= mapLevel + 1;
	var status = 'Desolation Destacking: ' + game.challenges.Desolation.chilled + " remaining";

	farmingDetails.shouldRun = shouldMap;
	farmingDetails.mapName = mapName;
	farmingDetails.mapLevel = mapLevel;
	farmingDetails.autoLevel = true;
	farmingDetails.special = mapSpecial;
	farmingDetails.mapSliders = sliders;
	farmingDetails.biome = biome;
	farmingDetails.repeat = !repeat;
	farmingDetails.status = status;
	farmingDetails.equality = equality;

	if (mapSettings.mapName === mapName && !farmingDetails.shouldRun) {
		mappingDetails(mapName, mapLevel, mapSpecial);
		resetMapVars();
	}
	return farmingDetails;
}

function desolationGearScum() {

	var shouldMap = false;
	const mapName = 'Desolation Gear Scum';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Desolation') || !getPageSetting('desolation')) return farmingDetails;

	const baseSettings = getPageSetting('desolationSettings');
	const defaultSettings = baseSettings ? baseSettings[0] : null;
	if (defaultSettings === null) return farmingDetails;

	if (!defaultSettings.active) return farmingDetails;
	var settingIndex = null;

	for (var y = 0; y < baseSettings.length; y++) {
		if (y === 0) continue;
		//Skip iterating lines if map bonus is capped.
		const currSetting = baseSettings[y];
		//Set cell ourselves since there is no input and you don't need to do this before c100. If you're overkilling you definitely don't need this setting.
		currSetting.cell = 100 - maxOneShotPower() + 1;
		var targetPrestige = currSetting.prestigeGoal !== 'All' ? MODULES.equipment[currSetting.prestigeGoal].upgrade : 'GamesOP';
		var world = currSetting.world - 1;
		if (!settingShouldRun(currSetting, world, 0)) continue;

		//Checks to see what our actual zone should be
		var raidZones = currSetting.world;
		if (currSetting.repeatevery !== 0 && game.global.world > currSetting.world) {
			var times = currSetting.repeatevery;
			var repeats = Math.round((game.global.world - currSetting.world) / times);
			if (repeats > 0) raidZones += (times * repeats);
		}

		//Skips if we don't have the required prestige available.
		if (equipsToGet(raidZones, targetPrestige)[0] <= 0) continue;
		if (game.global.world === world || ((game.global.world - world) % currSetting.repeatevery === 0)) {
			settingIndex = y;
			break;
		}
	}

	if ((settingIndex !== null && settingIndex >= 0) || MODULES.mapFunctions.desolation.gearScum) {
		setting = baseSettings[settingIndex];
		var special;
		var jobRatio;
		var gather;
		var mapLevel = game.global.lastClearedCell < 80 ? 0 : 1;
		if (settingIndex !== null && settingIndex >= 0) {
			special = getAvailableSpecials(setting.special);
			jobRatio = setting.jobratio;
			gather = setting.gather;
		}
		else if (MODULES.maps.lastMapWeWereIn !== null && MODULES.maps.lastMapWeWereIn.mapLevel === mapLevel) {
			special = MODULES.maps.lastMapWeWereIn.bonus;
		}

		//Check if a max attack+gamma burst can clear the improb.
		//If it can't continue as normal, if it can then we start the +1 map for prestige scumming.
		//Need to set it to destack before doing this so there's no chance of messing up the scum by neeeding to destack as soon as you hit the next zone.
		var currCell = game.global.lastClearedCell + 2;
		var enemyHealth = getCurrentWorldCell().maxHealth > -1 ? getCurrentWorldCell().health : calcEnemyHealthCore('world', game.global.world, currCell, game.global.gridArray[currCell - 1].name);
		var equalityAmt = equalityQuery('Improbability', game.global.world, 100, 'world', 1, 'gamma');
		var ourDmg = calcOurDmg('max', equalityAmt, false, 'world', 'force', 0, false);
		var gammaDmg = MODULES.heirlooms.gammaBurstPct;
		var ourDmgTotal = (ourDmg * gammaDmg) * 5;

		//Check if we will overshoot the improb with our regular hit/gamma burst.
		//Add together the health of the cells between our current cell and the improb that we are able to overkill.
		if (currCell !== 100) {
			for (var x = currCell + 1; x <= 100; x++) {
				enemyHealth += calcEnemyHealthCore('world', game.global.world, x, game.global.gridArray[x - 1].name);
			}
		}

		//Identify how much damage we can do in 5 gamma bursts. If this value is greater than the improb health then we can clear it and we should start the map.
		if (ourDmgTotal > enemyHealth || MODULES.mapFunctions.desolation.gearScum) {
			shouldMap = true;
		}

		//Disabling the need to map if we are at the right conditions.
		//Correct map level
		//Have already cleared cell #1 in the map so it won't recycle
		//If these are met then we should just return to world and set a condition to finish this at the start of the next zone.
		if ((settingIndex !== null && settingIndex >= 0) && shouldMap && game.global.currentMapId !== '' && getCurrentMapCell().level > 3 && getCurrentMapObject().level === game.global.world + mapLevel) {
			shouldMap = false;
			MODULES.mapFunctions.desolation.gearScum = true;
			//Exit map if we're in it so that we don't clear the map.
			if (game.global.mapsActive) {
				debug(mapName + " (z" + game.global.world + "c" + (game.global.lastClearedCell + 2) + ") exiting map to ensure we complete it at start of the next zone.", "map_Details")
				mapsClicked(true);
			}
		}

		const prestigeList = ['Supershield', 'Dagadder', 'Bootboost', 'Megamace', 'Hellishmet', 'Polierarm', 'Pantastic', 'Axeidic', 'Smoldershoulder', 'Greatersword', 'Bestplate', 'Harmbalest', 'GambesOP'];

		//Marking setting as complete if we've run enough maps.
		if (mapSettings.mapName === mapName && MODULES.mapFunctions.desolation.gearScum && (game.global.currentMapId === '' || prestigeList.indexOf(game.global.mapGridArray[getCurrentMapObject().size - 1].special) === -1)) {
			debug(mapName + " (z" + game.global.world + "c" + (game.global.lastClearedCell + 2) + ") was successful.", "map_Details");
			resetMapVars();
			shouldMap = false;
			saveSettings();
			MODULES.mapFunctions.desolation.gearScum = false;
		}

		var status = 'Desolation Prestige Scumming';
		var repeat = true;
		farmingDetails.shouldRun = shouldMap;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = mapLevel;
		farmingDetails.jobRatio = jobRatio;
		farmingDetails.special = special;
		farmingDetails.gather = gather;
		farmingDetails.repeat = !repeat;
		farmingDetails.status = status;
		farmingDetails.settingIndex = settingIndex;
	}
	return farmingDetails;
}

function smithless() {

	var shouldMap = false;
	var mapAutoLevel = Infinity;
	const mapName = 'Smithless Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	if (!challengeActive('Smithless') || !getPageSetting('smithless')) return farmingDetails;

	if (game.global.world % 25 === 0 && game.global.lastClearedCell === -1 && game.global.gridArray[0].ubersmith) {

		var jobRatio = '0,0,1,0';
		var mapSpecial = getAvailableSpecials('lmc', true);
		var smithlessMax = game.global.mapBonus !== 10 ? 10 : null;
		var smithlessMin = game.global.mapBonus !== 10 ? 0 : null;

		if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeats !== 0) {
			game.global.mapRunCounter = MODULES.maps.mapRepeats;
			MODULES.maps.mapRepeats = 0;
		}
		var autoLevel_Repeat = mapSettings.levelCheck;
		mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, smithlessMax, smithlessMin);
		if (mapAutoLevel !== Infinity) {
			if (autoLevel_Repeat !== Infinity && mapAutoLevel !== autoLevel_Repeat) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
			mapLevel = mapAutoLevel;
		}

		var name = game.global.gridArray[0].name;
		var gammaDmg = MODULES.heirlooms.gammaBurstPct;
		var equalityAmt = equalityQuery(name, game.global.world, 1, 'world', 1, 'gamma');
		var ourDmg = calcOurDmg('min', equalityAmt, false, 'world', 'never', 0, false);
		var ourDmgTenacity = ourDmg;

		var gammas = 10 % gammaMaxStacks();
		var regularHits = 10 - (gammas * gammaMaxStacks());

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

		ourDmgTenacity *= getZoneMinutes() > 100 ? 1 : 1.5;
		if (equipsToGet(game.global.world + mapLevel)[0] > 0) ourDmgTenacity *= 1000;

		var totalDmgTenacity = ((ourDmgTenacity * regularHits) + (ourDmgTenacity * gammaDmg * gammas))

		var enemyHealth = calcEnemyHealthCore('world', game.global.world, 1, name);
		enemyHealth *= 3e15;
		const smithyThreshhold = [1, 0.01, 0.000001];
		const smithyThreshholdIndex = [0.000001, 0.01, 1];
		while (smithyThreshhold.length > 0 && totalDmgTenacity < (enemyHealth * smithyThreshhold[0])) {
			smithyThreshhold.shift();
		}
		enemyHealth *= smithyThreshhold[0];

		if (smithyThreshhold.length === 0) return farmingDetails;

		var totalDmg = ((ourDmg * regularHits) + (ourDmg * gammaDmg * gammas))
		var damageTarget = enemyHealth / totalDmg;

		if (totalDmg < enemyHealth) {
			shouldMap = true;
		}

		var status = 'Smithless: Want ' + damageTarget.toFixed(2) + 'x more damage for ' + (smithyThreshholdIndex.indexOf(smithyThreshhold[0]) + 1) + '/3';

		farmingDetails.shouldRun = shouldMap;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = mapLevel;
		farmingDetails.autoLevel = true;
		farmingDetails.special = mapSpecial;
		farmingDetails.jobRatio = jobRatio;
		farmingDetails.damageTarget = damageTarget;
		farmingDetails.equality = equalityAmt;
		farmingDetails.repeat = true;
		farmingDetails.status = status;

		if (mapSettings.mapName === mapName && !farmingDetails.shouldRun) {
			mappingDetails(mapName, mapLevel, mapSpecial, (smithyThreshholdIndex.indexOf(smithyThreshhold[0]) + 1));
			resetMapVars();
		}

	}

	return farmingDetails;
}

function hdFarm(skipHealthCheck, voidFarm) {

	var shouldMap = false;
	var mapAutoLevel = Infinity;
	var mapName = 'HD Farm';
	const farmingDetails = {
		shouldRun: false,
		mapName: mapName
	};

	var shouldHealthFarm = false;
	const hitsSurvivedSetting = targetHitsSurvived();
	var hitsSurvived = hdStats.hitsSurvived;
	if (hitsSurvivedSetting > 0 && !skipHealthCheck && !voidFarm && MODULES.mapFunctions.hasHealthFarmed !== (getTotalPortals() + "_" + game.global.world)) {
		if (hitsSurvived < hitsSurvivedSetting) shouldHealthFarm = true;
	}

	const baseSettings = getPageSetting('hdFarmSettings');
	const defaultSettings = baseSettings ? baseSettings[0] : null;
	if (defaultSettings === null) return farmingDetails;

	if (!defaultSettings.active && !shouldHealthFarm && !voidFarm) return farmingDetails;

	var shouldSkip = false;

	var settingIndex = null;
	if (defaultSettings.active && !shouldHealthFarm && !voidFarm) {
		for (var y = 0; y < baseSettings.length; y++) {
			if (y === 0) continue;
			const currSetting = baseSettings[y];
			const world = currSetting.world;
			if (!settingShouldRun(currSetting, world, 0)) continue;
			if (currSetting.hdType.toLowerCase().includes('void') && game.global.totalVoidMaps === 0) continue;
			if (skipHealthCheck && currSetting.hdType.includes('hitsSurvived')) continue;
			settingIndex = y;
			break;
		}
	}

	if (settingIndex !== null || shouldHealthFarm || voidFarm) {
		var setting;
		var hdFarmMapCap;
		var hdFarmMaxMaps;
		var hdFarmMinMaps;

		if (voidFarm) {
			var voidSetting = getPageSetting('voidMapSettings')[0];
			setting = {
				autoLevel: true,
				cell: 1,
				hdMult: 1,
				jobratio: voidSetting.jobratio,
				level: -1,
				world: game.global.world
			}

			if (voidSetting.hitsSurvived > hdStats.hitsSurvivedVoid) {
				setting.hdBase = Number(voidSetting.hitsSurvived);
				setting.hdType = 'hitsSurvivedVoid';
			} else {
				setting.hdBase = Number(voidSetting.hdRatio);
				setting.hdType = 'voidFarm';
			}

			hdFarmMapCap = Infinity;

		}
		else if (settingIndex === null) {
			setting = {
				autoLevel: true,
				cell: 61,
				hdBase: hitsSurvivedSetting,
				hdMult: 1,
				hdType: "hitsSurvived",
				jobratio: typeof getPageSetting('mapBonusSettings')[0].jobratio !== 'undefined' ? getPageSetting('mapBonusSettings')[0].jobratio : "0,1,3",
				level: -1,
				world: game.global.world
			}
			hdFarmMapCap = 500;
			hdFarmMaxMaps = game.global.mapBonus < getPageSetting('mapBonusHealth') ? 10 : null;
			hdFarmMinMaps = game.global.mapBonus < getPageSetting('mapBonusHealth') ? (game.global.universe === 1 ? (0 - game.portal.Siphonology.level) : 0) : null;
		} else {
			shouldHealthFarm = false;
			setting = baseSettings[settingIndex];
			hdFarmMapCap = defaultSettings.mapCap;
			hdFarmMaxMaps = setting.hdType === 'world' && game.global.mapBonus !== 10 ? 10 : null;
			hdFarmMinMaps = setting.hhdType === 'world' && game.global.mapBonus !== 10 ? 0 : null;
		}

		var mapLevel = setting.level;
		var mapSpecial = getAvailableSpecials('lmc', true);
		var jobRatio = setting.jobratio;
		var hdType = setting.hdType;

		var hdFarmMaxMapsMaps = hdFarmMapCap;
		if (hdFarmMaxMapsMaps === -1) hdFarmMaxMapsMaps = Infinity;

		if (setting.autoLevel) {
			if (game.global.mapRunCounter === 0 && game.global.mapsActive && MODULES.maps.mapRepeats !== 0) {
				game.global.mapRunCounter = MODULES.maps.mapRepeats;
				MODULES.maps.mapRepeats = 0;
			}

			var autoLevel_Repeat = mapSettings.levelCheck;
			mapAutoLevel = callAutoMapLevel(mapSettings.mapName, mapSettings.levelCheck, mapSpecial, hdFarmMaxMaps, hdFarmMinMaps);
			if (mapAutoLevel !== Infinity) {
				if (autoLevel_Repeat !== Infinity && mapAutoLevel !== autoLevel_Repeat) MODULES.maps.mapRepeats = game.global.mapRunCounter + 1;
				mapLevel = mapAutoLevel;
			}
		}
		var hdRatio = hdType === 'world' ? hdStats.hdRatio : hdType === 'voidFarm' ? hdStats.vhdRatioVoid : hdType === 'void' ? hdStats.hdRatioVoid : hdType === 'map' ? hdStats.hdRatioMap : hdType === 'hitsSurvived' ? hdStats.hitsSurvived : hdType === 'hitsSurvivedVoid' ? hdStats.hitsSurvivedVoid : null;
		//if (hdType !== 'maplevel' && !shouldHealthFarm && hdRatio === null) return farmingDetails;

		if (hdType.includes('hitsSurvived') ? hdRatio < equipfarmdynamicHD(setting) : hdType === 'maplevel' ? setting.hdBase > hdStats.autoLevel : !shouldHealthFarm ? hdRatio > equipfarmdynamicHD(setting) : hdRatio < equipfarmdynamicHD(setting))
			shouldMap = true;

		//Set this here so that we can check against the correct map name in following checks
		if (shouldHealthFarm || hdType.includes('hitsSurvived')) {
			mapName = 'Hits Survived';
			if (hdType === 'hitsSurvivedVoid') hitsSurvived = hdStats.hitsSurvivedVoid;
		}

		//Skipping farm if map repeat value is greater than our max maps value
		if (shouldMap && game.global.mapsActive && mapSettings.mapName === mapName && game.global.mapRunCounter >= hdFarmMaxMapsMaps) {
			shouldMap = false;
		}
		if (mapSettings.mapName !== mapName && !shouldHealthFarm && (hdType.includes('hitsSurvived') ? hdRatio > equipfarmdynamicHD(setting) : hdType !== 'maplevel' ? equipfarmdynamicHD(setting) > hdRatio : hdStats.autoLevel > setting.hdBase))
			shouldSkip = true;

		if (((mapSettings.mapName === mapName && !shouldMap) || shouldSkip) && hdStats.hdRatio !== Infinity) {
			if (!shouldSkip) mappingDetails(mapName, mapLevel, mapSpecial, hdRatio, equipfarmdynamicHD(setting), hdType);
			if (getPageSetting('spamMessages').map_Skip && shouldSkip) {
				if (hdType.includes('hitsSurvived')) debug("Hits Survived (z" + game.global.world + "c" + (game.global.lastClearedCell + 2) + ") skipped as Hits Survived goal has been met (" + hitsSurvived.toFixed(2) + "/" + equipfarmdynamicHD(setting).toFixed(2) + ").", 'map_Skip');
				else if (hdType !== 'maplevel') debug("HD Farm (z" + game.global.world + "c" + (game.global.lastClearedCell + 2) + ") skipped as HD Ratio goal has been met (" + hdRatio.toFixed(2) + "/" + equipfarmdynamicHD(setting).toFixed(2) + ").", 'map_Skip');
				else debug("HD Farm (z" + game.global.world + "c" + (game.global.lastClearedCell + 2) + ") skipped as HD Ratio goal has been met (Autolevel " + setting.hdBase + "/" + hdStats.autoLevel + ").", 'map_Skip');
			}
			resetMapVars(setting);
			if (game.global.mapsActive) recycleMap_AT();
			//Might need to remove this??
			//Report of a max call stack size. If it happens again then remove this and make it so that it waits 0.1s before checking if void maps are ready to run
			if (voidFarm) return voidMaps();

		}

		var status = '';

		if (shouldHealthFarm || hdType.includes('hitsSurvived')) {
			if (hdType === 'hitsSurvivedVoid') status += 'Void&nbsp;';
			status += 'Hits&nbsp;Survived to:&nbsp;' + equipfarmdynamicHD(setting).toFixed(2) + '<br>';
			status += 'Current:&nbsp;' + prettify(hitsSurvived.toFixed(2));
		} else {
			status += 'HD&nbsp;Farm&nbsp;to:&nbsp;';
			if (hdType !== 'maplevel') status += equipfarmdynamicHD(setting).toFixed(2) + '<br>Current&nbsp;HD:&nbsp;' + hdRatio.toFixed(2);
			else status += '<br>' + (setting.hdBase >= 0 ? "+" : "") + setting.hdBase + ' Auto Level';
		}
		hdFarmMaxMapsMaps = hdFarmMaxMapsMaps === Infinity ? '∞' : hdFarmMaxMapsMaps;
		status += '<br>\ Maps:&nbsp;' + (game.global.mapRunCounter + 1) + '/' + hdFarmMaxMapsMaps;

		farmingDetails.shouldRun = shouldMap;
		farmingDetails.mapName = mapName;
		farmingDetails.mapLevel = mapLevel;
		farmingDetails.autoLevel = setting.autoLevel;
		farmingDetails.special = mapSpecial;
		farmingDetails.jobRatio = jobRatio;

		farmingDetails.hdType = hdType;
		farmingDetails.hdRatio = equipfarmdynamicHD(setting);
		farmingDetails.hdRatio2 = hdRatio;
		farmingDetails.repeat = true;
		farmingDetails.status = status;
		farmingDetails.shouldHealthFarm = shouldHealthFarm;
		farmingDetails.voidHitsSurvived = hdType === 'hitsSurvivedVoid';
		//Retain info that we have used a bone charge if we are farming stats before we run void maps.
		if (voidFarm) {
			if (mapSettings.boneChargeUsed) farmingDetails.boneChargeUsed = mapSettings.boneChargeUsed;
			if (mapSettings.voidHDIndex) farmingDetails.voidHDIndex = mapSettings.voidHDIndex;
			if (mapSettings.dropdown) farmingDetails.dropdown = mapSettings.dropdown;
			if (mapSettings.dropdown2) farmingDetails.dropdown2 = mapSettings.dropdown2;
			if (mapSettings.voidTrigger) farmingDetails.voidTrigger = mapSettings.voidTrigger;
			if (mapSettings.portalAfterVoids) farmingDetails.portalAfterVoids = mapSettings.portalAfterVoids;
			farmingDetails.voidFarm = true;
		}
	}

	return farmingDetails;
}

function farmingDecision() {
	var farmingDetails = {
		shouldRun: false,
		mapName: '',
		levelCheck: Infinity,
	}

	//Won't map till after cell 90 on Lead on Even zones
	if (challengeActive('Lead') && !game.global.runningChallengeSquared && game.global.world !== 180 && (game.global.world % 2 === 0 || game.global.lastClearedCell + 2 <= 90)) {
		return farmingDetails;
	}
	if (!game.global.mapsUnlocked) return farmingDetails;

	var mapTypes;
	//U1 map settings to check for.
	if (game.global.universe === 1) {
		mapTypes = [
			prestigeClimb(),
			mapFarm(),
			prestigeRaiding(),
			bionicRaiding(),
			hdFarm(),
			voidMaps(),
			mapBonus(),
			experience(),
			toxicity(),
			mapDestacking()
		];

		//Skipping map farming if in Decay and above stack count user input
		if (decaySkipMaps()) mapTypes = [
			prestigeClimb(),
			voidMaps(),
		];

		if (challengeActive('Mapology') && getPageSetting('mapology')) mapTypes = [
			prestigeClimb(),
			prestigeRaiding(),
			bionicRaiding(),
			voidMaps()
		];

		if (isDoingSpire() && getPageSetting('skipSpires') && game.global.mapBonus === 10) return farmingDetails;
	}

	if (game.global.universe === 2) {
		//Will push the mappingDetails message to indicate farming is finished before moving onto next stage. If destacking it will also recycle the map!
		if (mapSettings.mapName.includes('Desolation Destacking') && MODULES.mapFunctions.challengeContinueRunning && game.challenges.Desolation.chilled === 0) {
			desolation(true);
		}

		//U2 map settings to check for.
		mapTypes = [
			desolationGearScum(),
			desolation(MODULES.mapFunctions.challengeContinueRunning),
			quest(),
			pandemoniumDestack(),
			prestigeClimb(),
			smithyFarm(),
			mapFarm(),
			tributeFarm(),
			worshipperFarm(),
			mapDestacking(),
			prestigeRaiding(),
			mayhem(),
			insanity(),
			pandemoniumFarm(),
			alchemy(),
			hypothermia(),
			hdFarm(),
			voidMaps(),
			quagmire(),
			mapBonus(),
			glass(),
			smithless(),
			wither()
		];
	}

	for (const map of mapTypes) {
		if (map.shouldRun) {
			farmingDetails = map;
			break;
		}
	}

	if (mapSettings.voidFarm) farmingDetails = hdFarm(false, true);

	//If in desolation then check if we should destack before farming.
	if (farmingDetails.mapName !== '' && challengeActive('Desolation') && getPageSetting('desolation') && !MODULES.mapFunctions.desolation.gearScum && (MODULES.mapFunctions.challengeContinueRunning || (game.challenges.Desolation.chilled > 0 && !farmingDetails.mapName.includes('Desolation Destacking')))) {
		var desolationCheck = desolation(true);
		if (desolationCheck.shouldRun) farmingDetails = desolationCheck;
	}

	farmingDetails.levelCheck = farmingDetails.autoLevel ? farmingDetails.mapLevel : Infinity;

	mapSettings = farmingDetails;
}

//Checks to see if the line from the settings should run
function settingShouldRun(currSetting, world, zoneReduction) {
	if (!currSetting) return false;
	if (!world) return false;
	if (!zoneReduction) zoneReduction = 0;
	world += zoneReduction;
	//Skips if line isn't active then skips
	if (!currSetting.active) return false;
	//If world input is greater than current zone then skips
	if (game.global.world < world) return false;
	//Skips if repeat every is set to 0 and the world is greater than the current world.

	if (game.global.world > world && currSetting.repeatevery === 0) return false;
	//Skips if repeat every is set to 0 and the world is greater than the current world.
	if (typeof currSetting.repeatevery === 'undefined' && typeof currSetting.repeat === 'undefined' && typeof currSetting.hdType === 'undefined' && typeof currSetting.voidHDRatio === 'undefined' && game.global.world > world) return false;
	//If the setting is marked as done then skips.
	var totalPortals = getTotalPortals();
	if (currSetting.done === totalPortals + "_" + game.global.world) return false;
	//Skips if past designated end zone
	if (game.global.world > currSetting.endzone + zoneReduction) return false;
	//Skips if past designated max void zone
	if (typeof currSetting.maxvoidzone !== 'undefined' && game.global.world > (currSetting.maxvoidzone + zoneReduction)) return false;
	//Check to see if the cell is liquified and if so we can replace the cell condition with it
	var liquified = game.global.lastClearedCell === -1 && game.global.gridArray && game.global.gridArray[0] && game.global.gridArray[0].name === "Liquimp";
	//If cell input is greater than current zone then skips
	if (!liquified && game.global.lastClearedCell + 2 < currSetting.cell) return false;
	//Skips if challenge type isn't set to the type we're currently running or if it's not the challenge that's being run.
	if (typeof currSetting.runType !== 'undefined' && currSetting.runType !== 'All') {
		if (!hdStats.isC3 && !hdStats.isDaily && (currSetting.runType !== 'Filler' ||
			(currSetting.runType === 'Filler' && (currSetting.challenge !== 'All' && currSetting.challenge !== hdStats.currChallenge)))) return false;
		if (hdStats.isDaily && currSetting.runType !== 'Daily') return false;
		if (hdStats.isC3 && (currSetting.runType !== 'C3' ||
			(currSetting.runType === 'C3' && (currSetting.challenge3 !== 'All' && currSetting.challenge3 !== hdStats.currChallenge)))) return false;
	}
	return true;
}

//Prestige Raiding

//Checks if map we want to run has equips
function prestigeMapHasEquips(number, raidzones, targetPrestige) {
	if (equipsToGet((raidzones - number), targetPrestige)[0] > 0) return true;
	return false;
}

//Set sliders for prestige raiding
function prestigeRaidingSliders(mapNumber, raidzones, special) {
	if (!special) special = getAvailableSpecials('p');
	var map = (raidzones - game.global.world - mapNumber);
	//Skips map levels above x5 if we have scientist4 or microchip4. Will subtract 5 from the map level to account for this.
	if (getSLevel() >= 4 && !challengeActive("Mapology")) {
		var levelsToSkip = [0, 9, 8, 7, 6];
		if (levelsToSkip.includes((raidzones - mapNumber).toString().slice(-1))) map = map - 5;
	}

	document.getElementById("biomeAdvMapsSelect").value = getBiome('fragConservation');
	document.getElementById("mapLevelInput").value = raidzones >= game.global.world ? game.global.world : raidzones;
	document.getElementById("advExtraLevelSelect").value = map;
	document.getElementById("advSpecialSelect").value = special;
	document.getElementById("lootAdvMapsRange").value = 9;
	document.getElementById("sizeAdvMapsRange").value = 9;
	document.getElementById("difficultyAdvMapsRange").value = 9;
	document.getElementById("advPerfectCheckbox").dataset.checked = true;

	//Set loot slider to 0 and perfect maps off if using frag min setting!
	if (mapSettings.fragSetting === '1') {
		document.getElementById("lootAdvMapsRange").value = 0;
		document.getElementById("difficultyAdvMapsRange").value = 0;
		document.getElementById("advPerfectCheckbox").dataset.checked = false;
	}

	updateMapCost();

	//Gradually reduce map sliders if not using frag max setting!
	if (mapSettings.fragSetting !== '2') {
		if (updateMapCost(true) <= game.resources.fragments.owned) return updateMapCost(true);
		document.getElementById("advPerfectCheckbox").dataset.checked = false;
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
		if (document.getElementById("advSpecialSelect").value === "0") return updateMapCost(true);
	}
	return updateMapCost(true);
}

//Identify total cost of prestige raiding maps
function prestigeTotalFragCost(raidZones, targetPrestige, special, incrementMaps, getCost) {
	var cost = 0;

	if (equipsToGet(raidZones, targetPrestige)[0]) {
		cost += prestigeRaidingSliders(0, raidZones, special);
	}
	if (incrementMaps) {
		if (equipsToGet((raidZones - 1), targetPrestige)[0]) {
			cost += prestigeRaidingSliders(1, raidZones, special);
		}
		if (equipsToGet((raidZones - 2), targetPrestige)[0]) {
			cost += prestigeRaidingSliders(2, raidZones, special);
		}
		if (equipsToGet((raidZones - 3), targetPrestige)[0]) {
			cost += prestigeRaidingSliders(3, raidZones, special);
		}
		if (equipsToGet((raidZones - 4), targetPrestige)[0]) {
			cost += prestigeRaidingSliders(4, raidZones, special);
		}
	}

	if (getCost) return cost;
	if (game.resources.fragments.owned >= cost) return true;
	else return false;
}

function mapCost(pluslevel, special, biome, mapSliders, onlyPerfect) {
	var maplevel = pluslevel < 0 ? game.global.world + pluslevel : game.global.world;
	if (!pluslevel || pluslevel < 0) pluslevel = 0;
	if (!special) special = '0';
	if (!biome) biome = getBiome();
	if (!mapSliders) mapSliders = [9, 9, 9];
	if (mapSliders !== [9, 9, 9]) onlyPerfect = false;
	document.getElementById("biomeAdvMapsSelect").value = biome;
	document.getElementById("advExtraLevelSelect").value = pluslevel;
	document.getElementById("advSpecialSelect").value = special;
	document.getElementById("lootAdvMapsRange").value = mapSliders[0];
	document.getElementById("sizeAdvMapsRange").value = mapSliders[1];
	document.getElementById("difficultyAdvMapsRange").value = mapSliders[2];
	document.getElementById("advPerfectCheckbox").dataset.checked = true;
	document.getElementById("mapLevelInput").value = maplevel;
	updateMapCost();

	if (!onlyPerfect) {
		if (updateMapCost(true) > game.resources.fragments.owned && !challengeActive('Metal')) {
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

	cost = perfectMapCost(mapSettings.mapLevel, mapSettings.special);

	if (game.resources.fragments.owned >= cost)
		return true;
	else
		return false;
}

function fragmentFarm() {

	var fragMapPurchased = false;
	var fragCheck = true;

	//Check to see if we can afford a perfect map with the maplevel & special selected
	if (fragMapFarmCost()) {
		fragCheck = true;
		MODULES.maps.fragmentFarming = false;
		initialFragmentMapID = undefined;
	} else {

		//Safety precaution in case of error with purchased map(s) getting recycled
		if (initialFragmentMapID !== undefined && game.global.mapsOwnedArray[getMapIndex(initialFragmentMapID)] === undefined) {
			debug("There was an error with your purchased map(s). Restarting the fragment farming procedure.")
			initialFragmentMapID = undefined;
		}

		MODULES.maps.fragmentFarming = true;
		fragCheck = false;
		if (initialFragmentMapID === undefined && game.global.preMapsActive) {
			//debug("Check complete for fragment farming map");
			mapCost(game.talents.mapLoot.purchased ? -1 : 0, getAvailableSpecials('fa'), getBiome('fragments'), [9, 9, 9], false);
			if ((updateMapCost(true) <= game.resources.fragments.owned)) {
				buyMap();
				fragMapPurchased = true;
				if (fragMapPurchased) {
					initialFragmentMapID = game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1].id;
				}
			}
		}
		if (game.global.preMapsActive && !game.global.mapsActive && fragMapPurchased && initialFragmentMapID !== undefined) {
			debug("Fragment farming for a " + (mapSettings.mapLevel >= 0 ? "+" : "") + mapSettings.mapLevel + " " + mapSettings.special + " map.", "maps");
			selectMap(initialFragmentMapID);
			runMap();
			var fragmentMapID = initialFragmentMapID;
			initialFragmentMapID = undefined;
		}
		if (!game.global.repeatMap && game.resources.fragments.owned < perfectMapCost(mapSettings.mapLevel, mapSettings.special))
			repeatClicked();
		if (game.resources.fragments.owned >= perfectMapCost(mapSettings.mapLevel, mapSettings.special) && game.global.mapsActive && fragMapPurchased && fragmentMapID !== undefined) {
			if (!fragMapFarmCost()) {
				if (!game.global.repeatMap) {
					repeatClicked();
				}
			} else if (fragMapFarmCost()) {
				if (game.global.repeatMap) {
					repeatClicked();
				}
				if (game.global.preMapsActive && fragMapPurchased && fragmentMapID !== undefined) {
					fragMapPurchased = false;
				}
				fragCheck = true;
				MODULES.maps.fragmentFarming = false;
				debug("Fragment farming successful", "maps");
			}
		}
	}

	if (fragCheck) {
		perfectMapCost(mapSettings.mapLevel, mapSettings.special)
	}

	updateMapCost();
}

function minMapFrag(level, specialModifier, biome, sliders) {

	if (!sliders) sliders = [9, 9, 9];
	var perfect = true;
	if (game.resources.fragments.owned < perfectMapCost_Actual(level, specialModifier, biome)) {
		perfect = false;

		while (sliders[0] > 0 && sliders[2] > 0 && perfectMapCost_Actual(level, specialModifier, biome, sliders, perfect) > game.resources.fragments.owned) {
			sliders[0] -= 1;
			if (perfectMapCost_Actual(level, specialModifier, biome, sliders, perfect) <= game.resources.fragments.owned) break;
			sliders[2] -= 1;
		}
	}

	return perfectMapCost_Actual(level, specialModifier, biome, sliders, perfect);
}

function perfectMapCost(pluslevel, special, biome) {
	var maplevel = pluslevel < 0 ? game.global.world + pluslevel : game.global.world;
	if (!pluslevel || pluslevel < 0) pluslevel = 0;
	if (!special) special = '0';
	if (!biome) biome = getBiome();
	document.getElementById("biomeAdvMapsSelect").value = biome;
	document.getElementById("advExtraLevelSelect").value = pluslevel;
	document.getElementById("advSpecialSelect").value = special;
	document.getElementById("lootAdvMapsRange").value = 9;
	document.getElementById("sizeAdvMapsRange").value = 9;
	document.getElementById("difficultyAdvMapsRange").value = 9;
	document.getElementById("advPerfectCheckbox").dataset.checked = true;
	document.getElementById("mapLevelInput").value = maplevel;
	updateMapCost();

	return updateMapCost(true);
}

function perfectMapCost_Actual(plusLevel, specialModifier, biome, sliders = [9, 9, 9], perfect = true) {
	if (!specialModifier) return Infinity
	if (!plusLevel && plusLevel !== 0) return Infinity
	var specialModifier = specialModifier;
	var plusLevel = plusLevel;
	var baseCost = 0;
	//All sliders at 9
	baseCost += sliders[0];
	baseCost += sliders[1];
	baseCost += sliders[2];
	var mapLevel = game.global.world;
	if (plusLevel < 0)
		mapLevel = mapLevel + plusLevel;
	if (mapLevel < 6)
		mapLevel = 6;
	baseCost *= (game.global.world >= 60) ? 0.74 : 1;
	//Perfect checked
	if (perfect && sliders.reduce(function (a, b) { return a + b; }, 0) === 27) baseCost += 6;
	//Adding in plusLevels
	if (plusLevel > 0)
		baseCost += (plusLevel * 10)
	if (specialModifier !== "0")
		baseCost += mapSpecialModifierConfig[specialModifier].costIncrease;
	baseCost += mapLevel;
	baseCost = Math.floor((((baseCost / 150) * (Math.pow(1.14, baseCost - 1))) * mapLevel * 2) * Math.pow((1.03 + (mapLevel / 50000)), mapLevel));
	baseCost *= biome !== 'Random' ? 2 : 1;
	return baseCost;
}

//Runs a map WITHOUT resetting the mapRunCounter variable so that we can have an accurate count of how many maps we've run
//Check and update each patch!
function runMap_AT() {
	if (game.options.menu.pauseGame.enabled) return;
	if (game.global.lookingAtMap === "") return;
	if (challengeActive("Mapology") && !game.global.currentMapId) {
		if (game.challenges.Mapology.credits < 1) {
			message("You are all out of Map Credits! Clear some more Zones to earn some more.", "Notices");
			return;
		}
		game.challenges.Mapology.credits--;
		if (game.challenges.Mapology.credits <= 0) game.challenges.Mapology.credits = 0;
		updateMapCredits();
		messageMapCredits()
	}
	if (game.achievements.mapless.earnable) {
		game.achievements.mapless.earnable = false;
		game.achievements.mapless.lastZone = game.global.world;
	}
	if (challengeActive('Quest') && game.challenges.Quest.questId === 5 && !game.challenges.Quest.questComplete) {
		game.challenges.Quest.questProgress++;
		if (game.challenges.Quest.questProgress === 1) game.challenges.Quest.failQuest();
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
	if (game.global.lastClearedMapCell === -1) {
		buildMapGrid(mapId);
		drawGrid(true);

		if (mapObj.location === "Void") {
			game.global.voidDeaths = 0;
			game.global.voidBuff = mapObj.voidBuff;
			setVoidBuffTooltip();
		}
	}
	if (challengeActive('Insanity')) game.challenges.Insanity.drawStacks();
	if (challengeActive('Pandemonium')) game.challenges.Pandemonium.drawStacks();
}

function dailyModiferReduction() {
	if (!challengeActive('Daily')) return 0;

	var dailyMods = dailyModifiersOutput().split('<br>');
	dailyMods.length = dailyMods.length - 1;
	var dailyReduction = 0;
	var settingsArray = getPageSetting('dailyPortalSettingsArray');

	for (var item in settingsArray) {
		if (!settingsArray[item].enabled) continue;
		var dailyReductionTemp = 0;
		var modifier = item;
		if (modifier.includes('Weakness')) modifier = 'Enemies stack a debuff with each attack, reducing Trimp attack by';
		else if (modifier.includes('Famine')) modifier = 'less Metal, Food, Wood, and Gems from all sources';
		else if (modifier.includes('Large')) modifier = 'All housing can store';
		else if (modifier.includes('Void')) modifier = 'Enemies in Void Maps have';
		else if (modifier.includes('Heirlost')) modifier = 'Heirloom combat and resource bonuses are reduced by';

		for (var x = 0; x < dailyMods.length; x++) {
			if (dailyMods[x].includes(modifier)) {
				dailyReductionTemp = settingsArray[item].zone
			}
			if (dailyReduction > dailyReductionTemp) dailyReduction = dailyReductionTemp;
		}
	}
	return dailyReduction
}

function dailyOddOrEven() {
	const skipDetails = {
		active: false,
		oddMult: 1,
		evenMult: 1,
		skipZone: false,
		slipPct: 0,
		slipMult: 0,
		slipType: '',
		remainder: 0,
	}
	if (!challengeActive('Daily')) return skipDetails;
	if (!getPageSetting('mapOddEvenIncrement')) return skipDetails;
	//Skip if we're on the last zone of a nature band to ensure we don't accidentally farm in the wrong band type
	if (game.global.world >= getNatureStartZone() && getEmpowerment() !== getZoneEmpowerment(game.global.world + 1)) return skipDetails;

	//Odd trimp nerf - 30-80%
	if (typeof game.global.dailyChallenge.oddTrimpNerf !== 'undefined') {
		skipDetails.oddMult -= dailyModifiers.oddTrimpNerf.getMult(game.global.dailyChallenge.oddTrimpNerf.strength);
	}
	//Even trimp buff - 120-300%
	if (typeof game.global.dailyChallenge.evenTrimpBuff !== 'undefined') {
		skipDetails.evenMult = dailyModifiers.evenTrimpBuff.getMult(game.global.dailyChallenge.evenTrimpBuff.strength);
	}
	//Dodge Dailies -- 2-30%!
	if (typeof game.global.dailyChallenge.slippery !== "undefined") {
		skipDetails.slipStr = game.global.dailyChallenge.slippery.strength / 100;
		skipDetails.slipPct = skipDetails.slipStr > 15 ? skipDetails.slipStr - 15 : skipDetails.slipStr;
		skipDetails.slipMult = 0.02 * skipDetails.slipPct * 100;
		if (skipDetails.slipStr > 0.15) skipDetails.slipType = 'even';
		else skipDetails.slipType = 'odd';
	}

	//Return if no even/odd or dodge daily mods
	if (skipDetails.oddMult === 1 && skipDetails.evenMult === 1 && skipDetails.slipType === '') return skipDetails;

	//If we have even AND odd mods, set odd to 0
	if (skipDetails.oddMult !== 1 && skipDetails.evenMult !== 1) {
		if (skipDetails.slipType !== '') {
			//Sets evenMult to 0 if we have an even dodge daily and it's over 20%
			if (skipDetails.slipType === 'even' && skipDetails.slipMult > 15) {
				skipDetails.evenMult = 0;
			}
			//Sets evenMult to 0 if we have an even dodge daily and it's over 10% and oddMult is less than 50%
			else if (skipDetails.slipType === 'even' && skipDetails.slipMult > 10 && skipDetails.oddMult > 0.5) {
				skipDetails.evenMult = 0;
			}
			//Sets oddMult to 0 if we have an odd dodge daily
			else if (skipDetails.slipType === 'odd') {
				skipDetails.oddMult = 0;
			}
		} //Set oddMult to 0 if we don't have a dodge daily
		else {
			skipDetails.oddMult = 0;
		}
	} //If we have even OR odd mods & dodge chance, set the other mod to 0
	else if (skipDetails.slipType !== '' && (skipDetails.oddMult !== 1 || skipDetails.evenMult !== 1)) {
		if (skipDetails.slipType === 'even' && skipDetails.oddMult === 1) {
			skipDetails.evenMult = 0;
		}
		if (skipDetails.slipType === 'odd' && skipDetails.evenMult === 1) {
			skipDetails.oddMult = 0;
		}
	} //If dodge daily & no negative trimp mods then disable farming on the dodge zone
	else if (skipDetails.slipType !== '') {
		if (skipDetails.slipType === 'even') {
			skipDetails.evenMult = 0;
		}
		else if (skipDetails.slipType === 'odd') {
			skipDetails.oddMult = 0;
		}
	} //If we don't have a dodge daily then skip on odd zones. Farm on even zones.
	else if (skipDetails.evenMult !== 1) {
		skipDetails.oddMult = 0;
	}

	if (skipDetails.evenMult < 1) {
		if (game.global.world % 2 === 0)
			skipDetails.skipZone = true;
	} else if (skipDetails.oddMult < 1) {
		if (game.global.world % 2 === 1)
			skipDetails.skipZone = true;
		skipDetails.remainder = 1;
	}
	skipDetails.active = true;
	return skipDetails;
}

function getAvailableSpecials(special, skipCaches) {

	var cacheMods = [];
	var bestMod;
	if (special === undefined || special === 'undefined') return '0';

	if (special === 'lsc') cacheMods = ['lsc', 'hc', 'ssc', 'lc'];
	else if (special === 'lwc') cacheMods = ['lwc', 'hc', 'swc', 'lc'];
	else if (special === 'lmc') cacheMods = ['lmc', 'hc', 'smc', 'lc'];
	else if (special === 'lrc') cacheMods = ['lrc', 'hc', 'src', 'lc'];
	else if (special === 'p') cacheMods = ['p', 'fa'];
	else cacheMods = [special];

	var hze = getHighestLevelCleared() + 1;
	var unlocksAt = game.global.universe === 2 ? 'unlocksAt2' : 'unlocksAt';

	for (var mod of cacheMods) {
		if (typeof mapSpecialModifierConfig[mod] === 'undefined') continue;
		if ((mod === 'lmc' || mod === 'smc') && challengeActive('Transmute')) mod = mod.charAt(0) + "wc";
		if (skipCaches && mod === 'hc') continue;
		var unlock = mapSpecialModifierConfig[mod].name.includes('Research') ? mapSpecialModifierConfig[mod].unlocksAt2() : mapSpecialModifierConfig[mod][unlocksAt];
		if (unlock <= hze) {
			bestMod = mod;
			break;
		}
	}
	if (bestMod === undefined || bestMod === 'fa' && hdStats.hyperspeed) bestMod = '0';
	return bestMod;
}

//I have no idea where loot > drops, hopefully somebody can tell me one day :)
function getBiome(mapGoal, resourceGoal) {
	var biome;
	var dropBased = (challengeActive('Trapper') && game.stats.highestLevel.valueTotal() < 800) || (challengeActive('Trappapalooza') && game.stats.highestRadLevel.valueTotal() < 220);
	if (!dropBased && challengeActive('Metal')) {
		dropBased = true;
		if (!resourceGoal) resourceGoal = 'Mountain';
	}

	if (resourceGoal && dropBased) {
		if (game.global.farmlandsUnlocked && getFarmlandsResType() === game.mapConfig.locations[resourceGoal].resourceType)
			biome = 'Farmlands';
		else
			biome = resourceGoal;
	}
	else if (mapGoal === 'fragments')
		biome = 'Depths';
	else if (mapGoal === 'fragConservation')
		biome = 'Random';
	else if ((game.global.universe === 2 && game.global.farmlandsUnlocked))
		biome = 'Farmlands';
	else if (game.global.decayDone)
		biome = 'Plentiful';
	else
		biome = 'Mountain';

	return biome;
}

function resetMapVars(setting) {
	const totalPortals = getTotalPortals();
	mapSettings.levelCheck = Infinity;
	mapSettings.mapName = "";
	MODULES.maps.mapTimer = 0;
	MODULES.maps.mapRepeats = 0;
	MODULES.maps.slowScumming = false;
	game.global.mapRunCounter = 0;

	if (setting) {
		if (setting.hdType === 'hitsSurvived') MODULES.mapFunctions.hasHealthFarmed = (totalPortals + "_" + game.global.world);
		setting.done = (totalPortals + "_" + game.global.world);
	}
	saveSettings();
}

//Prints out information relating to the mapSettings object to let the user know which setting was run on which zone, cell, how long it took etc
function mappingDetails(mapName, mapLevel, mapSpecial, extra, extra2, extra3) {
	const mapType = mapName.includes('Destack') ? 'map_Destacking' : 'map_Details';
	if (!getPageSetting('spamMessages')[mapType]) return;
	if (!getPageSetting('autoMaps')) return;
	if (!mapName) return;
	if (mapName === 'HD Farm' && extra3 === 'hitsSurvived') mapName = 'Hits Survived';
	//Figuring out exact amount of maps run
	if (mapName !== 'Smithy Farm') {
		var mapProg = game.global.mapsActive ? ((getCurrentMapCell().level - 1) / getCurrentMapObject().size) : 0;
		var mappingLength = mapProg > 0 ? (game.global.mapRunCounter + mapProg).toFixed(2) : game.global.mapRunCounter;
	}
	//Setting special to current maps special if we're in a map.
	if (game.global.mapsActive) mapSpecial = getCurrentMapObject().bonus === undefined ? "no special" : getCurrentMapObject().bonus;
	if (mapSpecial === "0") mapSpecial = "no special";
	if (mapName === 'Bionic Raiding') mapSpecial = game.talents.bionic2.purchased ? 'fa' : 'no special';

	var timeMapping = MODULES.maps.mapTimer > 0 ? getZoneSeconds() - MODULES.maps.mapTimer : 0;
	var currCell = game.global.lastClearedCell + 2;
	var message = '';
	if (mapName !== 'Void Map' && mapName !== 'Quagmire Farm' && mapName !== 'Smithy Farm' && mapName !== 'Bionic Raiding' && mapName !== 'Quest') {
		message += (mapName + " (z" + game.global.world + "c" + currCell + ") took " + (mappingLength) + " (" + (mapLevel >= 0 ? "+" : "") + mapLevel + " " + mapSpecial + ")" + (mappingLength === 1 ? " map" : " maps") + " and " + formatTimeForDescriptions(timeMapping) + ".");
	}
	else if (mapName === 'Smithy Farm') {
		message += (mapName + " (z" + game.global.world + "c" + currCell + ") took " + MODULES.maps.mapRepeatsSmithy[0] + " food, " + MODULES.maps.mapRepeatsSmithy[1] + " wood, " + MODULES.maps.mapRepeatsSmithy[2] + " metal maps (" + (mapLevel >= 0 ? "+" : "") + mapLevel + ")" + " and " + formatTimeForDescriptions(timeMapping) + ".");
	}
	else if (mapName === 'Quagmire Farm') {
		message += (mapName + " (z" + game.global.world + "c" + currCell + ") took " + (mappingLength) + (mappingLength === 1 ? " map" : " maps") + " and " + formatTimeForDescriptions(timeMapping) + ".");
	}
	else {
		message += (mapName + " (z" + game.global.world + "c" + currCell + ") took " + formatTimeForDescriptions(timeMapping) + ".");
	}

	if (mapName === 'Void Map') {

		var hdObject = {
			'World HD Ratio': hdStats.hdRatio,
			'Map HD Ratio': hdStats.hdRatioMap,
			'Void HD Ratio': hdStats.hdRatioVoid,
			'Hits Survived': hdStats.hitsSurvived,
			'Hits Survived Void': hdStats.hitsSurvivedVoid,
			'Map Level': hdStats.autoLevel,
		}

		message += " Void maps were triggered by " + mapSettings.voidTrigger + ".<br>\n\
		" + (mapSettings.dropdown ? (mapSettings.dropdown.name + " \
		(Start: " + prettify(mapSettings.dropdown.hdRatio) + " | \
		End: " + prettify(hdObject[mapSettings.dropdown.name]) + ")<br>\n\
		"+ mapSettings.dropdown2.name + " \
		(Start: " + prettify(mapSettings.dropdown2.hdRatio) + " | \
		End: " + prettify(hdObject[mapSettings.dropdown2.name])) : "") + ").";
	}

	else if (mapName === 'Hits Survived') {
		message += " Finished with hits survived at  " + prettify(whichHitsSurvived()) + "/" + targetHitsSurvived() + "."
	}

	else if (mapName === 'HD Farm' && extra !== null) {
		message += " Finished with a HD Ratio of " + extra.toFixed(2) + "/" + extra2.toFixed(2) + ".";
	}

	else if (mapName === 'HD Farm') {
		message += " Finished with an auto level of " + (hdStats.autoLevel > 0 ? "+" : "") + hdStats.autoLevel + ".";
	}

	else if (mapName === 'Tribute Farm') {
		message += " Finished with " + game.buildings.Tribute.purchased + " tributes and " + game.jobs.Meteorologist.owned + " meteorologists.";
	}

	else if (mapName === 'Smithy Farm') {
		message += " Finished with " + game.buildings.Smithy.purchased + " smithies.";
	}

	else if (mapName === 'Insanity Farm') {
		message += " Finished with " + game.challenges.Insanity.insanity + " stacks.";
	}

	else if (mapName === 'Alchemy Farm') {
		message += " Finished with " + extra + " " + extra3 + ".";
	}

	else if (mapName === 'Hypothermia Farm') {
		message += " Finished with (" + prettify(game.resources.wood.owned) + "/" + prettify(extra.toFixed(2)) + ") wood.";
	}

	else if (mapName === 'Smithless Farm') {
		message += " Finished with enough damage to get " + extra + "/3 stacks.";
	}
	MODULES.maps.mapRepeats = 0;
	debug(message, mapType);
}

function mapMaxFastEnemies() {

	var map = game.global.mapsOwnedArray[getMapIndex(game.global.lookingAtMap)];


	var fastTarget = 0;
	var forceNextFast = false;
	var fastEvery = -1;
	var forced = 0;
	if (game.global.universe == 2) {
		fastTarget = map.size / 6;
		var roll = Math.floor(Math.random() * 3);
		if (roll == 0) fastTarget--;
		else if (roll == 2) fastTarget++;
		var highAdd = (map.level - game.global.world);
		if (highAdd > 0) fastTarget += (highAdd * 0.5);
		if (fastTarget < 1) fastTarget = 1;
		fastEvery = Math.floor(map.size / fastTarget);
	}

	return fastEvery
}

//I hope I never use this again. Scumming for slow map enemies!
function mapScumming(slowTarget) {

	if (!game.global.mapsActive) return;
	if (game.global.lastClearedMapCell > -1) return;
	if (!atSettings.running) return;
	console.time();
	atSettings.running = false;
	var slowCellTarget = !slowTarget ? 8 : slowTarget
	if (slowCellTarget > 9) slowCellTarget = 10;
	var firstCellSlow = false;
	var slowCount = 0;
	game.global.fighting = false;
	var i = 0;

	//Setting up variables for heirloom swapping!
	game.global.mapRunCounter = 0;
	MODULES.maps.slowScumming = true;

	//Repeats the process of exiting and re-entering maps until the first cell is slow and you have desired slow cell count on odd cells!
	while (slowCount < slowCellTarget || !firstCellSlow) {
		var mapGrid = game.global.mapGridArray;
		firstCellSlow = false;
		slowCount = 0;

		//Looping to figure out if we have enough slow enemies on odd cells
		for (var item in mapGrid) {
			if (mapGrid[item].level % 2 === 0) continue;
			if (hdStats.currChallenge === 'Desolation') {
				if (MODULES.fightinfo.exoticImps.includes(mapGrid[item].name)) slowCount++;
			}
			else if (!MODULES.fightinfo.fastImps.includes(mapGrid[item].name)) {
				slowCount++;
			}
		}

		//Checking if the first enemy is slow
		var enemyName = mapGrid[0].name;
		if (hdStats.currChallenge === 'Desolation') {
			if (MODULES.fightinfo.exoticImps.includes(enemyName)) firstCellSlow = true;
		}
		else if (!MODULES.fightinfo.fastImps.includes(enemyName)) firstCellSlow = true;

		if (slowCount < slowCellTarget || !firstCellSlow) {
			buildMapGrid(game.global.currentMapId);
			game.global.mapRunCounter = 0;
		}
		else
			break
		i++;
	}
	var msg = '';
	if (slowCount < slowCellTarget || !firstCellSlow) msg = "Failed. ";
	msg += i + " Rerolls. Current roll = " + slowCount + " odd slow enemies. First cell is " + (firstCellSlow ? "slow" : "fast") + ".";
	console.timeEnd();
	atSettings.running = true;
	debug(msg, "mapping_Details");
}