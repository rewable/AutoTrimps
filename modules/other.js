MODULES["other"] = {};

function autoRoboTrimp() {
	if (game.global.roboTrimpLevel === 0) return;
	if (game.global.roboTrimpCooldown !== 0) return;
	if (getPageSetting("AutoRoboTrimp") > game.global.world || getPageSetting("AutoRoboTrimp") <= 0) return;

	var shouldShriek = (game.global.world - parseInt(getPageSetting("AutoRoboTrimp"))) % 5 === 0;
	if (shouldShriek) {
		if (!game.global.useShriek) {
			magnetoShriek();
			debug("Activated Robotrimp MagnetoShriek Ability @ z" + game.global.world, "zone", "*podcast");
		}
	}
	else
		if (game.global.useShriek) magnetoShriek();
}

function fightalways() {
	const settingPrefix = hdStats.isC3 ? 'c2' : hdStats.isDaily ? 'd' : '';
	var spireNo = getPageSetting(settingPrefix + 'IgnoreSpiresUntil');
	var spireZone = (1 + spireNo) * 100;
	if (game.global.gridArray.length === 0 || game.global.preMapsActive || !game.upgrades.Battle.done || game.global.fighting || (game.global.spireActive && (game.global.world >= spireZone || 0 >= spireNo)))
		return;
	if (!game.global.fighting)
		fightManual();
}

function getZoneEmpowerment(zone) {
	if (!zone) return 'None';
	var natureStartingZone = game.global.universe === 1 ? getNatureStartZone() : 236;
	if (zone < natureStartingZone) return 'None';
	var activeEmpowerments = ["Poison", "Wind", "Ice"];
	zone = Math.floor((zone - natureStartingZone) / 5);
	zone = zone % activeEmpowerments.length;
	return activeEmpowerments[zone];
}

//Radon
/* function archstring() {
	if (!challengeActive('Archaeology')) return;
	if (!getPageSetting('archaeology')) return;
	if (getPageSetting('archaeologyString1') !== "undefined" && getPageSetting('archaeologyString2') !== "undefined" && getPageSetting('archaeologyString3') !== "undefined") {
		var string1 = getPageSetting('archaeologyString1'), string2 = getPageSetting('archaeologyString2'), string3 = getPageSetting('archaeologyString3');
		var string1z = string1.split(',')[0], string2z = string2.split(',')[0];
		var string1split = string1.split(',').slice(1).toString(), string2split = string2.split(',').slice(1).toString();
		if (game.global.world <= string1z && game.global.archString !== string1split)
			game.global.archString = string1split;
		else if (game.global.world > string1z && game.global.world <= string2z && game.global.archString !== string2split)
			game.global.archString = string2split;
		else if (game.global.world > string2z && game.global.archString !== string3)
			game.global.archString = string3;
	}
} */

function remainingHealth(forceAngelic, mapType) {
	if (!forceAngelic) forceAngelic = false;
	if (!mapType) mapType = 'world';

	const correctHeirloom = heirloomShieldToEquip(mapType) !== undefined ? getPageSetting(heirloomShieldToEquip(mapType)) === game.global.ShieldEquipped.name : true;
	var soldierHealth = game.global.soldierHealth;
	var soldierHealthMax = game.global.soldierHealthMax;
	var shieldHealth = 0;

	if (!correctHeirloom) {
		soldierHealth /= 1 + (calcHeirloomBonus('Shield', 'trimpHealth', 1, true) / 100);
		soldierHealth *= 1 + (calcHeirloomBonus_AT('Shield', 'trimpHealth', 1, true, heirloomShieldToEquip(mapType)) / 100);
		soldierHealthMax /= 1 + (calcHeirloomBonus('Shield', 'trimpHealth', 1, true) / 100);
		soldierHealthMax *= 1 + (calcHeirloomBonus_AT('Shield', 'trimpHealth', 1, true, heirloomShieldToEquip(mapType)) / 100);
	}

	if (game.global.universe === 2) {
		var maxLayers = Fluffy.isRewardActive('shieldlayer');
		var layers = maxLayers - game.global.shieldLayersUsed;

		var shieldMax = game.global.soldierEnergyShieldMax;
		var shieldCurr = game.global.soldierEnergyShield;
		if (!correctHeirloom) {
			const shieldPrismatic = getHeirloomBonus_AT('Shield', 'prismatic', heirloomShieldToEquip(mapType)) > 0 ? getEnergyShieldMult_AT(mapType, true) + (getHeirloomBonus_AT('Shield', 'prismatic', heirloomShieldToEquip(mapType)) / 100) : getEnergyShieldMult_AT(mapType, true);
			const currShieldPrismatic = getEnergyShieldMult_AT(mapType, true) + (getHeirloomBonus("Shield", "prismatic") / 100);
			if (currShieldPrismatic > 0) shieldMax /= currShieldPrismatic;
			shieldMax *= shieldPrismatic;
			if (currShieldPrismatic > 0) shieldCurr /= currShieldPrismatic;
			shieldCurr *= shieldPrismatic;
			shieldCurr /= 1 + (calcHeirloomBonus('Shield', 'trimpHealth', 1, true) / 100);
			shieldCurr *= 1 + (calcHeirloomBonus_AT('Shield', 'trimpHealth', 1, true, heirloomShieldToEquip(mapType)) / 100);
		}

		if (maxLayers > 0) {
			for (var i = 0; i <= maxLayers; i++) {
				if (layers !== maxLayers && i > layers) {
					continue;
				}
				if (i === maxLayers - layers) {
					shieldHealth += shieldMax;
				}
				else
					shieldHealth += shieldCurr;
			}
		}
		else {
			shieldHealth = shieldCurr;
		}
		shieldHealth = shieldHealth < 0 ? 0 : shieldHealth;
	}
	//Subtracting Plauge daily mod from health
	if (typeof game.global.dailyChallenge.plague !== 'undefined')
		soldierHealth -= soldierHealthMax * dailyModifiers.plague.getMult(game.global.dailyChallenge.plague.strength, game.global.dailyChallenge.plague.stacks);

	var remainingHealth = shieldHealth + (forceAngelic ? soldierHealth * .33 : soldierHealth);
	if ((challengeActive('Quest') && currQuest() === 8) || challengeActive('Bublé'))
		remainingHealth = shieldHealth;
	if (shieldHealth + soldierHealth === 0) {
		remainingHealth = soldierHealthMax + (shieldMax * (maxLayers + 1))
		if ((challengeActive('Quest') && currQuest() === 8) || challengeActive('Bublé'))
			remainingHealth = shieldMax * (maxLayers + 1);
	}

	if (soldierHealth <= 0) return 0;
	return (remainingHealth)
}

function equalityManagementBasic() {
	if (game.global.preMapsActive) return;
	if (game.global.gridArray.length <= 0) return;

	if (challengeActive('Desolation') && mapSettings.equality && getPageSetting('autoMaps')) {
		game.portal.Equality.scalingActive = false;
		game.portal.Equality.disabledStackCount = game.portal.Equality.radLevel;
		manageEqualityStacks();
		updateEqualityScaling();
		return;
	}

	//Looking to see if the enemy that's currently being fought is fast.
	var fastEnemy = MODULES.fightinfo.fastImps.includes(getCurrentEnemy().name);
	//Checking if the map that's active is a Deadly voice map which always has first attack.
	var voidDoubleAttack = game.global.mapsActive && getCurrentMapObject().location === "Void" && getCurrentMapObject().voidBuff === 'doubleAttack';
	//Checking if the Frenzy buff is active.
	var noFrenzy = game.portal.Frenzy.frenzyStarted === "-1" && !autoBattle.oneTimers.Mass_Hysteria.owned && game.portal.Frenzy.radLevel > 0;
	//Checking if the experience buff is active during Exterminate.
	var experienced = challengeActive('Exterminate') && game.challenges.Exterminate.experienced;
	//Checking to see if the Glass challenge is being run where all enemies are fast.
	var runningGlass = challengeActive('Glass');
	var runningDesolation = challengeActive('Desolation');

	//Toggles equality scaling on
	if ((fastEnemy && !experienced) || voidDoubleAttack || noFrenzy || runningGlass || runningDesolation) {
		if (!game.portal.Equality.scalingActive) {
			game.portal.Equality.scalingActive = true;
			manageEqualityStacks();
			updateEqualityScaling();
		}
		//Toggles equality scaling off and sets equality stacks to 0
	} else {
		if (game.portal.Equality.scalingActive) {
			game.portal.Equality.scalingActive = false;
			game.portal.Equality.disabledStackCount = "0";
			manageEqualityStacks();
			updateEqualityScaling();
		}
	}
}

function callAutoMapLevel(currentMap, currentAutoLevel, special, maxLevel, minLevel) {
	if (currentMap === '' || currentAutoLevel === Infinity) {
		if (currentAutoLevel === Infinity) currentAutoLevel = autoMapLevel(special, maxLevel, minLevel);
		if (currentAutoLevel !== Infinity && atSettings.intervals.twoSecond) currentAutoLevel = autoMapLevel(special, maxLevel, minLevel);
	}

	//Increasing Map Level
	if (atSettings.intervals.sixSecond && currentMap !== '' && (autoMapLevel(special, maxLevel, minLevel) > currentAutoLevel)) {
		currentAutoLevel = autoMapLevel(special, maxLevel, minLevel);
	}

	//Decreasing Map Level
	if (atSettings.intervals.sixSecond && currentMap !== '' && (autoMapLevel(special, maxLevel, minLevel, true) < currentAutoLevel)) {
		currentAutoLevel = autoMapLevel(special, maxLevel, minLevel, true);
	}
	return currentAutoLevel
}

function autoMapLevel(special, maxLevel, minLevel, statCheck) {
	if (!game.global.mapsUnlocked) return 0;
	if (maxLevel > 10) maxLevel = 10;
	if (!statCheck) statCheck = false;
	const z = game.global.world;
	if (z + maxLevel < 6) maxLevel = 0 - (z + 6);

	if (challengeActive('Wither') && maxLevel >= 0 && minLevel !== 0) maxLevel = -1;
	if (challengeActive('Insanity') && maxLevel >= 0 && minLevel !== 0) minLevel = 0;

	const isDaily = challengeActive('Daily');
	const hze = getHighestLevelCleared();
	const extraMapLevelsAvailable = game.global.universe === 2 ? hze >= 49 : hze >= 209;
	const haveMapReducer = game.talents.mapLoot.purchased;

	const biome = getBiome();
	const query = !special ? true : false;
	var universeSetting = (z >= 60 && hze >= 180) ? 'S' : game.upgrades.Dominance.done ? 'D' : 'X';
	const cell = game.talents.mapLoot2.purchased ? 20 : 25;
	if (!special) special = getAvailableSpecials('lmc');
	const difficulty = game.global.universe === 2 ? (hze >= 29 ? 0.75 : 1) : (hze > 209 ? 0.75 : hze > 120 ? 0.84 : 1.2);

	var maxLevel = typeof (maxLevel) === 'undefined' || maxLevel === null ? 10 : maxLevel;
	if (maxLevel > 0 && !extraMapLevelsAvailable) maxLevel = 0;
	var minLevel = typeof (minLevel) === 'undefined' || minLevel === null ? 0 - z + 6 : minLevel;
	if (minLevel < (-(game.global.world - 6))) minLevel = -(game.global.world - 6);
	const runningQuest = challengeActive('Quest') && currQuest() === 8;
	const runningUnlucky = challengeActive('Unlucky')
	const ourHealth = calcOurHealth((game.global.universe === 2 ? runningQuest : universeSetting), 'map');
	const ourBlock = game.global.universe === 1 ? calcOurBlock(universeSetting, 'map') : 0;
	const dailyCrit = challengeActive('Daily') && typeof game.global.dailyChallenge.crits !== 'undefined';
	const dailyExplosive = isDaily && typeof game.global.dailyChallenge.explosive !== 'undefined' //Explosive

	var dmgType = runningUnlucky ? 'max' : 'avg';
	var critType = 'maybe';
	var critChance = getPlayerCritChance_AT('map');
	critChance = critChance - Math.floor(critChance);
	if (challengeActive('Wither') || challengeActive('Glass') || challengeActive('Duel') || critChance < 0.1) critType = 'never';

	for (var y = maxLevel; y >= minLevel; y--) {
		var mapLevel = y;
		if (!runningUnlucky) dmgType = mapLevel > 0 ? 'min' : 'avg';
		if (y === minLevel) {
			return minLevel;
		}
		if (!statCheck && getPageSetting('onlyPerfectMaps') && game.resources.fragments.owned < perfectMapCost_Actual(mapLevel, special, biome))
			continue;
		if (!statCheck && !getPageSetting('onlyPerfectMaps') && game.resources.fragments.owned < minMapFrag(mapLevel, special, biome))
			continue;

		if (game.global.universe === 2) universeSetting = equalityQuery('Snimp', z + mapLevel, cell, 'map', difficulty, 'oneShot', true);
		var ourDmg = calcOurDmg(dmgType, universeSetting, false, 'map', critType, y, 'force');
		if (challengeActive('Duel')) ourDmg *= MODULES.heirlooms.gammaBurstPct;
		if (challengeActive('Daily') && typeof game.global.dailyChallenge.weakness !== 'undefined') ourDmg *= (1 - (9 * game.global.dailyChallenge.weakness.strength) / 100)
		var enemyHealth = calcEnemyHealthCore('map', z + mapLevel, cell, 'Turtlimp') * difficulty;

		if (maxOneShotPower(true) > 1) {
			enemyHealth *= (maxOneShotPower(true));
			if (game.global.universe === 1) ourDmg *= (0.005 * game.portal.Overkill.level);
			if (game.global.universe === 2 && !u2Mutations.tree.MadMap.purchased) ourDmg *= (0.005 * game.portal.Overkill.level);
		}
		var enemyDmg = calcEnemyAttackCore('map', z + mapLevel, cell, 'Snimp', false, false, universeSetting) * difficulty;

		if (dailyExplosive) enemyDmg *= 1 + dailyModifiers.explosive.getMult(game.global.dailyChallenge.explosive.strength);
		if (dailyCrit && getPageSetting('IgnoreCrits') === 0) enemyDmg *= dailyModifiers.crits.getMult(game.global.dailyChallenge.crits.strength);

		if (challengeActive('Duel')) {
			enemyDmg *= 10;
			if (game.challenges.Duel.trimpStacks >= 50) enemyDmg *= 3;
		}

		/* if (y === -6) {
			console.log("universeSetting = " + universeSetting + " y = " + y + " difficulty = " + difficulty + " cell = " + cell + " dmgType = " + dmgType + " critType = " + critType);
			console.log("trimpHP = " + ourHealth + " trimpDmg = " + ourDmg + " trimpBlock = " + ourBlock);
			console.log("enemyHP = " + enemyHealth + " enemyDmg = " + enemyDmg);
		} */
		if (enemyHealth <= ourDmg && enemyDmg <= (ourHealth + ourBlock)) {
			if (!query && mapLevel === 0 && minLevel < 0 && game.global.mapBonus === 10 && haveMapReducer && !challengeActive('Glass') && !challengeActive('Insanity') && !challengeActive('Mayhem'))
				mapLevel = -1;
			return mapLevel;
		}
	}
	return 0;
}

function equalityQuery(enemyName, zone, currentCell, mapType, difficulty, farmType, forceOK, hits) {

	if (!enemyName) enemyName = 'Snimp';
	if (!zone) zone = game.global.world;
	if (!mapType) mapType = 'world'
	if (!currentCell) currentCell = mapType === 'world' || mapType === 'void' ? 98 : 20;
	if (!difficulty) difficulty = 1;
	if (!farmType) farmType = 'gamma';

	if (Object.keys(game.global.gridArray).length === 0) return;
	if (game.portal.Equality.radLevel === 0 || game.global.universe === 1)
		return 0;

	const bionicTalent = zone - game.global.world;
	const checkMutations = mapType === 'world' && zone > 200;
	const titimp = mapType !== 'world' && farmType === 'oneShot' ? 'force' : false;
	const dailyEmpowerToggle = getPageSetting('empowerAutoEquality');
	const isDaily = challengeActive('Daily');
	const dailyEmpower = isDaily && typeof game.global.dailyChallenge.empower !== 'undefined'; //Empower
	const dailyCrit = isDaily && typeof game.global.dailyChallenge.crits !== 'undefined'; //Crit
	const dailyExplosive = isDaily && typeof game.global.dailyChallenge.explosive !== 'undefined' //Explosive
	const dailyBloodthirst = isDaily && typeof game.global.dailyChallenge.bloodthirst !== 'undefined'; //Bloodthirst (enemy heal + atk)
	const maxEquality = game.portal.Equality.radLevel;
	const overkillCount = maxOneShotPower(true);

	var critType = 'maybe';
	if (challengeActive('Wither') || challengeActive('Glass') || challengeActive('Duel')) critType = 'never';

	//Challenge conditions
	var runningUnlucky = challengeActive('Unlucky');
	var runningQuest = ((challengeActive('Quest') && currQuest() === 8) || challengeActive('Bublé')); //Shield break quest

	//Initialising name/health/dmg variables
	//Enemy stats
	if (enemyName === 'Improbability' && zone <= 58) enemyName = 'Blimp';
	var enemyHealth = calcEnemyHealthCore(mapType, zone, currentCell, enemyName) * difficulty;
	var enemyDmg = calcEnemyAttackCore(mapType, zone, currentCell, enemyName, false, false, 0) * difficulty;

	if (mapType === 'map' && dailyCrit || dailyExplosive) {
		if (dailyExplosive) enemyDmg *= 1 + dailyModifiers.explosive.getMult(game.global.dailyChallenge.explosive.strength);
		if (dailyEmpowerToggle && dailyCrit) enemyDmg *= dailyModifiers.crits.getMult(game.global.dailyChallenge.crits.strength);
	}
	else if (mapType === 'world' && (dailyEmpower && (dailyCrit || dailyExplosive) || hits)) {
		//if (dailyExplosive) enemyDmg *= 1 + dailyModifiers.explosive.getMult(game.global.dailyChallenge.explosive.strength);
		if (dailyCrit) enemyDmg *= dailyModifiers.crits.getMult(game.global.dailyChallenge.crits.strength);
	}
	else if (hits) {
		if (dailyCrit) enemyDmg *= dailyModifiers.crits.getMult(game.global.dailyChallenge.crits.strength);
	}

	if (challengeActive('Duel')) {
		enemyDmg *= 10;
		if (game.challenges.Duel.trimpStacks >= 50) enemyDmg *= 3;
	}
	//Our stats
	var dmgType = runningUnlucky ? 'max' : 'avg';
	var ourHealth = calcOurHealth(runningQuest, mapType);
	var ourDmg = calcOurDmg(dmgType, 0, false, mapType, critType, bionicTalent, titimp);

	var unluckyDmg = runningUnlucky ? Number(calcOurDmg('min', 0, false, mapType, 'never', bionicTalent, titimp)) : 2;

	//Figuring out gamma to proc value
	var gammaToTrigger = gammaMaxStacks();

	if (checkMutations) {
		enemyDmg = calcEnemyAttackCore(mapType, zone, currentCell, enemyName, false, calcMutationAttack(zone), 0);
		enemyHealth = calcEnemyHealthCore(mapType, zone, currentCell, enemyName, calcMutationHealth(zone));
	}
	if (!hits) hits = 1;
	enemyDmg *= hits;

	if (forceOK) {
		if (!runningUnlucky && (zone - game.global.world) > 0) dmgType = 'min';
		enemyHealth *= (1 * overkillCount);
	}
	if (challengeActive('Duel')) ourDmg *= MODULES.heirlooms.gammaBurstPct;

	if (isDaily && typeof game.global.dailyChallenge.weakness !== 'undefined') ourDmg *= (1 - ((mapType === 'map' ? 9 : gammaToTrigger) * game.global.dailyChallenge.weakness.strength) / 100);

	var ourDmgEquality = 0;
	var enemyDmgEquality = 0;
	var unluckyDmgEquality = 0;
	const ourEqualityModifier = getPlayerEqualityMult_AT(heirloomShieldToEquip(mapType));
	const enemyEqualityModifier = game.portal.Equality.getModifier();

	if (enemyHealth !== 0) {
		for (var i = 0; i <= maxEquality; i++) {
			enemyDmgEquality = enemyDmg * Math.pow(enemyEqualityModifier, i)
			ourDmgEquality = ourDmg * Math.pow(ourEqualityModifier, i);
			if (runningUnlucky) {
				unluckyDmgEquality = unluckyDmg * Math.pow(ourEqualityModifier, i);
				if (unluckyDmgEquality.toString()[0] % 2 === 1 && i !== maxEquality) continue;
			}
			if (farmType === 'gamma' && ourHealth >= enemyDmgEquality) {
				return i;
			}
			else if (farmType === 'oneShot' && ourDmgEquality > enemyHealth && ourHealth > enemyDmgEquality) {
				return i;
			}
			else if (i === maxEquality) {
				return i;
			}
		}
	}
}

//Auto Equality
function equalityManagement() {
	if (usingRealTimeOffline) {
		if (!getPageSetting('timeWarpSpeed')) {
			equalityManagementBasic();
			return;
		}
	}

	if (game.global.preMapsActive || game.global.gridArray.length <= 0)
		return;

	if (game.portal.Equality.radLevel === 0)
		return;

	//Turning off equality scaling
	game.portal.Equality.scalingActive = false;
	game.options.menu.alwaysAbandon.enabled = 1;
	//Misc vars
	var debugStats = getPageSetting('debugEqualityStats');
	var mapping = game.global.mapsActive ? true : false;
	var mapObject = mapping ? getCurrentMapObject() : null;
	var currentCell = mapping ? game.global.lastClearedMapCell + 1 : game.global.lastClearedCell + 1;
	var mapGrid = mapping ? 'mapGridArray' : 'gridArray';
	var type = (!mapping) ? "world" : (mapObject.location === "Void" ? "void" : "map");
	var zone = (type === "world" || !mapping) ? game.global.world : mapObject.level;
	var bionicTalent = mapping && game.talents.bionic2.purchased && (zone > game.global.world) ? zone : 0;
	var difficulty = mapping ? mapObject.difficulty : 1;
	var maxEquality = game.portal.Equality.radLevel;
	var armyReady = newArmyRdy();

	if (type === 'void' && getPageSetting('heirloomVoidSwap')) heirloomSwapping();

	//Daily modifiers active
	var isDaily = challengeActive('Daily')
	var dailyEmpower = isDaily && typeof game.global.dailyChallenge.empower !== 'undefined'; //Empower
	var dailyEmpowerToggle = (dailyEmpower && getPageSetting('empowerAutoEquality'));
	var dailyCrit = isDaily && typeof game.global.dailyChallenge.crits !== 'undefined'; //Crit
	var dailyExplosive = isDaily && typeof game.global.dailyChallenge.explosive !== 'undefined'; //Dmg on death
	var dailyWeakness = isDaily && typeof game.global.dailyChallenge.weakness !== 'undefined'; //% dmg reduction on hit
	var dailyBloodthirst = isDaily && typeof game.global.dailyChallenge.bloodthirst !== 'undefined'; //Bloodthirst (enemy heal + atk)
	var dailyRampage = isDaily && typeof game.global.dailyChallenge.rampage !== 'undefined'; //Rampage (trimp attack buff)

	//Challenge conditions
	var runningUnlucky = challengeActive('Unlucky');
	var runningDuel = challengeActive('Duel');
	var runningTrappa = challengeActive('Trappapalooza');
	var runningQuest = (challengeActive('Quest') && currQuest() === 8) || challengeActive('Bublé'); //Shield break quest
	var runningRevenge = challengeActive('Revenge');
	var runningArchaeology = challengeActive('Archaeology');
	var runningMayhem = challengeActive('Mayhem');
	var enemyCanPoison = runningMayhem && (mapping || currentCell === 99);
	var runningBerserk = challengeActive('Berserk');
	var runningExperienced = challengeActive('Exterminate') && game.challenges.Exterminate.experienced;
	var runningGlass = challengeActive('Glass');
	var runningDesolation = challengeActive('Desolation');
	var runningSmithless = challengeActive('Smithless') && !mapping && game.global.world % 25 === 0 && game.global.lastClearedCell === -1 && game.global.gridArray[0].ubersmith; //If UberSmith is active and not in a map

	//Perk/Talent conditions
	var noFrenzy = game.portal.Frenzy.radLevel > 0 && !autoBattle.oneTimers.Mass_Hysteria.owned;
	var angelicOwned = game.talents.angelic.purchased;
	var angelicDance = angelicOwned && (runningTrappa || runningQuest || runningArchaeology || runningBerserk || noFrenzy || dailyEmpower);

	if (runningDesolation && mapSettings.equality && game.global.world >= getPageSetting('destackOnlyZone') &&
		getPageSetting('autoMaps')) {
		game.portal.Equality.disabledStackCount = game.portal.Equality.radLevel;
		manageEqualityStacks();
		updateEqualityScaling();
		return;
	}

	//Gamma burst info
	var gammaMaxStacksCheck = gammaMaxStacks();
	var gammaDmg = MODULES.heirlooms.gammaBurstPct;
	if (gammaDmg === 1) gammaMaxStacksCheck = 0;
	var gammaToTrigger = gammaMaxStacksCheck - game.heirlooms.Shield.gammaBurst.stacks;
	var fuckGamma = (runningSmithless && (10 - game.challenges.Smithless.uberAttacks) > gammaToTrigger);

	var critType = 'maybe';
	if (challengeActive('Wither') || challengeActive('Glass')) critType = 'never';

	//Initialising Stat variables
	//Our stats
	var dmgType = runningUnlucky ? 'max' : 'avg';
	var ourHealth = remainingHealth(angelicDance, type);
	var ourHealthMax = calcOurHealth(runningQuest, type);
	var ourDmg = calcOurDmg(dmgType, 0, false, type, critType, bionicTalent, true);
	var ourDmgMax = 0;
	var plagueShield = getHeirloomBonus('Shield', 'plaguebringer') > 0;

	var unluckyDmg = runningUnlucky ? Number(calcOurDmg('min', 0, false, type, 'never', bionicTalent, true)) : 2;

	if (noFrenzy) {
		if (getPageSetting('frenzyCalc') && game.portal.Frenzy.frenzyStarted === -1) {
			ourDmg /= 1 + (0.5 * game.portal.Frenzy.radLevel);
			unluckyDmg /= 1 + (0.5 * game.portal.Frenzy.radLevel);
		}
		if (!getPageSetting('frenzyCalc') && game.portal.Frenzy.frenzyStarted !== -1) {
			ourDmg *= 1 + (0.5 * game.portal.Frenzy.radLevel);
			unluckyDmg *= 1 + (0.5 * game.portal.Frenzy.radLevel);
		}
	}
	ourDmg *= dailyRampage ? dailyModifiers.rampage.getMult(game.global.dailyChallenge.rampage.strength, game.global.dailyChallenge.rampage.stacks) : 1;
	var ourDmgEquality = 0;
	var unluckyDmgEquality = 0;

	//Enemy stats
	var enemyName = game.global[mapGrid][currentCell].name;
	var enemyHealth = game.global[mapGrid][currentCell].health;
	var enemyDmg = getCurrentEnemy().attack * totalDamageMod() * 1.5;
	if (runningMayhem) enemyDmg /= game.challenges.Mayhem.getEnemyMult();
	enemyDmg *= game.global.voidBuff === 'doubleAttack' ? 2 : (game.global.voidBuff === 'getCrit' && (gammaToTrigger > 1 || runningBerserk || runningTrappa || runningArchaeology || runningQuest)) ? 5 : 1;

	//Empower related modifiers in world
	if ((dailyEmpowerToggle && !mapping && dailyEmpower) || MODULES.maps.slowScumming) {
		if (dailyCrit) enemyDmg *= 1 + dailyModifiers.crits.getMult(game.global.dailyChallenge.crits.strength);
		if (dailyExplosive || MODULES.maps.slowScumming) ourDmgMax = calcOurDmg('max', 0, false, type, 'force', bionicTalent, true) * gammaDmg;
	}
	//Empower modifiers in maps.
	if (type === 'map' && (dailyExplosive || dailyCrit) && !MODULES.maps.slowScumming) {
		if (dailyEmpowerToggle && dailyCrit) enemyDmg *= 1 + dailyModifiers.crits.getMult(game.global.dailyChallenge.crits.strength);
		if (dailyExplosive) enemyDmg *= 1 + dailyModifiers.explosive.getMult(game.global.dailyChallenge.explosive.strength);
	}
	enemyDmg *= !dailyEmpower && (type === 'world' || type === 'void') && dailyCrit && gammaToTrigger > 1 ? 1 + dailyModifiers.crits.getMult(game.global.dailyChallenge.crits.strength) : 1;

	enemyDmg *= runningMayhem && ((!mapping && currentCell === 99) || mapping) ? 1.2 : 1
	var enemyDmgEquality = 0;
	//Misc dmg mult
	if (dailyWeakness) ourDmg *= (1 - ((game.global.dailyChallenge.weakness.stacks + (fastEnemy ? 1 : 0)) * game.global.dailyChallenge.weakness.strength) / 100);

	//Fast Enemy conditions
	var fastEnemy = !game.global.preMapsActive && (runningDesolation && mapping ? !MODULES.fightinfo.exoticImps.includes(enemyName) : MODULES.fightinfo.fastImps.includes(enemyName));
	if (type === 'world' && game.global.world > 200 && game.global.gridArray[currentCell].u2Mutation.length > 0) fastEnemy = true;
	if (!mapping && (dailyEmpower || runningSmithless)) fastEnemy = true;
	if (type === 'map' && dailyExplosive && !MODULES.maps.slowScumming) fastEnemy = true;
	if (type === 'world' && dailyExplosive) fastEnemy = true;
	if (game.global.voidBuff === 'doubleAttack') fastEnemy = true;
	if (runningArchaeology) fastEnemy = true;
	if (noFrenzy && (game.portal.Frenzy.frenzyActive() || (enemyHealth / ourDmg) > 10)) fastEnemy = true;
	if (runningTrappa) fastEnemy = true;
	if (runningDuel && !mapping) fastEnemy = true;
	if (runningQuest) fastEnemy = true;
	if (runningExperienced) fastEnemy = false;
	if (runningGlass) fastEnemy = true;
	if (runningBerserk) fastEnemy = true;
	if (runningDuel && game.challenges.Duel.enemyStacks < 10) fastEnemy = true;
	if (runningRevenge) fastEnemy = true;

	//Making sure we get the Duel health bonus by suiciding trimps with 0 equality
	if (runningDuel && getPageSetting('duel') && getPageSetting('duelHealth') && fastEnemy && (calcOurHealth(false, type) * 10 * 0.9) > ourHealth && gammaToTrigger === gammaMaxStacksCheck && game.global.armyAttackCount === 0) {
		game.portal.Equality.disabledStackCount = 0;
		if (parseNum(document.getElementById('equalityStacks').children[0].innerHTML.replace(/\D/g, '')) !== game.portal.Equality.disabledStackCount) manageEqualityStacks();
		updateEqualityScaling();
		return;
	}

	//Suiciding to get max bloodthirst stacks if our avg attacks to kill is greater than the attacks to proc a bloodthirst stack. 
	if (dailyBloodthirst && mapping && fastEnemy) {
		var maxStacks = dailyModifiers.bloodthirst.getMaxStacks(game.global.dailyChallenge.bloodthirst.strength);
		var currStacks = game.global.dailyChallenge.bloodthirst.stacks;
		var stacksToProc = dailyModifiers.bloodthirst.getFreq(game.global.dailyChallenge.bloodthirst.strength) - (game.global.dailyChallenge.bloodthirst.stacks % dailyModifiers.bloodthirst.getFreq(game.global.dailyChallenge.bloodthirst.strength));
		var avgTrimpAttack = (ourDmg * Math.pow(game.portal.Equality.getModifier(1),
			equalityQuery(enemyName, zone, currentCell, type, difficulty, 'gamma')) * gammaDmg);
		var timeToKill = enemyHealth / avgTrimpAttack;

		if (currStacks !== maxStacks && stacksToProc < timeToKill) {
			game.portal.Equality.disabledStackCount = 0;
			if (parseNum(document.getElementById('equalityStacks').children[0].innerHTML.replace(/\D/g, '')) !== game.portal.Equality.disabledStackCount) manageEqualityStacks();
			updateEqualityScaling();
			return;
		}
	}

	const ourEqualityModifier = game.portal.Equality.getModifier(1);
	const enemyEqualityModifier = game.portal.Equality.getModifier();

	if (enemyHealth > 0) {
		for (var i = 0; i <= maxEquality; i++) {
			enemyDmgEquality = enemyDmg * Math.pow(enemyEqualityModifier, i);
			ourDmgEquality = ourDmg * Math.pow(ourEqualityModifier, i);

			if (runningMayhem) enemyDmgEquality += game.challenges.Mayhem.poison;

			//Skips if we are running unlucky and our damage is odd.
			if (runningUnlucky) {
				unluckyDmgEquality = unluckyDmg * Math.pow(ourEqualityModifier, i);
				if (unluckyDmgEquality.toString()[0] % 2 === 1 && i !== maxEquality) continue;
			}
			//Check to see if we kill the enemy with our max damage on empower dailies with explosive mod. If we can then mult enemy dmg by explosive mod value to stop us gaining empower stacks.
			if (ourDmgMax > 0) {
				var ourMaxDmg = ourDmgMax * Math.pow(ourEqualityModifier, i);
				if (ourMaxDmg > enemyHealth && !MODULES.maps.slowScumming && (enemyDmgEquality * (1 + dailyModifiers.explosive.getMult(game.global.dailyChallenge.explosive.strength)) > ourHealth))
					enemyDmgEquality *= 1 + dailyModifiers.explosive.getMult(game.global.dailyChallenge.explosive.strength);
				//Make sure that we don't kill slow enemyies with our max damage. This is to stop us overkilling the next cell and getting less plaguebringer damage.
				if (MODULES.maps.slowScumming && mapping && currentCell % 2 !== 0) {
					if (ourMaxDmg * Math.pow(ourEqualityModifier, i + 1) > enemyHealth) {
						continue;
					}
				}
			}

			//Setup plaguebringer shield swapping. Will force us to kill the enemy slower for maximum plaguebringer transfer damage.
			//Now works with void maps AND in world. Setup MODULES.heirlooms.plagueSwap to true to enable.
			if (plagueShield && (MODULES.heirlooms.plagueSwap || MODULES.maps.slowScumming)) {
				var nextCell = game.global[mapGrid][currentCell + 1];
				if (nextCell) {
					var plaguebringerDamage = nextCell.plaguebringer;
					var shouldSkip = calcOurDmg('max', i, false, type, 'force', bionicTalent, true) > enemyHealth
					//Checking if we are at max plaguebringer damage. If not then skip to next equality stack if current attack will kill the enemy.
					if (((mapping && !fastEnemy) || !mapping)
						&& shouldSkip && currentCell !== (game.global[mapGrid].length - 3) && (typeof (plaguebringerDamage) === 'undefined' || plaguebringerDamage < getCurrentEnemy().maxHealth) &&
						(getCurrentEnemy().maxHealth * .05 < enemyHealth)
					) {
						while (calcOurDmg('max', i, false, type, 'force', bionicTalent, true) > getCurrentEnemy().health && i < maxEquality) {
							i++;
						}
					}
				}
			}

			if (!fastEnemy) {
				game.portal.Equality.disabledStackCount = i;
				break;
			}
			else if (ourHealth === 0 || (armyReady || (dailyEmpower && !mapping)) && (ourHealth < (ourHealthMax * (dailyEmpowerToggle ? 0.95 : 0.65))) && gammaToTrigger === gammaMaxStacksCheck && gammaMaxStacksCheck !== Infinity && !runningTrappa && !runningArchaeology && !runningBerserk) {
				if (game.global.mapsUnlocked && !mapping && !runningMayhem) {
					suicideTrimps(true);
					suicideTrimps(true);
				}
				else if (mapping && currentCell > 0 && type !== 'void' && getCurrentMapObject().location !== 'Darkness' && (!runningQuest && game.global.titimpLeft === 0)) {
					suicideTrimps(true);
					runMap_AT();
				}
				else
					game.portal.Equality.disabledStackCount = 0;
				break;
			} else if (fastEnemy && enemyDmgEquality > ourHealth) {
				game.portal.Equality.disabledStackCount = maxEquality;
			} else if (runningMayhem && fastEnemy && enemyDmgEquality > ((game.global.soldierHealth * 6) + game.challenges.Mayhem.poison)) {
				continue;
			} else if ((ourDmgEquality * gammaDmg) < enemyHealth && (gammaToTrigger > 1 || (gammaToTrigger > 1 && fuckGamma))) {
				game.portal.Equality.disabledStackCount = maxEquality;
				break;
			} else if (ourHealth > enemyDmgEquality && gammaToTrigger <= 1) {
				game.portal.Equality.disabledStackCount = i;
				break;
			} else if (ourHealth > enemyDmgEquality && ourDmgEquality > enemyHealth) {
				game.portal.Equality.disabledStackCount = i;
				break;
			} else if (ourHealth > (enemyDmgEquality * gammaToTrigger) && ourDmgEquality * gammaDmg > enemyHealth && !fuckGamma && !enemyCanPoison) {
				game.portal.Equality.disabledStackCount = i;
				break;
			} else if (ourHealth > (enemyDmgEquality * gammaToTrigger) && ourDmgEquality * gammaToTrigger > enemyHealth && !fuckGamma && !enemyCanPoison) {
				game.portal.Equality.disabledStackCount = i;
				break;
			} else if (ourHealth > (enemyDmgEquality * gammaToTrigger) && !fuckGamma && !enemyCanPoison) {
				game.portal.Equality.disabledStackCount = i;
				break;
			} else {
				game.portal.Equality.disabledStackCount = maxEquality;
			}
		}
		if (parseNum(document.getElementById('equalityStacks').children[0].innerHTML.replace(/\D/g, '')) !== game.portal.Equality.disabledStackCount) manageEqualityStacks();
		updateEqualityScaling();
		if (debugStats) queryAutoEqualityStats(ourDmgEquality, ourHealth, enemyDmgEquality, enemyHealth, i);
	}
}

//Check and update each patch!
function suicideTrimps() {
	//Throw this in so that if GS updates anything in there it won't cause AT to fuck with it till I can check it out
	//Check out mapsClicked(confirmed) && mapsSwitch(updateOnly, fromRecycle) patch notes for any changes to this section!
	if (game.global.stringVersion > '5.9.5') {
		mapsClicked();
		return;
	}

	if (game.resources.trimps.soldiers > 0) {
		game.global.soldierHealth = 0;
		game.stats.trimpsKilled.value += game.resources.trimps.soldiers;
		game.stats.battlesLost.value++;
		game.resources.trimps.soldiers = 0;
	}


	if (challengeActive('Berserk')) game.challenges.Berserk.trimpDied();
	if (challengeActive('Exterminate')) game.challenges.Exterminate.trimpDied();
	if (getPerkLevel("Frenzy")) game.portal.Frenzy.trimpDied();
	if (challengeActive('Storm')) {
		game.challenges.Storm.alpha = 0;
		game.challenges.Storm.drawStacks();
	}
	if (game.global.novaMutStacks > 0) u2Mutations.types.Nova.drawStacks();
	if (challengeActive('Smithless')) game.challenges.Smithless.drawStacks();

	game.global.mapCounterGoal = 0;
	game.global.titimpLeft = 0;
	game.global.fighting = false;
	game.global.switchToMaps = false;
	game.global.switchToWorld = false;
	game.global.mapsActive = false;
	updateGammaStacks(true);
	resetEmpowerStacks();
}

function queryAutoEqualityStats(ourDamage, ourHealth, enemyDmgEquality, enemyHealth, equalityStacks, dmgMult) {
	debug("Equality = " + equalityStacks, "debugStats");
	debug("Our dmg (min) = " + ourDamage.toFixed(3) + " | " + "Our health = " + ourHealth.toFixed(3), "debugStats");
	debug("Enemy dmg = " + enemyDmgEquality.toFixed(3) + " | " + "Enemy health = " + enemyHealth.toFixed(3), "debugStats");
	debug("Gamma Burst = " + game.heirlooms.Shield.gammaBurst.stacks + " / " + gammaMaxStacks(), "debugStats");
	if (dmgMult) debug("Mult = " + dmgMult, "debugStats");
}

function formatTimeForDescriptions(number) {
	var timeTaken = '';
	var seconds = Math.floor((number) % 60);
	var minutes = Math.floor((number / 60) % 60);
	var hours = Math.floor((number / 60 / 60) % 24);
	var days = Math.floor((number / 60 / 60 / 24) % 365);
	var years = Math.floor((number / 60 / 60 / 24 / 365));
	if (years > 0) timeTaken += (years + "y");
	if (days > 0) timeTaken += (days + "d");
	if (hours > 0) timeTaken += (hours + "h");
	if (minutes > 0) timeTaken += (minutes + "m");
	timeTaken += (seconds + "s");

	return timeTaken;
}

function timeForFormatting(number) {
	return Math.floor((getGameTime() - number) / 1000);
}

function resetSettingsPortal() {

	var value = 'value';
	if (game.global.universe === 2) value += 'U2';

	var enabled = 'enabled';
	if (game.global.universe === 2) enabled += 'U2';


	//Enabling Auto Portal
	if (getPageSetting('autoMapsPortal')) {
		autoTrimpSettings["autoMaps"][value] = 1;
		document.getElementById('autoMaps').setAttribute('class', 'toggleConfigBtn noselect settingsBtn settingBtn' + autoTrimpSettings['autoMaps'][value]);
		document.getElementById('autoMapBtn').setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings['autoMaps'][value]);
	}
	//Enabling Auto Equip
	if (getPageSetting('equipPortal')) {
		autoTrimpSettings["equipOn"][enabled] = true;
		const autoEquip = getPageSetting('equipOn');
		document.getElementById('equipOn').setAttribute('class', 'toggleConfigBtn noselect settingsBtn settingBtn' + autoEquip);
		document.getElementById('autoEquipLabel').parentNode.setAttribute('class', 'pointer noselect autoUpgradeBtn settingBtn' + autoEquip);
	}

	//Setting buildings button up
	if (typeof (autoTrimpSettings['buildingSettingsArray'][value].portalOption) !== 'undefined') {
		if (autoTrimpSettings['buildingSettingsArray'][value].portalOption === 'on')
			autoTrimpSettings["buildingsType"][enabled] = true;
		if (autoTrimpSettings['buildingSettingsArray'][value].portalOption === 'off')
			autoTrimpSettings["buildingsType"][enabled] = false;

		document.getElementById('buildingsType').setAttribute('class', 'toggleConfigBtn noselect settingsBtn settingBtn' + autoTrimpSettings['buildingsType'][enabled]);
		document.getElementById('autoStructureLabel').parentNode.setAttribute('class', 'toggleConfigBtn pointer noselect autoUpgradeBtn settingBtn' + autoTrimpSettings['buildingsType'][enabled]);
	}

	//Setting jobs button up
	if (typeof (autoTrimpSettings['jobSettingsArray'][value].portalOption) !== 'undefined') {
		if (autoTrimpSettings['jobSettingsArray'][value].portalOption === 'autojobs off')
			autoTrimpSettings['jobType'][value] = 0;
		if (autoTrimpSettings['jobSettingsArray'][value].portalOption === 'auto ratios')
			autoTrimpSettings['jobType'][value] = 1;
		if (autoTrimpSettings['jobSettingsArray'][value].portalOption === 'manual ratios')
			autoTrimpSettings['jobType'][value] = 2;

		const autoJobs = getPageSetting('jobType');

		document.getElementById('jobType').setAttribute('class', 'toggleConfigBtnLocal noselect settingsBtn settingBtn' + (autoJobs === 2 ? 3 : autoJobs));
		document.getElementById('autoJobLabel').parentNode.setAttribute('class', 'toggleConfigBtn pointer noselect autoUpgradeBtn settingBtn' + (autoJobs === 2 ? 3 : autoJobs));
	}

	updateButtonText();
	saveSettings();
}

function saveToSteam(saveData) {
	if (typeof greenworks === 'undefined') return;
	greenworks.saveTextToFile('TrimpsSave.sav', saveData, cloudSaveCallback, cloudSaveErrorCallback);
}

function loadFromSteam() {
	if (typeof greenworks === 'undefined') return;
	greenworks.readTextFromFile('TrimpsSave.sav', loadFromSteamCallback, loadFromSteamErrorCallback);
}

function cloudSaveCallback(data) {
}

//Check and update each patch!
function drawAllBuildings(force) {
	if (usingRealTimeOffline && !force) return;
	var elem = document.getElementById("buildingsHere");
	elem.innerHTML = "";
	for (var item in game.buildings) {
		building = game.buildings[item];
		if (building.locked === 1) continue;
		drawBuilding(item, elem);
		if (building.alert && game.options.menu.showAlerts.enabled) {
			document.getElementById("buildingsAlert").innerHTML = "!";
			if (document.getElementById(item + "Alert")) document.getElementById(item + "Alert").innerHTML = "!";
		}
	}
	updateGeneratorInfo();
}

//Check and update each patch!
function drawAllUpgrades(force) {
	if (usingRealTimeOffline && !force) return;
	var elem = document.getElementById("upgradesHere");
	elem.innerHTML = "";
	for (var item in game.upgrades) {
		if (game.upgrades[item].locked == 1) continue;
		drawUpgrade(item, elem);
		if (game.upgrades[item].alert && game.options.menu.showAlerts.enabled) {
			document.getElementById("upgradesAlert").innerHTML = "!";
			if (document.getElementById(item + "Alert")) document.getElementById(item + "Alert").innerHTML = "!";
		}
	}
	goldenUpgradesShown = false;
	displayGoldenUpgrades();
}

//Check and update each patch!
function drawAllEquipment(force) {
	if (usingRealTimeOffline && !force) return;
	var elem = document.getElementById("equipmentHere");
	elem.innerHTML = "";
	for (var item in game.equipment) {
		if (game.equipment[item].locked == 1) continue;
		drawEquipment(item, elem);
	}
	displayEfficientEquipment();
}

//Check and update each patch!
function drawAllJobs(force) {
	if (usingRealTimeOffline && !force) return;
	var elem = document.getElementById("jobsHere");
	elem.innerHTML = "";
	for (var item in game.jobs) {
		if (game.jobs[item].locked == 1) continue;
		if (item == "Geneticist" && game.global.Geneticistassist) {
			drawGeneticistassist(elem);
		}
		else
			drawJob(item, elem);
		if (game.jobs[item].alert && game.options.menu.showAlerts.enabled) {
			document.getElementById("jobsAlert").innerHTML = "!";
			if (document.getElementById(item + "Alert")) document.getElementById(item + "Alert").innerHTML = "!";
		}
	}
}

//Check and update each patch!
function updateLabels(force) { //Tried just updating as something changes, but seems to be better to do all at once all the time
	if (usingRealTimeOffline && !force) return;
	var toUpdate;
	//Resources (food, wood, metal, trimps, science). Per second will be handled in separate function, and called from job loop.
	for (var item in game.resources) {
		toUpdate = game.resources[item];
		if (!(toUpdate.owned > 0)) {
			toUpdate.owned = parseFloat(toUpdate.owned);
			if (!(toUpdate.owned > 0)) toUpdate.owned = 0;
		}
		if (item == "radon") continue;
		if (item == "helium" && game.global.universe == 2) toUpdate = game.resources.radon;
		document.getElementById(item + "Owned").innerHTML = prettify(Math.floor(toUpdate.owned));
		if (toUpdate.max == -1 || document.getElementById(item + "Max") === null) continue;
		var newMax = toUpdate.max;
		if (item != "trimps")
			newMax = calcHeirloomBonus("Shield", "storageSize", (newMax * (game.portal.Packrat.modifier * getPerkLevel("Packrat") + 1)));
		else if (item == "trimps") newMax = toUpdate.realMax();
		document.getElementById(item + "Max").innerHTML = prettify(newMax);
		var bar = document.getElementById(item + "Bar");
		if (game.options.menu.progressBars.enabled) {
			var percentToMax = ((toUpdate.owned / newMax) * 100);
			swapClass("percentColor", getBarColorClass(100 - percentToMax), bar);
			bar.style.width = percentToMax + "%";
		}
	}
	updateSideTrimps();
	//Buildings, trap is the only unique building, needs to be displayed in trimp area as well
	for (var itemA in game.buildings) {
		toUpdate = game.buildings[itemA];
		if (toUpdate.locked == 1) continue;
		var elem = document.getElementById(itemA + "Owned");
		if (elem === null) {
			unlockBuilding(itemA);
			elem = document.getElementById(itemA + "Owned");
		}
		if (elem === null) continue;
		elem.innerHTML = (game.options.menu.menuFormatting.enabled) ? prettify(toUpdate.owned) : toUpdate.owned;
		if (itemA == "Trap") {
			var trap1 = document.getElementById("trimpTrapText")
			if (trap1) trap1.innerHTML = prettify(toUpdate.owned);
			var trap2 = document.getElementById("trimpTrapText2")
			if (trap2) trap2.innerHTML = prettify(toUpdate.owned);
		}
	}
	//Jobs, check PS here and stuff. Trimps per second is handled by breed() function
	for (var itemB in game.jobs) {
		toUpdate = game.jobs[itemB];
		if (toUpdate.locked == 1 && toUpdate.increase == "custom") continue;
		if (toUpdate.locked == 1) {
			if (game.resources[toUpdate.increase].owned > 0)
				updatePs(toUpdate, false, itemB);
			continue;
		}
		if (document.getElementById(itemB) === null) {
			unlockJob(itemB);
			drawAllJobs(true);
		}
		document.getElementById(itemB + "Owned").innerHTML = (game.options.menu.menuFormatting.enabled) ? prettify(toUpdate.owned) : toUpdate.owned;
		var perSec = (toUpdate.owned * toUpdate.modifier);
		updatePs(toUpdate, false, itemB);
	}
	//Upgrades, owned will only exist if 'allowed' exists on object
	for (var itemC in game.upgrades) {
		toUpdate = game.upgrades[itemC];
		if (toUpdate.allowed - toUpdate.done >= 1) toUpdate.locked = 0;
		if (toUpdate.locked == 1) continue;
		if (document.getElementById(itemC) === null) unlockUpgrade(itemC, true);
	}
	//Equipment
	checkAndDisplayEquipment();
}

//Hacky way to allow the SA popup button to work within TW.
autoBattle.originalpopup = autoBattle.popup;
autoBattle.popup = function () {
	var offlineMode = false;
	if (usingRealTimeOffline) {
		offlineMode = true;
		usingRealTimeOffline = false;
	}
	autoBattle.originalpopup(...arguments);
	if (offlineMode) usingRealTimeOffline = true;
}