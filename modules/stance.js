function safeSetStance(stance) {
	if (!stance && stance !== 0) return;
	if (game.global.formation === stance) return;
	const currFormation = game.global.formation;
	const formationLetter = ['X', 'H', 'D', 'B', 'S', 'W'];

	//This shouldnt be necessary?????????
	if (game.global.formation !== stance) {
		setFormation(stance.toString());
		debug("Setting stance from " + formationLetter[currFormation] + " to " + formationLetter[stance] + ".", "stance");
	}

	return true;
}

function currentStance(stance) {
	if (!stance) stance = game.global.formation;
	const formationLetter = stance === 5 ? 'W' : stance === 4 ? 'S' : stance === 3 ? 'B' : stance === 2 ? 'D' : stance === 1 ? 'H' : 'X';

	return formationLetter;
}

function calcBaseDamageInX() {
	MODULES.stats.baseMinDamage = calcOurDmg("min", "X", false, false, 'never');
	MODULES.stats.baseMaxDamage = calcOurDmg("max", "X", false, false, 'force');
	MODULES.stats.baseDamage = calcOurDmg("avg", "X");
	MODULES.stats.baseHealth = calcOurHealth(false, false, true);
	MODULES.stats.baseBlock = calcOurBlock(false);
}

function debugStance(maxPower, ignoreArmy) {
	//Returns what stance we should be using right now, or false if none grants survival
	for (var critPower = 2; critPower >= -2; critPower--) {
		if (survive("D", critPower, ignoreArmy)) { return "D" + critPower }
		else if (survive("XB", critPower, ignoreArmy)) { return "XB" + critPower }
		else if (survive("B", critPower, ignoreArmy)) { return "B" + critPower }
		else if (survive("X", critPower, ignoreArmy)) { return "X" + critPower }
		else if (survive("H", critPower, ignoreArmy)) { return "H" + critPower }
		else if (maxPower) break;
	}

	return false;
}

function canU2OverkillAT(targetZone) {
	if (!u2Mutations.tree.Overkill1.purchased) return false;

	if (!targetZone) targetZone = game.global.world;
	var allowed = .3;
	if (u2Mutations.tree.Overkill2.purchased) allowed += 0.1;
	if (u2Mutations.tree.Overkill3.purchased) allowed += 0.1;
	if (u2Mutations.tree.Liq3.purchased) {
		allowed += 0.1;
		if (u2Mutations.tree.Liq2.purchased) allowed += 0.1;
	}
	if (targetZone <= ((game.stats.highestRadLevel.valueTotal()) * allowed)) return true;
	return false;
}

function maxOneShotPower(planToMap, targetZone) {
	var power = 2;
	if (!targetZone) targetZone = game.global.world;

	if (game.global.universe === 1) {
		//No overkill perk
		if (game.portal.Overkill.level === 0) return 1;
		//Mastery
		if (game.talents.overkill.purchased) power++;
		//Fluffy
		if (Fluffy.isRewardActive("overkiller")) power += Fluffy.isRewardActive("overkiller");
		//Ice
		if (getUberEmpowerment() == "Ice") power += 2;
		if (getEmpowerment() === "Ice" && game.empowerments.Ice.getLevel() >= 50) power++;
		if (getEmpowerment() === "Ice" && game.empowerments.Ice.getLevel() >= 100) power++;
	}
	else if (game.global.universe === 2) {
		if (!canU2OverkillAT(targetZone) && planToMap && u2Mutations.tree.MadMap.purchased) return power;
		if (!canU2OverkillAT(targetZone)) return 1;

		if (u2Mutations.tree.MaxOverkill.purchased) power++;
	}

	return power;
}

function oneShotPower(specificStance, offset = 0, maxOrMin) {
	//Calculates our minimum damage
	var baseDamage = calcOurDmg(maxOrMin ? "max" : "min", specificStance, true, false, 'never');
	var damageLeft = baseDamage + addPoison(true);

	//Calculates how many enemies we can one shot + overkill
	for (var power = 1; power <= maxOneShotPower(); power++) {
		//No enemy to overkill (usually this happens at the last cell)
		if (!getCurrentEnemy(power + offset)) return power + offset - 1;

		//Enemy Health: current enemy or his neighbours
		if (power + offset > 1) damageLeft -= calcSpecificEnemyHealth(undefined, undefined, getCurrentEnemy(power + offset).level);
		else damageLeft -= getCurrentEnemy().health;

		//Check if we can one shot the next enemy
		if (damageLeft < 0) return power - 1;

		//Calculates our minimum "left over" damage, which will be used by the Overkill
		damageLeft *= 0.005 * game.portal.Overkill.level;
	}

	return power - 1;
}

function challengeDamage(maxHealth, minDamage, maxDamage, missingHealth, block, pierce, critPower = 2, formation) {
	//Pre-Init
	if (!maxHealth) maxHealth = calcOurHealth();
	if (!minDamage) minDamage = calcOurDmg("min", formation) + addPoison(true);
	if (!maxDamage) maxDamage = calcOurDmg("max", formation) + addPoison(true);
	if (!missingHealth) missingHealth = game.global.soldierHealthMax - game.global.soldierHealth;
	if (!pierce) pierce = (game.global.brokenPlanet && !game.global.mapsActive) ? getPierceAmt() : 0;
	if (!block) block = calcOurBlock(false);

	//Enemy
	var enemy = getCurrentEnemy();
	var enemyHealth = enemy.health;
	var enemyDamage = calcSpecificEnemyAttack(critPower);

	//Active Challenges
	var leadChallenge = challengeActive('Lead');
	var electricityChallenge = challengeActive('Electricity') || challengeActive('Mapocalypse');
	var dailyPlague = challengeActive('Daily') && typeof game.global.dailyChallenge.plague !== "undefined";
	var dailyBogged = challengeActive('Daily') && typeof game.global.dailyChallenge.bogged !== "undefined";
	var dailyExplosive = challengeActive('Daily') && typeof game.global.dailyChallenge.explosive !== "undefined";
	var dailyMirrored = challengeActive('Daily') && typeof game.global.dailyChallenge.mirrored !== "undefined";
	var drainChallenge = challengeActive('Nom') || challengeActive('Toxicity') || dailyPlague || dailyBogged;
	var challengeDamage = 0, harm = 0;

	//Electricity Lead - Tox/Nom
	if (electricityChallenge) challengeDamage = game.challenges.Electricity.stacks * 0.1;
	else if (drainChallenge) challengeDamage = 0.05;

	//Plague & Bogged (Daily)
	if (dailyPlague) challengeDamage = dailyModifiers.plague.getMult(game.global.dailyChallenge.plague.strength, 1 + game.global.dailyChallenge.plague.stacks);
	if (dailyBogged) challengeDamage = dailyModifiers.bogged.getMult(game.global.dailyChallenge.bogged.strength);

	//Lead - Only takes damage if the enemy doesn't die
	if (leadChallenge && minDamage < enemyHealth) harm += maxHealth * game.challenges.Lead.stacks * 0.0003;

	//Adds Drain Damage -- % of max health
	harm += maxHealth * challengeDamage;

	//Adds Bleed Damage -- % of current health
	if (game.global.voidBuff === "bleed" || (enemy.corrupted === 'corruptBleed') || enemy.corrupted === 'healthyBleed') {
		challengeDamage = (enemy.corrupted === 'healthyBleed') ? 0.30 : 0.20;
		harm += (maxHealth - missingHealth) * challengeDamage;
	}

	//Explosive Daily
	if (dailyExplosive && critPower >= 0) {
		var explosionDmg = enemyDamage * dailyModifiers.explosive.getMult(game.global.dailyChallenge.explosive.strength);
		if (maxDamage >= enemyHealth && maxHealth > block) harm += Math.max(explosionDmg - block, explosionDmg * pierce);
	}

	//Mirrored (Daily) -- Unblockable, unpredictable
	if (dailyMirrored && critPower >= -1)
		harm += Math.min(maxDamage - addPoison(true), enemyHealth) * dailyModifiers.mirrored.getMult(game.global.dailyChallenge.mirrored.strength);

	return harm;
}

function directDamage(block, pierce, currentHealth, minDamage, critPower = 2, stance = "X") {
	//Pre Init
	if (!block) block = calcOurBlock(true, true);
	if (!pierce) pierce = (game.global.brokenPlanet && !game.global.mapsActive) ? getPierceAmt() : 0;
	if (!currentHealth) currentHealth = calcOurHealth(true, false, true) - (game.global.soldierHealthMax - game.global.soldierHealth);
	if (!minDamage) minDamage = calcOurDmg("min", stance, true, false, 'never') * (game.global.titimpLeft > 0 ? 2 : 1) + addPoison(true);

	//Enemy
	var enemy = getCurrentEnemy();
	var enemyHealth = enemy.health;
	var enemyDamage = calcSpecificEnemyAttack(critPower, block, currentHealth);

	//Applies pierce
	var harm = Math.max(enemyDamage - block, pierce * enemyDamage, 0);

	//Fast Enemies
	var isDoubleAttack = game.global.voidBuff === "doubleAttack" || (enemy.corrupted === "corruptDbl") || enemy.corrupted === "healthyDbl";
	var enemyFast = isDoubleAttack || challengeActive('Slow') || ((game.badGuys[enemy.name].fast || enemy.mutation === "Corruption") && !challengeActive('Coordinate') && !challengeActive('Nom'));

	//Dodge Dailies
	if (challengeActive('Daily') && typeof game.global.dailyChallenge.slippery !== "undefined") {
		var slipStr = game.global.dailyChallenge.slippery.strength;
		var dodgeDaily = (slipStr > 15 && game.global.world % 2 === 0) || (slipStr <= 15 && game.global.world % 2 === 1);
	}

	//Double Attack and One Shot situations
	if (isDoubleAttack && minDamage < enemyHealth) harm *= 2;
	if (!enemyFast && !dodgeDaily && minDamage > enemyHealth) harm = 0;

	return harm;
}

function newArmyRdy() {
	return game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
}

function survive(formation = "S", critPower = 2, ignoreArmy) {
	//Check if the formation is valid
	if (formation === "D" && !game.upgrades.Dominance.done) return false;
	if (formation === "XB" && !game.upgrades.Barrier.done) return false;
	if (formation === "B" && !game.upgrades.Barrier.done) return false;
	if (formation === "H" && !game.upgrades.Formations.done) return false;
	if (formation === "S" && (game.global.world < 60 || game.stats.highestLevel.valueTotal() < 180)) return false;

	//Base stats
	var health = MODULES.stats.baseHealth;
	var block = MODULES.stats.baseBlock;
	var missingHealth = game.global.soldierHealthMax - game.global.soldierHealth;

	//More stats
	var minDamage = MODULES.stats.baseMinDamage;
	var maxDamage = MODULES.stats.baseMaxDamage;
	var newSquadRdy = !ignoreArmy && newArmyRdy();

	//Applies the formation modifiers
	if (formation === "XB") { health /= 2; }
	else if (formation === "D") { minDamage *= 4; maxDamage *= 4; health /= 2; block /= 2; }
	else if (formation === "B") { minDamage /= 2; maxDamage /= 2; health /= 2; block *= 4; }
	else if (formation === "H") { minDamage /= 2; maxDamage /= 2; health *= 4; block /= 2; }
	else if (formation === "S") { minDamage /= 2; maxDamage /= 2; health /= 2; block /= 2; }

	//Max health for XB formation
	var maxHealth = health * (formation === "XB" ? 2 : 1);

	//Empowerments - Poison
	minDamage += addPoison(true)
	maxDamage += addPoison(true)

	//Pierce
	var pierce = (game.global.brokenPlanet && !game.global.mapsActive) ? getPierceAmt() : 0;
	if (formation !== "B" && game.global.formation === 3) pierce *= 2;

	var notSpire = game.global.mapsActive || !game.global.spireActive;
	//Decides if the trimps can survive in this formation
	var harm = directDamage(block, pierce, health - missingHealth, minDamage, critPower, formation) + challengeDamage(maxHealth, minDamage, maxDamage, missingHealth, block, pierce, critPower, formation);

	//Updated Genes and Block
	var blockier = calcOurBlock(false, false);
	var healthier = health * Math.pow(1.01, game.jobs.Geneticist.owned - game.global.lastLowGen);
	var maxHealthier = maxHealth * Math.pow(1.01, game.jobs.Geneticist.owned - game.global.lastLowGen);
	var harm2 = directDamage(blockier, pierce, healthier, minDamage, critPower, formation) + challengeDamage(maxHealthier, minDamage, maxDamage, 0, blockier, pierce, critPower, formation);

	return (newSquadRdy && notSpire && healthier > harm2) || (health - missingHealth > harm);
}

function checkStanceSetting() {
	var settingPrefix = hdStats.isDaily ? 'd' : '';
	if (getPageSetting('AutoStanceScryer')) useScryerStance();
	else if (game.global.mapsActive && getCurrentMapObject().location === 'Void' && game.talents.scry2.purchased && getPageSetting(settingPrefix + 'scryvoidmaps')) useScryerStance();
	else {
		var AutoStance = getPageSetting('AutoStance');
		if (getPageSetting(settingPrefix + 'AutoStanceWind')) autoStanceWind();
		else if (AutoStance === 1) autoStance();
		else if (AutoStance === 2) autoStanceD();
	}
	return;
}

function autoStance(force) {
	calcBaseDamageInX();
	if (getPageSetting('AutoStance') !== 1 && !force) return;
	//Invalid Map - Dead Soldiers - Auto Stance Disabled - Formations Unavailable - No Enemy
	if (game.global.soldierHealth <= 0) return;
	if (game.global.gridArray.length === 0) return true;
	if (!getPageSetting('AutoStance')) return true;
	if (!game.upgrades.Formations.done) return true;
	if (typeof getCurrentEnemy() === 'undefined') return true;
	//Keep on D vs the Domination bosses
	if (challengeActive('Domination') && (game.global.lastClearedCell === 98 || getCurrentEnemy() && getCurrentEnemy().name === "Cthulimp")) {
		autoStanceD(true);
		return;
	}

	//Stance Selector
	if (!game.global.preMapsActive && game.global.soldierHealth > 0) {
		//If no formation can survive a mega crit, it ignores it, and recalculates for a regular crit, then no crit
		//If even that is not enough, then it ignore Explosive Daily, and finally it ignores Reflect Daily
		var critPower;
		for (critPower = 2; critPower >= -2; critPower--) {
			if (survive("D", critPower)) {
				safeSetStance(2); break;
			}
			else if (survive("XB", critPower)) {
				safeSetStance(0); break;
			}
			else if (survive("B", critPower)) {
				safeSetStance(3); break;
			}
			else if (survive("X", critPower)) {
				safeSetStance(0); break;
			}
			else if (survive("H", critPower)) {
				safeSetStance(1); break;
			}
		}

		//If it cannot survive the worst case scenario on any formation, attempt it's luck on H, if available, or X
		if (critPower < -2) {
			if (game.upgrades.Formations.done) {
				safeSetStance(1);
			}
			else {
				safeSetStance(0);
			}
		}
	}

	return true;
}

function autoStanceD(force) {
	if (getPageSetting('AutoStance') !== 2 && !force) return;
	if (game.global.gridArray.length === 0) return;
	if (game.global.soldierHealth <= 0) return;
	if (!game.upgrades.Formations.done) return;
	if (game.global.world <= 70) return;
	safeSetStance(2);
}

function autoStanceWind() {
	//Fail safes
	if (game.global.gridArray.length === 0) return;
	if (game.global.soldierHealth <= 0) return;
	if (!game.upgrades.Formations.done) return;
	if (game.global.world <= 70) return;
	var currentStance = useWindStance();
	//If we should use Wind Stance, and the checks in useWindStance don't return false then use it
	if (currentStance) {
		safeSetStance(5);
	}
	//Otherwise use your AutoStance setting.
	else {
		if (getPageSetting('AutoStance') === 1) autoStance(true)
		if (getPageSetting('AutoStance') === 2) autoStanceD(true);
	}
}

function useWindStance() {
	if (game.global.uberNature !== "Wind")
		return false;
	if (getEmpowerment() !== "Wind")
		return false;
	if (game.global.mapsActive)
		return false;
	const settingPrefix = hdStats.isDaily ? 'd' : '';
	if (!getPageSetting(settingPrefix + 'AutoStanceWind'))
		return false;

	if (checkIfLiquidZone() && getPageSetting(settingPrefix + 'WindStackingLiq'))
		return true;
	if ((hdStats.hdRatio < getPageSetting(settingPrefix + 'WindStackingRatio') || getPageSetting(settingPrefix + 'WindStackingRatio') <= 0) && game.global.world >= getPageSetting(settingPrefix + 'WindStackingZone'))
		return true;
	else
		return false;
}