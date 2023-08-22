// --------- Backend and helpers --------- 
var enableGraphsDebug = false;
function graphsDebug(message) {
	if (enableGraphsDebug)
		console.debug(...arguments);
}


function safeLocalStorage(name, data) {
	try {
		if (name === "portalDataCurrent") {
			// save at most every 450ms. Stringify is too expensive to run at max speed in timewarp, but still save every zone in liq otherwise
			if ((new Date() - lastSave) / 450 < 1) return
			else lastSave = new Date();
		}
		if (typeof data != "string") data = JSON.stringify(data);
		localStorage.setItem(name, data);
	} catch (e) {
		if (e.code == 22 || e.code == 1014) { //
			// Storage full, delete oldest 10 portals from history, and try again
			console.debug(`Deleting oldest 10 portals ${Object.keys(portalSaveData)[0]} - ${Object.keys(portalSaveData)[10]}`)
			var delCount = 10;
			for (var i = 0; i < delCount; i++) {
				delete portalSaveData[Object.keys(portalSaveData)[i]];
			}
			savePortalData(true, true); // force a blocking save
			console.warn(`Ran out of Local Storage, consider lowering your saved portals to something under ${Object.keys(portalSaveData).length}`);
		}
	}
}

// create a fake url for our compression webworker to live at. This is so cursed. (getting around cross-source issues with -monkey)
var blob = new Blob([`
  var LZString = function () { var r = String.fromCharCode, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", e = {}; function t(r, o) { if (!e[r]) { e[r] = {}; for (var n = 0; n < r.length; n++)e[r][r.charAt(n)] = n } return e[r][o] } var i = { compressToBase64: function (r) { if (null == r) return ""; var n = i._compress(r, 6, function (r) { return o.charAt(r) }); switch (n.length % 4) { default: case 0: return n; case 1: return n + "==="; case 2: return n + "=="; case 3: return n + "=" } }, decompressFromBase64: function (r) { return null == r ? "" : "" == r ? null : i._decompress(r.length, 32, function (n) { return t(o, r.charAt(n)) }) }, compressToUTF16: function (o) { return null == o ? "" : i._compress(o, 15, function (o) { return r(o + 32) }) + " " }, decompressFromUTF16: function (r) { return null == r ? "" : "" == r ? null : i._decompress(r.length, 16384, function (o) { return r.charCodeAt(o) - 32 }) }, compressToUint8Array: function (r) { for (var o = i.compress(r), n = new Uint8Array(2 * o.length), e = 0, t = o.length; e < t; e++) { var s = o.charCodeAt(e); n[2 * e] = s >>> 8, n[2 * e + 1] = s % 256 } return n }, decompressFromUint8Array: function (o) { if (null == o) return i.decompress(o); for (var n = new Array(o.length / 2), e = 0, t = n.length; e < t; e++)n[e] = 256 * o[2 * e] + o[2 * e + 1]; var s = []; return n.forEach(function (o) { s.push(r(o)) }), i.decompress(s.join("")) }, compressToEncodedURIComponent: function (r) { return null == r ? "" : i._compress(r, 6, function (r) { return n.charAt(r) }) }, decompressFromEncodedURIComponent: function (r) { return null == r ? "" : "" == r ? null : (r = r.replace(/ /g, "+"), i._decompress(r.length, 32, function (o) { return t(n, r.charAt(o)) })) }, compress: function (o) { return i._compress(o, 16, function (o) { return r(o) }) }, _compress: function (r, o, n) { if (null == r) return ""; var e, t, i, s = {}, u = {}, a = "", p = "", c = "", l = 2, f = 3, h = 2, d = [], m = 0, v = 0; for (i = 0; i < r.length; i += 1)if (a = r.charAt(i), Object.prototype.hasOwnProperty.call(s, a) || (s[a] = f++, u[a] = !0), p = c + a, Object.prototype.hasOwnProperty.call(s, p)) c = p; else { if (Object.prototype.hasOwnProperty.call(u, c)) { if (c.charCodeAt(0) < 256) { for (e = 0; e < h; e++)m <<= 1, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++; for (t = c.charCodeAt(0), e = 0; e < 8; e++)m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1 } else { for (t = 1, e = 0; e < h; e++)m = m << 1 | t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0; for (t = c.charCodeAt(0), e = 0; e < 16; e++)m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1 } 0 == --l && (l = Math.pow(2, h), h++), delete u[c] } else for (t = s[c], e = 0; e < h; e++)m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1; 0 == --l && (l = Math.pow(2, h), h++), s[p] = f++, c = String(a) } if ("" !== c) { if (Object.prototype.hasOwnProperty.call(u, c)) { if (c.charCodeAt(0) < 256) { for (e = 0; e < h; e++)m <<= 1, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++; for (t = c.charCodeAt(0), e = 0; e < 8; e++)m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1 } else { for (t = 1, e = 0; e < h; e++)m = m << 1 | t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0; for (t = c.charCodeAt(0), e = 0; e < 16; e++)m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1 } 0 == --l && (l = Math.pow(2, h), h++), delete u[c] } else for (t = s[c], e = 0; e < h; e++)m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1; 0 == --l && (l = Math.pow(2, h), h++) } for (t = 2, e = 0; e < h; e++)m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1; for (; ;) { if (m <<= 1, v == o - 1) { d.push(n(m)); break } v++ } return d.join("") }, decompress: function (r) { return null == r ? "" : "" == r ? null : i._decompress(r.length, 32768, function (o) { return r.charCodeAt(o) }) }, _decompress: function (o, n, e) { var t, i, s, u, a, p, c, l = [], f = 4, h = 4, d = 3, m = "", v = [], g = { val: e(0), position: n, index: 1 }; for (t = 0; t < 3; t += 1)l[t] = t; for (s = 0, a = Math.pow(2, 2), p = 1; p != a;)u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1; switch (s) { case 0: for (s = 0, a = Math.pow(2, 8), p = 1; p != a;)u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1; c = r(s); break; case 1: for (s = 0, a = Math.pow(2, 16), p = 1; p != a;)u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1; c = r(s); break; case 2: return "" }for (l[3] = c, i = c, v.push(c); ;) { if (g.index > o) return ""; for (s = 0, a = Math.pow(2, d), p = 1; p != a;)u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1; switch (c = s) { case 0: for (s = 0, a = Math.pow(2, 8), p = 1; p != a;)u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1; l[h++] = r(s), c = h - 1, f--; break; case 1: for (s = 0, a = Math.pow(2, 16), p = 1; p != a;)u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1; l[h++] = r(s), c = h - 1, f--; break; case 2: return v.join("") }if (0 == f && (f = Math.pow(2, d), d++), l[c]) m = l[c]; else { if (c !== h) return null; m = i + i.charAt(0) } v.push(m), l[h++] = i + m.charAt(0), i = m, 0 == --f && (f = Math.pow(2, d), d++) } } }; return i }(); "function" == typeof define && define.amd ? define(function () { return LZString }) : "undefined" != typeof module && null != module ? module.exports = LZString : "undefined" != typeof angular && null != angular && angular.module("LZString", []).factory("LZString", function () { return LZString });
  onmessage = function (event) { postMessage(LZString.compressToBase64(event.data)); self.close(); }
`], { type: 'text/javascript' })
var compressionUrl = URL.createObjectURL(blob);

// Save Portal Data to history, or current only
function savePortalData(saveAll = true, forceImmediate) {
	var currentPortal = getportalID();
	if (saveAll) {
		try {
			if (typeof window.Worker === 'function' && !forceImmediate) {
				worker = new Worker(compressionUrl);
				worker.onmessage = recievedCompressedSave;
				worker.postMessage(JSON.stringify(portalSaveData))
			}
			else {
				console.debug("Fallback to non-webworker")
				safeLocalStorage("portalDataHistory", LZString.compressToBase64(JSON.stringify(portalSaveData)))
			}
		}
		catch (e) {
			console.debug("Error saving graph history", e.code, e)
		}
	}
	else {
		var portalObj = {}
		portalObj[currentPortal] = portalSaveData[currentPortal];
		safeLocalStorage("portalDataCurrent", portalObj)
	}
}

function recievedCompressedSave(event) {
	var saveString = event.data;
	safeLocalStorage("portalDataHistory", saveString)
	console.debug("Successfully used a webworker to save graph data")
}


// Save settings, with or without updating a key
function saveSetting(key, value) {
	if (key !== null && value !== null) GRAPHSETTINGS[key] = value;
	safeLocalStorage("GRAPHSETTINGS", GRAPHSETTINGS);
}

// returns _d _h _m _s or _._s
function formatDuration(timeSince) {
	var timeObj = {
		d: Math.floor(timeSince / 86400),
		h: Math.floor(timeSince / 3600) % 24,
		m: Math.floor(timeSince / 60) % 60,
		s: Math.floor(timeSince % 60),
	}
	var milliseconds = Math.floor(timeSince % 1 * 10)
	var timeString = "";
	var unitsUsed = 0
	for (const [unit, value] of Object.entries(timeObj)) {
		if (value === 0 && timeString === "") continue;
		unitsUsed++;
		if (value) timeString += value.toString() + unit + " ";
	}
	if (unitsUsed <= 1) {
		timeString = [timeObj.s.toString().padStart(1, "0"), milliseconds.toString(), "s"].join(".");
	}
	return timeString
}

function loadGraphData() {
	var loadedData = LZString.decompressFromBase64(localStorage.getItem("portalDataHistory"));
	var currentPortal = JSON.parse(localStorage.getItem("portalDataCurrent"));
	if (loadedData != "") {
		var loadedData = JSON.parse(loadedData);
		if (currentPortal) { loadedData[Object.keys(currentPortal)[0]] = Object.values(currentPortal)[0] }
		console.log("Graphs: Found portalSaveData")
		// remake object structure
		for (const [portalID, portalData] of Object.entries(loadedData)) {
			portalSaveData[portalID] = new Portal();
			for (const [k, v] of Object.entries(portalData)) {
				portalSaveData[portalID][k] = v;
			}
		}
	}
	var loadedSettings = JSON.parse(localStorage.getItem("GRAPHSETTINGS"));
	if (loadedSettings !== null) {
		for (const [k, v] of Object.entries(loadedSettings)) {
			GRAPHSETTINGS[k] = v;
		}
	}
	// initialize save space for the toggles
	if (GRAPHSETTINGS.toggles == null) GRAPHSETTINGS.toggles = {};
	for (const graph of graphList) {
		if (graph.toggles) {
			if (GRAPHSETTINGS.toggles[graph.id] === undefined) { GRAPHSETTINGS.toggles[graph.id] = {} }
			graph.toggles.forEach((toggle) => {
				if (GRAPHSETTINGS.toggles[graph.id][toggle] === undefined) { GRAPHSETTINGS.toggles[graph.id][toggle] = false }
			})
		}
	}
	GRAPHSETTINGS.open = false;
	MODULES.graphs = {}
	MODULES.graphs.useDarkAlways = false
}

function importGraphs() {
	var currentdata = localStorage.portalDataHistory; // make a backup
	// get user input and put it in localstorage
	var exportArea = document.getElementById("exportArea")
	var data = exportArea.value;
	localStorage.portalDataHistory = data;
	portalSaveData = {} // wipe old data
	try {
		loadGraphData();
	}
	catch (e) {
		exportArea.innerHTML = "Error loading graph data, are you sure that was what you wanted to paste?"
		console.log(e)
		localStorage.portalDataHistory = currentdata
		loadGraphData()
	}
}

function importExportGraphsDialog() {
	escapeATWindows(true) // close graphs... rendering graphs while also having up to 5MB of text on display is a bad time.
	// Code shamelessly lifted from the main game. How much of this is needed?  I'm not going to find out. 
	if (game.global.lockTooltip && event != 'update') return;
	if (game.global.lockTooltip && isItIn && event == 'update') return;
	var elem = document.getElementById("tooltipDiv");
	swapClass("tooltipExtra", "tooltipExtraNone", elem);
	document.getElementById('tipText').className = "";
	var ondisplay = null; // if non-null, called after the tooltip is displayed
	openTooltip = null;

	var saveText = localStorage.portalDataHistory
	var buttonHTML;
	var downloadBlob;
	if (Blob !== null) {
		var blob = new Blob([saveText], { type: 'text/plain' });
		var uri = URL.createObjectURL(blob);
		downloadBlob = uri;
	} else {
		downloadBlob = 'data:text/plain,' + encodeURIComponent(saveText);
	}
	var saveName = `Trimps Graphs ${Object.keys(portalSaveData)[0]} - ${last(Object.keys(portalSaveData))}`;
	tooltipText = "This is your graph data. To Import, paste your data here and then click import.  If you did that and then realized you actually wanted to export, re-open this dialog and then don't do it in that order again. <br/><br/><textarea spellcheck='false' id='exportArea' style='width: 100%' rows='5'>" + saveText + "</textarea>";
	buttonHTML = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip()'>Got it</div> ";
	if (document.queryCommandSupported('copy')) {
		buttonHTML += "<div id='clipBoardBtn' class='btn btn-success'>Export</div>";
	}
	buttonHTML += `
    <div id='importBtn' class='btn btn-success' onclick='importGraphs()'>Import</div>
    <a id='downloadLink' target='_blank' download="${saveName}"'.txt', href=${downloadBlob}>
    <div class='btn btn-danger' id='downloadBtn'>Download as File</div></a>
    </div>`;

	ondisplay = tooltips.handleCopyButton();
	game.global.lockTooltip = true;
	elem.style.left = "33.75%";
	elem.style.top = "25%";

	var titleText;
	titleText = "Import/Export Graph Data"
	lastTooltipTitle = titleText;
	tip2 = ""
	var tipNum = (tip2) ? "2" : "";
	document.getElementById("tipTitle" + tipNum).innerHTML = titleText;
	document.getElementById("tipText" + tipNum).innerHTML = tooltipText;
	document.getElementById("tipCost" + tipNum).innerHTML = buttonHTML;
	elem.style.display = "block";
	if (ondisplay !== null)
		ondisplay();
}

function clearData(keepN, clrall = false) {
	// TODO it is awkward as fuck that this works on portal number, when IDs are universe + portal number.  
	// Fixing that would remove a lot of ugliness here and in deleteSpecific.
	var universe = GRAPHSETTINGS.universeSelection
	var changed = false;
	var currentPortalNumber = getTotalPortals();
	if (clrall) { // delete all but current
		for (const [portalID, portalData] of Object.entries(portalSaveData)) {
			if (portalData.totalPortals != currentPortalNumber && portalData.universe == universe) { // only delete currently selected universe data
				delete portalSaveData[portalID];
				graphsDebug(`Deleting ${portalID}, clearall ${clrall}`)
				changed = true;
			}
		}
	}
	else { // keep keepN portals in selected universe , delete the rest
		var portals = Object.entries(portalSaveData).filter((data) => data[1].universe == universe).map((data) => { return data[0] });
		// TODO 100% sure there's a better way than filter().map() but I'm not looking it up right now
		if (keepN < portals.length) graphsDebug(`Existing Portals (${Object.keys(portalSaveData).length}): ${Object.keys(portalSaveData)}`)
		while (keepN < portals.length) {
			var current = portals.shift()
			graphsDebug(`Deleting ${current}, keepn ${keepN}`)
			delete portalSaveData[current];
			changed = true;
		}
	}
	if (changed) {
		graphsDebug("Saving Portal Data after deletions")
		savePortalData(true)
		showHideUnusedGraphs();
	}
}

function deleteSpecific() {
	var portalNum = Number(document.getElementById("deleteSpecificTextBox").value);
	if (parseInt(portalNum) < 0) { clearData(Math.abs(portalNum)); } // keep X portals, delete the rest
	else {
		for (const [portalID, portalData] of Object.entries(portalSaveData)) {
			if (portalData.totalPortals === portalNum && portalData.universe == GRAPHSETTINGS.universeSelection) { // only delete if in selected universe
				delete portalSaveData[portalID];
				graphsDebug(`Deleting ${portalID}, deleteSpecific`)
			}
		}
	}
	savePortalData(true)
	showHideUnusedGraphs();
}

// Custom Function Helpers
// diff between x and x-1, or x and initial
function diff(dataVar, initial) {
	return function (portal, i) {
		var e1 = portal.perZoneData[dataVar][i];
		var e2 = initial ? initial : portal.perZoneData[dataVar][i - 1];
		if (e1 === null || e2 === null) return null;
		return e1 - e2
	}
}

const formatters = {
	datetime: function () {
		var ser = this.series;
		return '<span style="color:' + ser.color + '" >●</span> ' + ser.name + ": <b>" + formatDuration(this.y / 1000) + "</b><br>";
	},
	defaultPoint: function () {
		var ser = this.series; // 'this' being the highcharts object that uses formatter()
		return '<span style="color:' + ser.color + '" >●</span> ' + ser.name + ": <b>" + prettify(this.y) + "</b><br>";
	},
	defaultAxis: function () {
		// These are Trimps format functions for durations(modified) and numbers, respectively
		if (this.dateTimeLabelFormat) return formatDuration(this.value / 1000)
		else return prettify(this.value);
	}
}

function last(arr) {
	return arr[arr.length - 1]
}

// --------- User Interface --------- 

// Create all of the UI elements and load in scripts needed
// TODO reduce screaming
function createUI() {
	var head = document.getElementsByTagName("head")[0]


	for (const source of ["https://code.highcharts.com/highcharts.js", "https://code.highcharts.com/modules/boost.js"]) {
		var chartscript = document.createElement("script");
		chartscript.type = "text/javascript";
		chartscript.src = source
		chartscript.async = false
		head.appendChild(chartscript);
	}


	var graphsButton = document.createElement("TD");
	graphsButton.appendChild(document.createTextNode("Graphs"))
	graphsButton.setAttribute("class", "btn btn-default")
	graphsButton.setAttribute("onclick", "escapeATWindows(false); drawGraph(); swapGraphUniverse();");

	var settingbarRow = document.getElementById("settingsTable").firstElementChild.firstElementChild;
	settingbarRow.insertBefore(graphsButton, settingbarRow.childNodes[10])

	document.getElementById("settingsRow").innerHTML += `
    <div id="graphParent" style="display: none; height: 600px; overflow: auto; position: relative;">
      <div id="graph" style="margin-bottom: 10px;margin-top: 5px; height: 530px;"></div>
      <div id="graphFooter" style="height: 50px;font-size: 1em;">
        <div id="graphFooterLine1" style="display: -webkit-flex;flex: 0.75;flex-direction: row; height:30px;"></div>
        <div id="graphFooterLine2"></div>
      </div>
    </div>
    `;

	function createSelector(id, sourceList, textMod = "", onchangeMod = "") {
		var selector = document.createElement("select");
		selector.id = id;
		selector.setAttribute("style", "");
		selector.setAttribute("onchange", "saveSetting(this.id, this.value); drawGraph();" + onchangeMod);
		for (var item of sourceList) {
			var opt = document.createElement("option");
			opt.value = item;
			opt.text = textMod + item;
			selector.appendChild(opt);
		}
		//selector.value = GRAPHSETTINGS[selector.id]
		return selector;
	}

	// Create Universe and Graph selectors
	var universeFooter = document.getElementById("graphFooterLine1");
	[
		["universeSelection", [1, 2], "Universe ", " swapGraphUniverse();"],
		["u1graphSelection", graphList.filter((g) => g.universe == 1 || !g.universe).map((g) => g.selectorText)],
		["u2graphSelection", graphList.filter((g) => g.universe == 2 || !g.universe).map((g) => g.selectorText)]
	].forEach((opts) => universeFooter.appendChild(createSelector(...opts)))

	universeFooter.innerHTML += `
    <div><button onclick="drawGraph()" style="margin-left:0.5em;">Refresh</button></div>
    <div style="flex:0 100 5%;"></div>
    <div><input type="checkbox" id="clrChkbox" onclick="toggleClearButton();"></div>
    <div style="margin-left: 0.5vw;">
      <button id="clrAllDataBtn" onclick="clearData(null,true); drawGraph();" class="btn" disabled="" style="flex:auto; padding: 2px 6px;border: 1px solid white;">
        Clear All U1 Data</button></div>
    <div style="flex:0 100 5%;"></div>
    <div style="flex:0 2 3.5vw;"><input style="width:100%;min-width: 40px;" id="deleteSpecificTextBox"></div>
    <div style="flex:auto; margin-left: 0.5vw;"><button id="deleteSpecificBtn" onclick="deleteSpecific(); drawGraph();">Delete Specific U1 Portal</button></div>
    <div style="float:right; margin-right: 0.5vw;"><button onclick="toggleSpecificGraphs()">Invert Selection</button></div>
    <div style="float:right; margin-right: 1vw;"><button onclick="toggleAllGraphs()">All Off/On</button></div>
    <button onclick="importExportGraphsDialog()">Import/Export</button>`


	// AAAAAAAAAAAAAAAAAAAAAAAAAAAA (Setting the inner HTML of the parent element resets the value of these? what the fuck)
	// default to Current Universe + Clear Time if no user data exists
	document.querySelector("#universeSelection").value = GRAPHSETTINGS.universeSelection || "Universe " + getGameData.universe();
	document.querySelector("#u1graphSelection").value = GRAPHSETTINGS.u1graphSelection || "Clear Time";
	document.querySelector("#u2graphSelection").value = GRAPHSETTINGS.u2graphSelection || "Clear Time";

	var tipsText = "You can zoom by dragging a box around an area. You can turn portals off by clicking them on the legend. Quickly view the last portal by clicking it off, then Invert Selection. Or by clicking All Off, then clicking the portal on. To delete a portal, Type its portal number in the box and press Delete Specific. Using negative numbers in the Delete Specific box will KEEP that many portals (starting counting backwards from the current one), ie: if you have Portals 1000-1015, typing -10 will keep 1005-1015."
	document.getElementById("graphFooterLine2").innerHTML += `
    <span style="float: left;" onmouseover='tooltip("Tips", "customText", event, "${tipsText}")' onmouseout='tooltip("hide")'>Tips: Hover for usage tips.</span>
    <span style="float: left; margin-left: 2vw"><input type="checkbox" id="liveCheckbox" onclick="saveSetting('live', this.checked);"> Live Updates</span>
    <span style="float: left; margin-left: 2vw">Displayed Portals: <input style="width:40px;" id="portalCountTextBox" onchange="saveSetting('portalsDisplayed', this.value); updateGraph();"></span>
    <span style="float: left; margin-left: 2vw">Saved Portals: <input style="width:40px;" id="portalsSavedTextBox" onchange="saveSetting('maxGraphs', this.value); clearData(this.value); updateGraph();"></span>
    <input onclick="toggleDarkGraphs()" style="height: 20px; float: right; margin-right: 0.5vw;" type="checkbox" id="blackCB">
    <span style="float: right; margin-right: 0.5vw;">Black Graphs:</span>
    `;

	// Add a header with negative float hanging down on the top of the graph, for toggle buttons
	var toggleDiv = document.createElement("div");
	toggleDiv.id = "toggleDiv";
	toggleDiv.setAttribute("style", "position: absolute; top: 1rem; left: 3rem; z-index: 1;")
	toggleDiv.innerText = ""
	document.querySelector("#graphParent").appendChild(toggleDiv);


	// Adjust UI elements for Trimps Theme changes
	MODULES.graphs.themeChanged = function () {
		if (game && game.options.menu.darkTheme.enabled != lastTheme) {
			function f(h) {
				h.style.color = 2 == game.options.menu.darkTheme.enabled ? "" : "black";
			}
			function g(h) {
				if ("graphSelection" == h.id) return void (2 != game.options.menu.darkTheme.enabled && (h.style.color = "black"));
			}
			toggleDarkGraphs();
			var c = document.getElementsByTagName("input");
			var d = document.getElementsByTagName("select");
			var e = document.getElementById("graphFooterLine1").children;
			for (var h of c) f(h);
			for (var h of d) f(h);
			for (var h of e) f(h);
			for (var h of e) g(h);
		}
		game && (lastTheme = game.options.menu.darkTheme.enabled);
	}

	document.querySelector("#blackCB").checked = GRAPHSETTINGS.darkTheme;
	document.querySelector("#portalCountTextBox").value = GRAPHSETTINGS.portalsDisplayed;
	document.querySelector("#portalsSavedTextBox").value = GRAPHSETTINGS.maxGraphs;
	document.querySelector("#liveCheckbox").checked = GRAPHSETTINGS.live;
	MODULES.graphs.themeChanged();

}

// Show/hide the universe-specific graph selectors
function swapGraphUniverse() {
	var universe = GRAPHSETTINGS.universeSelection;
	var active = `u${universe}`
	var inactive = `u${universe == 1 ? 2 : 1}`
	document.getElementById(`${active}graphSelection`).style.display = '';
	document.getElementById(`${inactive}graphSelection`).style.display = 'none';
	document.getElementById("clrAllDataBtn").innerText = `Clear All U${universe} Data`;
	document.getElementById("deleteSpecificBtn").innerText = `Delete Specific U${universe} Portal`;
}

function toggleClearButton() {
	document.getElementById("clrAllDataBtn").disabled = !document.getElementById("clrChkbox").checked;
}

function toggleDarkGraphs() {
	if (game) {
		var darkcss = document.getElementById("dark-graph.css")
		var dark = document.getElementById("blackCB").checked;
		saveSetting("darkTheme", dark)
		if (!darkcss && dark) {
			var b = document.createElement("link");
			b.rel = "stylesheet";
			b.type = "text/css";
			b.id = "dark-graph.css";
			b.href = basepath + "dark-graph.css";
			document.head.appendChild(b);
			graphsDebug("Adding dark-graph.css file", "graphs");
		}
		else if (darkcss && !dark) {
			document.head.removeChild(darkcss)
			graphsDebug("Removing dark-graph.css file", "graphs")
		}
	}
}

// Toggle AT windows with UI, or force close with Esc
function escapeATWindows(escPressed = true) {
	var a = document.getElementById("tooltipDiv");
	if (a.style.display != "none") return void cancelTooltip(); // old code, uncertain what it's for or why it's here.
	for (elemId of ["autoSettings", "autoTrimpsTabBarMenu", "graphParent"]) {
		var elem = document.getElementById(elemId);
		if (!elem) continue;
		if (elemId === "graphParent") { // toggle Graphs window
			var open = elem.style.display === "block";
			if (escPressed) open = true; // override to always close
			elem.style.display = open ? "none" : "block";
			GRAPHSETTINGS.open = !open;
			trimpStatsDisplayed = !open; // HACKS disable hotkeys without touching Trimps settings
		}
		else { elem.style.display = "none"; } // close other windows
	}
}

// Listen for Esc key presses, somehow.  This is ancient eldritch mess, but it works?  
document.addEventListener(
	"keydown",
	function (a) {
		1 != game.options.menu.hotkeys.enabled || game.global.preMapsActive || game.global.lockTooltip
			|| ctrlPressed || heirloomsShown || 27 != a.keyCode || escapeATWindows();
	},
	true
);

// --------- Graph handling ---------

function Graph(dataVar, universe, selectorText, additionalParams = {}) {
	// graphTitle, customFunction, useAccumulator, xTitle, yTitle, formatter, xminFloor, yminFloor, yType
	this.dataVar = dataVar
	this.universe = universe; // false, 1, 2
	this.selectorText = selectorText ? selectorText : dataVar;
	this.id = selectorText.replace(/ /g, "_")
	this.graphTitle = this.selectorText;
	this.graphType = "line"
	this.customFunction;
	this.useAccumulator;
	this.xTitle = "Zone";
	this.yTitle = this.selectorText;
	this.formatter = formatters.defaultPoint;
	this.xminFloor = 1;
	this.yminFloor;
	this.yType = "Linear";
	this.graphData = [];
	this.typeCheck = "number"
	this.conditional = () => { return true };
	for (const [key, value] of Object.entries(additionalParams)) {
		this[key] = value;
	}
	this.baseGraphTitle = this.graphTitle;

	// create an object to pass to Highcharts.Chart
	this.createHighChartsObj = function () {
		return {
			chart: {
				renderTo: "graph",
				zoomType: "xy",
				animation: false,
				shadow: false,
				resetZoomButton: {
					position: {
						align: "right",
						verticalAlign: "top",
						x: -20,
						y: 15,
					},
					relativeTo: "chart",
				},
			},
			colors: ["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"],
			title: {
				text: this.graphTitle,
				x: -20,
				style: {
					fontSize: '2rem'
				}
			},
			boost: {
				useGPUTranslations: true,
				// Chart-level boost when there are more than 5 series in the chart
				seriesThreshold: 101
			},
			plotOptions: {
				series: {
					lineWidth: 1,
					animation: false,
					marker: {
						enabled: false,
					},
				},
			},
			xAxis: {
				floor: this.xminFloor,
				title: {
					text: this.xTitle,
					style: {
						fontSize: "1.5rem"
					},
				},
				labels: {
					style: {
						fontSize: "1.2rem"
					},
				},
			},
			yAxis: {
				floor: this.yminFloor,
				title: {
					text: this.yTitle,
					style: {
						fontSize: "1.5rem"
					},
				},
				plotLines: [
					{
						value: 0,
						width: 1,
						color: "#808080",
					},
				],
				type: this.yType,
				labels: {
					formatter: formatters.defaultAxis,
					style: {
						fontSize: "1.2rem"
					},
				},
				endOnTick: false,
				maxPadding: .05,
			},
			tooltip: {
				animation: false,
				shadow: false,
				pointFormatter: this.formatter,
				style: {
					fontSize: "1.2rem"
				},
			},
			legend: {
				layout: "vertical",
				align: "right",
				verticalAlign: "middle",
				borderWidth: 0,
				padding: 0,
				itemMarginBottom: 0,
				itemMarginTop: 0,
				itemStyle: {
					fontSize: "1rem",
				},
			},
			series: this.graphData,
			additionalParams: {},
		}
	}
	// Main Graphing function
	this.updateGraph = function () {
		var HighchartsObj;
		if (this.graphType == "line") HighchartsObj = this.lineGraph();
		if (this.graphType == "column") HighchartsObj = this.columnGraph();
		saveSelectedGraphs();
		chart1 = new Highcharts.Chart(HighchartsObj);
		applyRememberedSelections();
	}
	// prepares data series for Highcharts, and optionally transforms it with toggled options, customFunction and useAccumulator
	this.lineGraph = function () {
		var highChartsObj = this.createHighChartsObj() // make default object, to be customized as needed
		var item = this.dataVar;
		this.graphData = [];
		this.useAccumulator = false; // HACKS ( only one set of graphs uses an accumulator and it's on a toggle )
		var maxS3 = Math.max(...Object.values(portalSaveData).map((portal) => portal.s3).filter((s3) => s3));
		var activeToggles = [];
		if (this.toggles) {
			// Modify the chart area based on the toggles active
			activeToggles = Object.keys(toggledGraphs).filter(toggle => GRAPHSETTINGS.toggles[this.id][toggle])
			activeToggles.forEach(toggle => toggledGraphs[toggle].graphMods(this, highChartsObj)); // 
		}
		// parse data per portal
		var portalCount = 0;
		for (const portal of Object.values(portalSaveData).reverse()) {
			if (!(item in portal.perZoneData)) continue; // ignore blank
			if (portal.universe != GRAPHSETTINGS.universeSelection) continue; // ignore inactive universe
			var cleanData = [];
			// parse the requested datavar
			for (const index in portal.perZoneData[item]) {
				var x = portal.perZoneData[item][index];
				var time = portal.perZoneData.currentTime[index];
				if (typeof this.customFunction === "function") {
					x = this.customFunction(portal, index);
					if (x < 0) x = null;
				}
				// TOGGLES
				if (activeToggles.includes("perZone")) {  // must always be first 
					[x, time] = toggledGraphs.perZone.customFunction(portal, item, index, x);
				}
				for (toggle of activeToggles.filter(x => x != "perZone")) {
					try { x = toggledGraphs[toggle].customFunction(portal, item, index, x, time, maxS3); }
					catch (e) {
						x = 0;
						graphsDebug(`Error graphing data on: ${item} ${toggle}, ${e.message}`)
					}
				}
				if (this.useAccumulator) { x += last(cleanData) !== undefined ? last(cleanData)[1] : 0; }
				if (this.typeCheck && typeof x != this.typeCheck) x = null;
				cleanData.push([Number(index), x]) // highcharts expects number, number, not str, number
			}
			if (activeToggles.includes("perZone") && ["fluffy", "scruffy"].includes(item)) {
				cleanData.splice(cleanData.length - 1); // current zone is too erratic to include due to weird order of granting fluffy exp 
			}
			this.graphData.push({
				name: `Portal ${portal.totalPortals}: ${portal.challenge}`,
				data: cleanData,
			})
			portalCount++;
			if (portalCount >= GRAPHSETTINGS.portalsDisplayed) break;
		}
		this.graphData = this.graphData.reverse();
		highChartsObj.series = this.graphData;
		return highChartsObj;
	}
	// prepares multi-column data series from per-portal data.
	this.columnGraph = function () {
		var highChartsObj = this.createHighChartsObj() // make default object, to be customized as needed
		highChartsObj.xAxis.title.text = "Portal"
		highChartsObj.xAxis.floor = 0;
		highChartsObj.plotOptions.series = { groupPadding: .2, pointPadding: 0, animation: false, borderColor: "black" }
		// set up axes for each column so they scale independently
		var activeColumns = this.columns.filter(column => !(column.universe && column.universe != GRAPHSETTINGS.universeSelection));
		if (GRAPHSETTINGS.toggles[this.id].perHr) { // disable time when comparing things over time.  x/x is not interesting data.
			toggledGraphs.perHr.graphMods(false, highChartsObj)
			activeColumns = activeColumns.filter(column => column.dataVar !== "currentTime")
		}
		this.graphData = [];
		var yAxis = 0;
		var displayedColumns = [];
		for (const column of activeColumns) {
			var hasData = false;
			var cleanData = []
			var currUniPortals = Object.values(portalSaveData).filter(portal => portal.universe == GRAPHSETTINGS.universeSelection);
			for (const portal of Object.values(currUniPortals).slice(Math.max(Object.values(currUniPortals).length - GRAPHSETTINGS.portalsDisplayed, 0))) {
				//if (portal.universe != GRAPHSETTINGS.universeSelection) continue;
				var data = undefined;
				if (portal[column.dataVar]) { data = portal[column.dataVar]; }
				if (portal.perZoneData[column.dataVar]) {
					var max = last(portal.perZoneData[column.dataVar]);
					if (!max) max = Math.max(...portal.perZoneData[column.dataVar].filter(Number.isFinite))
					data = max;
				}
				if (column.customFunction) { data = column.customFunction(portal, data); }
				if (GRAPHSETTINGS.toggles[this.id].perHr) { // HACKS a headache for future me if other toggles are wanted here.
					data = data / (last(portal.perZoneData.currentTime) / 3600000);
				}
				if (data) hasData = true
				cleanData.push([portal.totalPortals, data])
			}
			if (hasData) { // only add columns if there is any data in that column over all portals
				var series = {
					name: column.title,
					data: cleanData,
					type: "column",
					yAxis: yAxis,
					color: column.color,
				}
				if (column.dataVar === "currentTime") { // HACKS override formatter for time vars
					series["tooltip"] = { "pointFormatter": formatters.datetime }
				}
				this.graphData.push(series);
				displayedColumns.push(column)
				yAxis += 1;
			}
		}
		// Label the axes
		var axes = displayedColumns.map(column => { return { visible: false, endOnTick: false } });
		// reduce padding between portals as portals increase
		highChartsObj.plotOptions.series["groupPadding"] = .5 / this.graphData[0].data.length ** .6;
		if (this.graphData[0].data.length > 15) {
			highChartsObj.plotOptions.series["borderWidth"] = 0.1;
		}
		highChartsObj.yAxis = axes;
		highChartsObj.series = this.graphData;
		return highChartsObj;
	}
}

function lookupGraph(selectorText) {
	for (const graph of graphList) {
		if (graph.selectorText === selectorText) return graph;
	}
}

// Draws the graph currently selected by the user
function drawGraph() {
	// TOGGLES
	function makeCheckbox(graph, toggle) {
		// create checkbox element labeled with the toggle
		var container = document.createElement("span")
		var checkbox = document.createElement("input");
		var label = document.createElement("span");

		container.style.padding = "0rem .5rem";

		checkbox.type = "checkbox";
		checkbox.id = toggle;
		// initialize the checkbox to saved value
		checkbox.checked = GRAPHSETTINGS.toggles[graph][toggle];
		// create a godawful inline function to set saved value on change, apply exclusions, and update the graph
		var funcString = "";
		if (toggledGraphs[toggle] && toggledGraphs[toggle].exclude) {
			toggledGraphs[toggle].exclude.forEach(exTog => funcString += `GRAPHSETTINGS.toggles.${graph}.${exTog} = false; `)
		}
		funcString += `GRAPHSETTINGS.toggles.${graph}.${toggle} = this.checked; drawGraph();`
		checkbox.setAttribute("onclick", funcString);

		label.innerText = toggle;
		label.style.color = "#757575";

		container.appendChild(checkbox)
		container.appendChild(label)
		return container;
	}
	pushData(); // update current zone data on request
	updateGraph();
	var universe = GRAPHSETTINGS.universeSelection;
	var selectedGraph = document.getElementById(`u${universe}graphSelection`);
	if (selectedGraph.value) {
		// draw the graph
		var graph = lookupGraph(selectedGraph.value);
		// create toggle elements
		toggleDiv = document.querySelector("#toggleDiv")
		toggleDiv.innerHTML = "";
		if (graph.toggles) {
			for (const toggle of graph.toggles) {
				toggleDiv.appendChild(makeCheckbox(graph.id, toggle))
			}
		}
	}
	showHideUnusedGraphs();
}

function updateGraph() {
	var universe = GRAPHSETTINGS.universeSelection;
	var selectedGraph = document.getElementById(`u${universe}graphSelection`);
	if (selectedGraph.value) {
		// draw the graph
		var graph = lookupGraph(selectedGraph.value);
		graph.updateGraph();
	}
}

// Hide graphs that have no collected data
function showHideUnusedGraphs() {
	var activeUniverses = [];
	for (const graph of graphList) {
		if (graph.graphType != "line") continue; // ignore column graphs (pure laziness, the only two always exist anyways)
		const universes = graph.universe ? [graph.universe] : [1, 2]
		for (const universe of universes) {
			var style = "none"
			for (portal of Object.values(portalSaveData)) {
				if (portal.perZoneData[graph.dataVar] && portal.universe === universe  // has collected data, in the right universe
					&& new Set(portal.perZoneData[graph.dataVar].filter(x => x === 0 || x)).size > 1) { // and there is nonzero, variable data
					style = ""
					if (!activeUniverses.includes(universe)) activeUniverses.push(universe);
					break;
				}
			}
			// hide unused graphs
			document.querySelector(`#u${universe}graphSelection [value="${graph.selectorText}"]`).style.display = style;
		}
	}
	// hide universe selector if graphs are only in one universe
	var universeSel = document.querySelector(`#universeSelection`);
	if (activeUniverses.length === 1) {
		universeSel.style.display = "none";
		GRAPHSETTINGS.universeSelection = activeUniverses[0];
		swapGraphUniverse()
	}
	else {
		universeSel.style.display = "";
	}
}

// Graph Selection 

function saveSelectedGraphs() {
	if (!chart1) return;
	for (var i = 0; i < chart1.series.length; i++) {
		GRAPHSETTINGS.rememberSelected[i] = chart1.series[i].visible;
	}
	saveSetting();
}
function applyRememberedSelections() {
	if (chart1.series.length !== GRAPHSETTINGS.rememberSelected.length) {
		GRAPHSETTINGS.rememberSelected = [] // if the graphlist changes, order is no longer guaranteed
	}
	for (var i = 0; i < chart1.series.length; i++) {
		if (GRAPHSETTINGS.rememberSelected[i] === false) { chart1.series[i].setVisible(false, false); }
	}
	chart1.redraw()
}
function toggleSpecificGraphs() {
	for (const chart of chart1.series) {
		chart.visible ? chart.hide() : chart.show();
	}
}
// toggle all graphs to the opposite of the average visible/hidden state
function toggleAllGraphs() {
	var visCount = 0;
	chart1.series.forEach(chart => visCount += chart.visible)
	for (const chart of chart1.series) {
		visCount > chart1.series.length / 2 ? chart.setVisible(false, false) : chart.setVisible(true, false);
	}
	chart1.redraw()
}

// --------- Portal and Game data handling ---------

// Stores and updates data for an individual portal
function Portal() {
	this.universe = getGameData.universe();
	this.totalPortals = getTotalPortals();
	this.challenge = getGameData.challengeActive() === 'Daily'
		? getCurrentChallengePane().split('.')[0].substr(13).slice(0, 16) // names dailies by their start date, only moderately cursed
		: getGameData.challengeActive();
	this.initialNullifium = game.global.nullifium;
	this.totalNullifium = getGameData.nullifium();
	this.totalVoidMaps = getGameData.totalVoids();
	this.cinf = getGameData.cinf();
	if (this.universe === 1) {
		this.totalHelium = game.global.totalHeliumEarned;
		this.initialFluffy = getGameData.fluffy() - game.stats.bestFluffyExp.value; // adjust for mid-run graph start
		this.initialDE = getGameData.essence();
	}
	if (this.universe === 2) {
		this.totalRadon = game.global.totalRadonEarned;
		this.initialScruffy = getGameData.scruffy() - game.stats.bestFluffyExp2.value; // adjust for mid-run graph start
		this.initialMutes = getGameData.mutatedSeeds();
		this.s3 = getGameData.s3();
	}
	// create an object to collect only the relevant data per zone, without fromEntries because old JS
	this.perZoneData = {};
	var perZoneItems = graphList.filter((graph) =>
		(graph.universe == this.universe || !graph.universe) // only save data relevant to the current universe
		&& graph.conditional() && graph.dataVar) // and for relevant challenges, with datavars 
		.map((graph) => graph.dataVar)
		.concat(["currentTime", "mapCount", "timeOnMap"]); // always graph time vars
	perZoneItems.forEach((name) => this.perZoneData[name] = []);

	// update per zone data and special totals
	this.update = function (fromMap) { // check source of the update
		const world = getGameData.world();
		this.totalNullifium = game.global.nullifium - this.initialNullifium + getGameData.nullifium();
		this.totalVoidMaps = getGameData.totalVoids();
		for (const [name, data] of Object.entries(this.perZoneData)) {
			if (world + 1 < data.length) { // FENCEPOSTING (zones are 1 indexed)
				data.splice(world + 1) // trim 'future' zones on reload
			}
			if (name === "timeOnMap") {
				var timeOnMap = getGameData.timeOnMap();
				if (fromMap) { data[world] = data[world] + timeOnMap || timeOnMap; } // additive per map within a zone
				continue;
			}
			if (name === "mapCount") {
				if (fromMap && game.global.mapsActive) { data[world] = data[world] + 1 || 1; } // start at 1 because the hook in is before the map is started/finished
				continue;
			}
			if (name === "c23increase") {
				data[world] = Math.max(getGameData[name](), data[world] || 0);
				continue;
			}
			try {
				data[world] = getGameData[name]();
			}
			catch {
				console.debug("Unknown data type:", name)
			}
		}
	}
}

function getportalID() { return `u${getGameData.universe()} p${getTotalPortals()}` }

function pushData(fromMap) {
	//debug("Starting Zone " + getGameData.world(), "graphs");
	const portalID = getportalID();
	if (!portalSaveData[portalID] || getGameData.world() === 1) { // reset portal data if restarting a portal
		savePortalData(true) // save old portal to history
		portalSaveData[portalID] = new Portal();
		clearData(GRAPHSETTINGS.maxGraphs); // clear out old portals
	}
	portalSaveData[portalID].update(fromMap);
	savePortalData(false) // save current portal
	if (GRAPHSETTINGS.live && GRAPHSETTINGS.open) {
		updateGraph();
	}
}

const getGameData = {
	currentTime: () => { return getGameTime() - game.global.portalTime }, // portalTime changes on pause, 'when a portal started' is not a static concept
	timeOnMap: () => {
		// TODO this time is wrong if the player sits in map chamber.  Then again, they might want that time included in 'map' time. (this is basically unavoidable, so the player definitely wants that time tracked as map time)
		// NOT MY BUG The game does not accurately track time on map in timewarp, thus it is impossible to track it in graphs.
		var annoyingRemainder = 0;
		if (game.global.mapStarted < game.global.zoneStarted) {
			annoyingRemainder = getGameTime() - game.global.mapStarted;
		}
		return getGameTime() - game.global.mapStarted - annoyingRemainder;
	},
	world: () => { return game.global.world },
	challengeActive: () => { return game.global.challengeActive },
	voids: () => { return game.global.totalVoidMaps },
	totalVoids: () => { return game.stats.totalVoidMaps.value },
	nullifium: () => { return recycleAllExtraHeirlooms(true) },
	coord: () => { return game.upgrades.Coordination.allowed - game.upgrades.Coordination.done },
	overkill: () => {
		// overly complex check for Liq, overly fragile check for overkill cells. please rewrite this at some point.
		if (game.options.menu.overkillColor.enabled == 0) toggleSetting("overkillColor");
		if (game.options.menu.liquification.enabled && game.talents.liquification.purchased && !game.global.mapsActive && game.global.gridArray && game.global.gridArray[0] && game.global.gridArray[0].name == "Liquimp")
			return 100;
		else return document.getElementById("grid").getElementsByClassName("cellColorOverkill").length;
	},
	zoneTime: () => { return Math.round((getGameTime() - game.global.zoneStarted) * 100) / 100 }, // rounded to x.xs, not used
	mapbonus: () => { return game.global.mapBonus },
	empower: () => { return game.global.challengeActive == "Daily" && typeof game.global.dailyChallenge.empower !== "undefined" ? game.global.dailyChallenge.empower.stacks : 0 },
	lastWarp: () => { return game.global.lastWarp },
	essence: () => { return game.global.spentEssence + game.global.essence },
	heliumOwned: () => { return game.resources.helium.owned },
	//magmite: () => { return game.global.magmite },
	//magmamancers: () => { return game.jobs.Magmamancer.owned },
	fluffy: () => {
		// cap exp at maximum for an evo, because Trimps doesn't do it and it causes horrible horrible bugs
		var maxExp = Math.floor((1000 * Math.pow(5, Fluffy.getCurrentPrestige())) * ((Math.pow(4, 10) - 1) / (4 - 1)))
		var exp = Math.min(game.global.fluffyExp, maxExp);
		//sum of all previous evo costs + current exp, because Trimps doesn't store this
		for (var evo = 0; evo < Fluffy.getCurrentPrestige(); evo++) {
			exp += Math.floor((1000 * Math.pow(5, evo)) * ((Math.pow(4, 10) - 1) / (4 - 1)));;
		}
		return exp
	},
	//nursery: () => { return game.buildings.Nursery.purchased },
	amals: () => { return game.jobs.Amalgamator.owned },
	wonders: () => { return game.challenges.Experience.wonders },
	scruffy: () => { return game.global.fluffyExp2 },
	smithies: () => { return game.buildings.Smithy.owned },
	radonOwned: () => { return game.resources.radon.owned },
	worshippers: () => { return game.jobs.Worshipper.owned },
	bonfires: () => { return game.challenges.Hypothermia.bonfires },
	embers: () => { return game.challenges.Hypothermia.embers },
	cruffys: () => { return game.challenges.Nurture.level },
	universe: () => { return game.global.universe },
	s3: () => { return game.global.lastRadonPortal },
	u1hze: () => { return game.global.highestLevelCleared },
	u2hze: () => { return game.global.highestRadonLevelCleared },
	c23increase: () => {
		if (game.global.challengeActive !== "" && game.global.runningChallengeSquared) {
			// (mostly) Trimps code
			var challenge = game.global.challengeActive;
			var challengeList = game.challenges[challenge].multiChallenge || [challenge];
			var totalDif = 0;
			for (var x = 0; x < challengeList.length; x++) {
				var challengeName = challengeList[x];
				challenge = game.challenges[challengeName];
				var dif = getIndividualSquaredReward(challengeName, game.global.world) - getIndividualSquaredReward(challengeName);
				totalDif += dif;
			}
			return Math.max(0, totalDif);
		}
		else { return 0; }
	},
	cinf: () => { return countChallengeSquaredReward(false, false, true) },
	mutatedSeeds: () => { return game.global.mutatedSeedsSpent + game.global.mutatedSeeds }
}

// --------- Data structures ---------

// Create all the Graph objects
// Graph(dataVar, universe, selectorText, additionalParams)
// additionalParams include graphTitle, conditional, customFunction, useAccumulator, toggles, xTitle, yTitle, formatter

// To add a new graph, add it to graphList with the desired options,
// If using a new dataVar, add that to getGameData
// To make a new toggle, add the required logic to toggledGraphs

const graphList = [
	new Graph("currentTime", false, "Clear Time", {
		yType: "datetime",
		formatter: formatters.datetime,
		toggles: ["perZone", "mapTime", "mapCount"],
		// , "mapPct" TODO having issues with accumulators on this one, more trouble than it's worth given nobody asked for it
	}),
	// U1 Graphs
	new Graph("heliumOwned", 1, "Helium", {
		toggles: ["perHr", "perZone", "lifetime"]
	}),
	new Graph("fluffy", 1, "Fluffy Exp", {
		conditional: () => { return getGameData.u1hze() >= 299 && getGameData.fluffy() < 4266662510275000 }, // pre unlock, post E10L10
		customFunction: (portal, i) => { return diff("fluffy", portal.initialFluffy)(portal, i) },
		toggles: ["perHr", "perZone",]
	}),
	new Graph("essence", 1, "Dark Essence", {
		conditional: () => { return getGameData.essence() < 5.826e+39 },
		customFunction: (portal, i) => { return diff("essence", portal.initialDE)(portal, i) },
		toggles: ["perHr", "perZone",],
		xminFloor: 181,
	}),
	new Graph("lastWarp", 1, "Warpstations", {
		graphTitle: "Warpstations built on previous Giga",
		conditional: () => { return getGameData.u1hze() >= 59 && ((game.global.totalHeliumEarned - game.global.heliumLeftover) < 10 ** 10) }, // Warp unlock, less than 10B He allocated
		xminFloor: 60,
	}),
	new Graph("amals", 1, "Amalgamators"),
	new Graph("wonders", 1, "Wonders", {
		conditional: () => { return getGameData.challengeActive() === "Experience" },
		xminFloor: 300,
	}),

	// U2 Graphs
	new Graph("radonOwned", 2, "Radon", {
		toggles: ["perHr", "perZone", "lifetime", "s3normalized"]
	}),
	new Graph("scruffy", 2, "Scruffy Exp", {
		customFunction: (portal, i) => { return diff("scruffy", portal.initialScruffy)(portal, i) },
		toggles: ["perHr", "perZone",]
	}),
	new Graph("mutatedSeeds", 2, "Mutated Seeds", {
		conditional: () => { return getGameData.u2hze() >= 200 },
		customFunction: (portal, i) => { return diff("mutatedSeeds", portal.initialMutes)(portal, i) },
		toggles: ["perHr", "perZone"],
		xminFloor: 200,
	}),
	new Graph("worshippers", 2, "Worshippers", {
		conditional: () => { return getGameData.u2hze() >= 49 },
		xminFloor: 50,
	}),
	new Graph("smithies", 2, "Smithies"),
	new Graph("bonfires", 2, "Bonfires", {
		graphTitle: "Active Bonfires",
		conditional: () => { return getGameData.challengeActive() === "Hypothermia" }
	}),
	new Graph("embers", 2, "Embers", {
		conditional: () => { return getGameData.challengeActive() === "Hypothermia" }
	}),
	new Graph("cruffys", 2, "Cruffys", {
		conditional: () => { return getGameData.challengeActive() === "Nurture" }
	}),

	// Generic Graphs
	new Graph("c23increase", false, "C2 Bonus", {
		conditional: () => { return game.global.runningChallengeSquared },
		toggles: ["perHr", "perZone", "lifetime"]
	}),
	new Graph("voids", false, "Void Map History", {
		graphTitle: "Void Map History (voids finished during the same level acquired are not counted/tracked)",
		yTitle: "Number of Void Maps",
	}),
	new Graph("coord", false, "Coordinations", {
		graphTitle: "Unbought Coordinations",
	}),
	new Graph("overkill", false, "Overkill Cells", {
		// Overkill unlock zones (roughly)
		conditional: () => {
			return ((getGameData.universe() == 1 && getGameData.u1hze() >= 169)
				|| (getGameData.universe() == 2 && getGameData.u2hze() >= 200))
		}
	}),
	new Graph("mapbonus", false, "Map Bonus"),
	new Graph("empower", false, "Empower", {
		conditional: () => { return getGameData.challengeActive() === "Daily" && typeof game.global.dailyChallenge.empower !== "undefined" }
	}),
	new Graph(false, false, "Portal Stats", {
		graphTitle: "Portal Stats",
		graphType: "column",
		toggles: ["perHr"],
		columns: [
			{ dataVar: "totalVoidMaps", title: "Voids", color: "#4d0e8c" },
			{ dataVar: "totalNullifium", title: "Nu", color: "#8a008a" },
			{ dataVar: "heliumOwned", universe: 1, title: "Helium", color: "#5bc0de" },
			{ dataVar: "radonOwned", universe: 2, title: "Radon", color: "#5bc0de" },
			{ dataVar: "fluffy", universe: 1, title: "Pet Exp", color: "green", customFunction: (portal, x) => { return x - portal.initialFluffy } },
			{ dataVar: "scruffy", universe: 2, title: "Pet Exp", color: "green", customFunction: (portal, x) => { return x - portal.initialScruffy } },
			{ dataVar: "c23increase", title: "C2 Bonus", color: "#003b99" },
			{ dataVar: "mutatedSeeds", universe: 2, title: "Mutated Seeds", customFunction: (portal, x) => { return x - portal.initialMutes } },
			{ dataVar: "world", title: "Zone Reached", color: "#a16e08", customFunction: (portal, x) => { return portal.perZoneData.mapbonus.length - 1 } },
			{ dataVar: "currentTime", title: "Run Time", type: "datetime", color: "#928DAD" }, // TODO some vars should be on shared axes... woo
			//{ dataVar: "timeOnMap", title: "Mapping Time", type: "datetime", customFunction: () => { } }, // TODO should be sum not max
		],
	}),
]

// rules for toggle based graphs
const toggledGraphs = {
	mapCount: {
		exclude: ["mapTime", "mapPct"],
		graphMods: (graph, highChartsObj) => {
			highChartsObj.tooltip = { pointFormatter: formatters.defaultPoint };
			highChartsObj.yAxis.type = "Linear";
			highChartsObj.title.text = "Maps Run"
			highChartsObj.yAxis.title.text = "Maps Run"
			graph.useAccumulator = true;
		},
		customFunction: (portal, item, index, x) => {
			x = portal.perZoneData.mapCount[index] || 0;
			return x
		}
	},
	mapTime: {
		exclude: ["mapCount", "mapPct"],
		graphMods: (graph, highChartsObj) => {
			highChartsObj.title.text = "Time in Maps";
			graph.useAccumulator = true;
		},
		customFunction: (portal, item, index, x) => {
			x = portal.perZoneData.timeOnMap[index] || 0;
			return x;
		}
	},
	mapPct: { // not used
		exclude: ["mapCount", "mapTime"],
		graphMods: (graph, highChartsObj) => {
			highChartsObj.tooltip = { pointFormatter: formatters.defaultPoint };
			highChartsObj.yAxis.type = "Linear"
			highChartsObj.title.text = "% of Clear time spent Mapping"
			highChartsObj.yAxis.title.text = "% Clear Time"
			graph.useAccumulator = true;
		},
		customFunction: (portal, item, index, x) => {
			x = portal.perZoneData.timeOnMap[index] / x || 0;
			return x;
		}
	},
	perZone: {
		graphMods: (graph, highChartsObj) => {
			highChartsObj.title.text += " each Zone"
			graph.useAccumulator = false // HACKS this might be incredibly stupid, find out later when you use this option for a different case!
		},
		customFunction: (portal, item, index, x) => {
			// TODO getting moderately ridiculous here on the 'not 0 but falsy' check
			// check for missing data, or start of data
			if (portal.perZoneData[item][index - 1] !== undefined && portal.perZoneData[item][index - 1] !== null
				&& portal.perZoneData[item][index] !== undefined && portal.perZoneData[item][index] !== null) {
				var x = portal.perZoneData[item][index] - portal.perZoneData[item][index - 1]
				x = Math.max(0, x) // there should be no values that are negative, outside weird data edge cases that we don't want to display
				var time = portal.perZoneData.currentTime[index] - portal.perZoneData.currentTime[index - 1]
			}
			else {
				x = 0
				time = 0
			}
			return [x, time];
		}
	},
	perHr: {
		graphMods: (graph, highChartsObj) => {
			highChartsObj.title.text += " / Hour"
		},
		customFunction: (portal, item, index, x, time) => {
			if (x) { x = x / (time / 3600000) }
			return x;
		}
	},
	lifetime: {
		graphMods: (graph, highChartsObj) => {
			highChartsObj.title.text += " % of Lifetime Total";
			highChartsObj.yAxis.title.text += " % of lifetime"
		},
		customFunction: (portal, item, index, x) => {
			var initial;
			if (item === "heliumOwned") { initial = portal.totalHelium; }
			if (item === "radonOwned") { initial = portal.totalRadon; }
			if (item === "c23increase") { initial = portal.cinf; }
			if (!initial) {
				graphsDebug("Attempted to calc lifetime percent of an unknown type:" + item);
				return 0;
			}
			if (item === "c23increase") {
				var totalBonus = (1 + (initial[1] / 100)) * initial[0]; // calc initial cinf            
				var c2 = initial[0];
				var c3 = initial[1];
				portal.universe == 1 ? c2 += x : c3 += x;
				var newBonus = (1 + (c3 / 100)) * c2; // calc final cinf
				x = ((newBonus - totalBonus) / (totalBonus ? totalBonus : 1));
			}
			else { x = x / (initial ? initial : 1) }
			return x * 100;
		}
	},
	s3normalized: {
		graphMods: (graph, highChartsObj) => {
			var maxS3 = Math.max(...Object.values(portalSaveData).map((portal) => portal.s3).filter((s3) => s3));
			highChartsObj.title.text += `, Normalized to z${maxS3} S3`
		},
		customFunction: (portal, item, index, x, time, maxS3) => {
			x = x / 1.03 ** portal.s3 * 1.03 ** maxS3
			return x;
		}
	},
}


// --------- Runtime ---------

var chart1;
if (typeof MODULES === 'undefined') MODULES = {}; // don't overwrite if AT has already created this
var lastSave = new Date();
var GRAPHSETTINGS = {
	universeSelection: 1,
	u1graphSelection: null,
	u2graphSelection: null,
	rememberSelected: [],
	toggles: {},
	darkTheme: true,
	maxGraphs: 60, // Highcharts gets a bit angry rendering more graphs, 30 is the maximum you can fit on the legend before it splits into pages.
	portalsDisplayed: 30
}
var portalSaveData = {}

if (localStorage["allSaveData"]) delete localStorage["allSaveData"]; // remove old AT graph data

// load and initialize the UI
loadGraphData();
createUI()
showHideUnusedGraphs()
var lastTheme = -1;


// --------- Trimps Wrappers ---------

//On Zone transition
var originalnextWorld = nextWorld;
nextWorld = function () {
	try {
		if (game.options.menu.pauseGame.enabled) return;
		if (null === portalSaveData) portalSaveData = {};
		if (getGameData.world()) { pushData(); }
	}
	catch (e) { graphsDebug("Gather info failed: " + e) }
	originalnextWorld(...arguments);
}

//On Portal
var originalactivatePortal = activatePortal;
activatePortal = function () {
	try { pushData(); }
	catch (e) { graphsDebug("Gather info failed: " + e) }
	originalactivatePortal(...arguments)
}

// On Map start
// Capture the time of the previous map, upon creating a new map
// This unfortunately loses the last map, since we grab map time at the creation of the map
var originalbuildMapGrid = buildMapGrid;
buildMapGrid = function () {
	try {
		if (game.global.mapsActive) pushData(true);
	}
	catch (e) { graphsDebug("Gather info failed: " + e) }
	originalbuildMapGrid(...arguments)
}

// On leaving maps for world
// this captures the last map when you switch away from maps
var originalmapsSwitch = mapsSwitch;
mapsSwitch = function () {
	originalmapsSwitch(...arguments)
	// yes these are inverted, states are changed before the function is called, whee
	// arg[0] is used for recycling maps
	try {
		if (!game.global.mapsActive && !arguments[0]) pushData(true);
	}
	catch (e) { graphsDebug("Gather info failed: " + e) }
}

// On finishing challenges (for c2s)
var originalabandonChallenge = abandonChallenge;
abandonChallenge = function () {
	try {
		pushData(true);
	}
	catch (e) { graphsDebug("Gather info failed: " + e) }
	originalabandonChallenge(...arguments)
}