this.profileManager = new ProfileManager();
this.profileManager.populate();
this.drawerNav = new DrawerNav(50);
this.zooManager = new ZooLib();
this.zooManager.importProfiles(this.profileManager.profiles);
this.zooManager.populateZones(10, this.zooManager.availableAnimals);
var currentHover = null;
var curZone = null;
var curPen = null;
var curSetInterval = null;
var activePenElement = null
var currentUI = null;
var alerts = [];
var alertInfo = [];
var isSwitching = false;
var sfx_buttonPress = new Audio("content/sfx/btn4.wav");
var sfx_lock = new Audio("content/sfx/lock.wav");
var sfx_unlock = new Audio("content/sfx/unlock.wav");
var sfx_feed = new Audio("content/sfx/crunch.wav");
var sfx_sprinkler = new Audio("content/sfx/sprinkler.wav");
var sfx_church = new Audio("content/sfx/church.wav");

function playProperly(sfx){
    if (sfx.paused) {
        sfx.play();
    }else{
        sfx.pause();
        sfx.currentTime = 0;
    }
}

function setupZoneOnHover(){
    zoneList = document.getElementsByClassName("zone");
    for(var zoneID = 0; zoneID < zoneList.length; zoneID++){
        zoneList[zoneID].onmouseover = zoneOnHover;
        zoneList[zoneID].onmouseout = zoneOffHover;
    }
}

function zoneOnHover(mouseEvent){
    if(mouseEvent.toElement.classList[0]=="zone"){
        currentHover = mouseEvent.target.id.substring(5);
        var element = document.getElementById("status-"+currentHover);
        element.style.visibility="visible";
    }
}

function zoneOffHover(mouseEvent){
    var element = document.getElementById("status-"+currentHover);
    if(mouseEvent.toElement.classList[0] == "zone-map" || mouseEvent.toElement.classList[0] == "zone"){ //mouseEvent.toElement.id == "main-html"
        //element.style.visibility="hidden";
    //}else if((mouseEvent.fromElement.nodeName == "A" && mouseEvent.toElement.id == "main-html") 
    //|| (mouseEvent.fromElement.nodeName == "LI" && mouseEvent.toElement.id == "main-html")){
        element.style.visibility="hidden";
    }
}

function toggle(){
    this.drawerNav.toggle();
    document.getElementsByClassName("navToggle")[0].innerHTML = displayCorrectToggleState();
}

function displayCorrectToggleState(){
    if(!this.drawerNav.getState()){
        return "▲ <br> <b>Master Controls<b>"
    }else{
        return "▼"
    }
}

function updateHoverInfo(){
    elements = document.getElementsByClassName("status-display");
    for(var element = 0; element < elements.length; element++){
        elements[element].innerHTML = "<li class=\"status-all-locks\" onlick=\"shortCut("+element+","+0+")\"><a><i class=\"fa fa-lock\"></i></a></li><li class=\"status-all-fed\" onlick=\"shortCut("+element+","+1+")\"><a><i class=\"fa fa-cutlery\"></i></a></li><li class=\"status-all-water\" onlick=\"shortCut("+element+","+2+")\"><a><i class=\"fa fa-tint\"></i></a></li>"
    }
    elements = document.getElementsByClassName("status-all-locks");
    for(var element = 0; element < elements.length; element++){
        elements[element].innerHTML = "<a " + getStatus(element, 0) + "onlick=\"shortCut("+element+","+0+")\"><i class=\"fa fa-lock\"></i></a>"
    }

    elements = document.getElementsByClassName("status-all-fed");
    for(var element = 0; element < elements.length; element++){
        elements[element].innerHTML = "<a " + getStatus(element, 2)+ "onlick=\"shortCut("+element+","+1+")\"><i class=\"fa fa-cutlery\"></i></a>"
    }

    elements = document.getElementsByClassName("status-all-water");
    for(var element = 0; element < elements.length; element++){
        elements[element].innerHTML = "<a " + getStatus(element, 1)+"><i class=\"fa fa-tint\"></i></a>"
    }
}

function shortCut(zoneID, mode){
    console.log("help");
    //displayOverlay(zoneID);
    //switchTo(mode);
}

function getStatus(zone, mode){
    return this.zooManager.zoneManager.getStatus(zone, mode);
}

function getFeedInfo(zoneID){

}

function getFeedInfo(){
    
}

function displayOverlay(zoneID){
    document.getElementById("status-"+currentHover).style.visibility = "hidden";
    curZone = this.zooManager.fetchZone(zoneID);
    document.getElementsByClassName("zone-info")[0].style.opacity = "100%";
    document.getElementsByClassName("zone-overlay")[0].style.width = "100%";
    document.getElementsByClassName("zone-overlay")[0].style.height = "100%";
    document.getElementsByClassName("zone-overlay-back")[0].style.opacity = "100%";
    document.getElementsByClassName("zone-overlay")[0].style.opacity = "100%";
    document.getElementsByClassName("zone-overlay-back")[0].style.width = "100%";
    document.getElementsByClassName("zone-overlay-back")[0].style.height = "100%";
    document.getElementsByClassName("zone-overlay-back")[0].style.opacity = "100%";

    document.getElementById("zone-info-title").innerHTML = curZone.zoneName;
    document.getElementById("zone-info-description").innerHTML = "This is a description for " + curZone.zoneName;
}

function switchTo(mode){
    switch(mode){
        case 0:
            isSwitching = true;
            displayGateUI();
            break;
        case 1:
            isSwitching = true;
            displayFeedUI();
            break;
        case 2:
            isSwitching = true;
            displayWaterUI();
            break;
    }
}

function displayFeedUI(){
    currentUI = null;
    document.getElementsByClassName("zone-pens")[0].innerHTML = "<h2>Feeding</h2><a class=\"button\" id=\"water-mode\" onclick=\"switchTo(2)\">Sprinklers</a><a class=\"button active\" id=\"feed-mode\" onclick=\"switchTo(1)\">Feeding</a> <a class=\"button\" id=\"gate-mode\" onclick=\"switchTo(0)\">Locks</a><br><ul class=\"pen-list\"></ul><br>";
    var penList = document.getElementsByClassName("pen-list")[0];
    penList.innerHTML = "";
    for(var pen = 0; pen < curZone.getNumberPens();pen++){
        penList.innerHTML += "<li class=\"pen\" onclick=\"displayFeedSettings(" + pen + ")\"><a"+ " id=" + "\"pen-" + (pen+1) + "\" "+ displayAliveState(pen) +">Pen " + (pen+1) + "</a></li>";

        if((pen+1)%4==0){
            penList.innerHTML += "<br>";
        }
    }
    var currentUI = document.getElementsByClassName("zone-pens")[0];
    currentUI.innerHTML += "<div class=\"feed-settings\"></div>";
}

function displayAliveState(penID){
    if(curZone.fetchPen(penID).animalType.alive){
        return "";
    }else{
        return "style=\"background-color=#464646;\"";
    }
}

function displayFeedSettings(penID){
    getFeedPen(penID);
}

function feedNow(){
    playProperly(sfx_buttonPress);
    if(curPen.isStarving() && curPen.animalType.alive){
        curPen.feed();
    }else if(curPen.animalType.alive){
        this.intervalAlert();
    }else{
        pushAlert("💀 The " + curPen.animalType.typeName + " are dead.", "#ff8080");
    }
}

function displayFeedInfo(penID){
    currentUI = document.getElementsByClassName("feed-settings")[0];
    curSetInterval = curZone.getCurrentFeedingInterval(penID);
    currentUI.innerHTML = "";
    currentUI.innerHTML += "<hr><h2>Feed Settings</h2><a class=\"button\" id=\"feed-toggle\" onclick=\"toggleFeed("+penID+")\">Auto-Feed</a><a id=\"feed-now-button\" class=\"button\" onclick=\"feedNow()\">Feed Now</a><br><p><b>Pen Animal: </b>"+ curPen.animalType.typeName +"<br><b class=\"rfi\" title=\"Recommended Feeding Interval\"><u>RFI:</u></b> Every "+ curPen.animalType.getRecFeedingInterval() +" hours<br><b>Last Fed: </b>" + curZone.getLastFed(penID)+ "</p><br><p style=\"margin:0;float:left\"><strong>Current Interval</strong></p>";
    currentUI.innerHTML += "<div class=\"feed-adjustor\"><a class=\"current-feed-time\" id=\""+penID+"\">"+ curSetInterval +" hour(s)</a><a class=\"button\" id=\"feed-plus\" onclick=\"plusIntervalDisplay(0)\">+</a><a class=\"button\" id=\"feed-minus\" onclick=\"minusIntervalDisplay(0)\">-</a><a class=\"button\" id=\"feed-submit\" onclick=\"submitInterval()\"><i class=\"fa fa-check\"></i></a></div>";
    displayAlerts();
    displayProperFeed(penID);
    starveCheck();
}

function displayAlerts(){
    //currentUI.innerHTML += "<br><br>"
    for(var alert = 0; alert < alerts.length; alert++){
        currentUI.innerHTML += "<p class=\"alert-feed\" style=\"margin:0;padding:0;text-align:left;color:"+alertInfo[alert][1]+"\">" + alerts[alert] + "</p>";
    }
}

function pushAlert(alert, color){
    if(!alerts.includes(alert)){
        alerts.push(alert);
        alertInfo.push([0, color]);
    }
}

function incAlertExpiration(){
    for(var alert = 0; alert < alerts.length; alert++){
        //alerts[alert][1] += 1;
        alertInfo[alert][0] += 1;
    }
}

function cleanAlert(){
    if(alerts.length != 0){
        incAlertExpiration();
        if(alertInfo[0][0]>=5){
            alerts.shift();
            alertInfo.shift();
        }
    }
}

function updateFeedIntervalDisplay(){
    cleanAlert();
    currentUI = document.getElementsByClassName("feed-settings")[0];
    currentUI.innerHTML = "";
    currentUI.innerHTML += "<hr><h2>Feed Settings</h2><a class=\"button\" id=\"feed-toggle\" onclick=\"toggleFeed("+(parseInt(activePenElement.id.substring(4))-1)+")\">Auto-Feed</a><a id=\"feed-now-button\" class=\"button\" onclick=\"feedNow()\">Feed Now</a><br><p><b>Pen Animal: </b>"+ curPen.animalType.typeName +"<br><b class=\"rfi\" title=\"Recommended Feeding Interval\"><u>RFI:</u></b> Every "+ curPen.animalType.getRecFeedingInterval() +" hours<br><b>Last Fed: </b>" + curZone.getLastFed(parseInt(activePenElement.id.substring(4))-1)+ "</p><br><p style=\"margin:0;float:left\"><strong>Current Interval</strong></p>";
    currentUI.innerHTML += "<div class=\"feed-adjustor\"><a class=\"current-feed-time\" id=\""+(parseInt(activePenElement.id.substring(4))-1)+"\">"+ curSetInterval +" hour(s)</a><a class=\"button\" id=\"feed-plus\" onclick=\"plusIntervalDisplay(0)\">+</a><a class=\"button\" id=\"feed-minus\" onclick=\"minusIntervalDisplay(0)\">-</a><a class=\"button\" id=\"feed-submit\" onclick=\"submitInterval()\"><i class=\"fa fa-check\"></i></a></div>";
    displayAlerts();
    displayProperFeed(parseInt(activePenElement.id.substring(4))-1);
    starveCheck();
}

function starveCheck(){
    if(curPen.isStarving() && curPen.isAlive()){
        pushAlert("🙈 " + curPen.animalType.typeName + " are hungry!", "#ff8080")
    }
}

function minusIntervalDisplay(mode){
    if(curSetInterval >= 1){
        curSetInterval -= 1;
    }
    switch(mode){
        case 0:
            updateFeedIntervalDisplay();
            break;
        case 1:
            updateWaterUI();
            break;
    }
}

function plusIntervalDisplay(mode){
    if(curSetInterval <= 98){
        curSetInterval += 1;
    }
    switch(mode){
        case 0:
            updateFeedIntervalDisplay();
            break;
        case 1:
            updateWaterUI();
    }
}

function submitWaterInterval(){
    playProperly(sfx_buttonPress);
    curZone.setWaterInterval = curSetInterval;
    pushAlert("💧 Sprinkler Interval successfully changed to " + curZone.setWaterInterval + "!", "#caffb9");
    
}

function submitInterval(){
    playProperly(sfx_buttonPress);
    if(curSetInterval >= curPen.getRecFeedingInterval()){
        curPen.curInterval = curSetInterval;
        pushAlert("🍗 Feed Interval successfully changed to " + curPen.curInterval + "!", "#caffb9");
    }else{
        intervalAlert();
    }
}

function intervalAlert(){
    pushAlert("🙊 You\'d overfeed the " + curPen.animalType.typeName + "!", "#ff8080");
}

function getFeedPen(penID){
    if(curPen == curZone.fetchPen(penID)){
       document.getElementById("pen-"+(penID+1)).classList.toggle("active");
       document.getElementsByClassName("feed-settings")[0].innerHTML = "";
       curPen = null;
       activePenElement.classList.remove("active");
       activePenElement = null;
   }else{
       if(activePenElement!=null){
           activePenElement.classList.remove("active");
       }
       curPen = curZone.fetchPen(penID);
       displayFeedInfo(penID);
       document.getElementById("pen-"+(penID+1)).classList.toggle("active");
       activePenElement = document.getElementById("pen-"+(penID+1));
   }
}

function displayProperWater(){
    if(curZone.isWatering){
        document.getElementById("water-on").style.backgroundColor = "#086033";
        document.getElementById("water-on").style.color = "color:rgba(77, 130, 214, 1)"
        document.getElementById("water-on").innerHTML = "On";
    }else{
        document.getElementById("water-on").style.backgroundColor = "#943f61";
        document.getElementById("water-on").style.color = "color:rgba(77, 130, 214, 1)" 
        document.getElementById("water-on").innerHTML = "Off";
    }
    if(curSetInterval != curZone.setWaterInterval){
        document.getElementsByClassName("current-water-time")[0].style.color = "#ff8080";
    }
}

function displayProperFeed(penID){
    if(curZone.getBeingFed(penID)){
        document.getElementById("feed-toggle").style.backgroundColor = "#086033";
        document.getElementById("feed-toggle").style.color = "color:rgba(77, 130, 214, 1)";
        document.getElementById("feed-toggle").innerHTML = "Auto-Feeding";
    }else{
        document.getElementById("feed-toggle").style.backgroundColor = "#943f61";
        document.getElementById("feed-toggle").style.color = "color:rgba(77, 130, 214, 1)" ;
        document.getElementById("feed-toggle").innerHTML = "Manual Feeding";
    }
    if(curSetInterval != curPen.curInterval){
        document.getElementsByClassName("current-feed-time")[0].style.color = "#ff8080";
    }
}

function toggleFeed(penID){
    playProperly(sfx_buttonPress);
    curZone.toggleFeed(penID);
    displayProperFeed(penID);
}

function displayWaterUI(){
    currentUI = document.getElementsByClassName("zone-pens")[0];
    curSetInterval = curZone.setWaterInterval;
    activePenElement = null;
    curPen = null;
    document.getElementsByClassName("zone-pens")[0].innerHTML = "<h2>Sprinklers</h2><a class=\"button active\" id=\"water-mode\" onclick=\"switchTo(2)\">Sprinklers</a><a class=\"button\" id=\"feed-mode\" onclick=\"switchTo(1)\">Feeding</a> <a class=\"button\" id=\"gate-mode\" onclick=\"switchTo(0)\">Locks</a><br><ul class=\"pen-list\"></ul><br>";
    currentUI.innerHTML += "<div class=\"water-settings\"></div>";
    currentUI = document.getElementsByClassName("water-settings")[0];
    currentUI.innerHTML = "<p id=\"last-water-label\"><b>Last Active: </b>" + curZone.getLastWater() + "</p><a class=\"button\" id=\"water-on\" onclick=\"toggleSprinker()\">On?</a><p style=\"margin:0;float:left\"><strong>Current Interval</strong></p>";
    currentUI.innerHTML += "<div class=\"water-adjustor\"><a class=\"current-water-time\">"+ curSetInterval +" hour(s)</a><a class=\"button\" id=\"water-plus\" onclick=\"plusIntervalDisplay(1)\">+</a><a class=\"button\" id=\"water-minus\" onclick=\"minusIntervalDisplay(1)\">-</a><a class=\"button\" id=\"water-submit\" onclick=\"submitWaterInterval()\"><i class=\"fa fa-check\"></i></a></div>";
    displayAlerts();
    displayProperWater();
}

function updateWaterUI(){
    cleanAlert();
    currentUI.innerHTML = "<p id=\"last-water-label\" style=\"clear:both;\"><b>Last Active: </b>" + curZone.getLastWater() + "</p><a class=\"button\" id=\"water-on\" onclick=\"toggleSprinker()\">On?</a><p style=\"margin:0;float:left\"><strong>Current Interval</strong></p>";
    currentUI.innerHTML += "<div class=\"water-adjustor\"><a class=\"current-water-time\">"+ curSetInterval +" hour(s)</a><a class=\"button\" id=\"water-plus\" onclick=\"plusIntervalDisplay(1)\">+</a><a class=\"button\" id=\"water-minus\" onclick=\"minusIntervalDisplay(1)\">-</a><a class=\"button\" id=\"water-submit\" onclick=\"submitWaterInterval()\"><i class=\"fa fa-check\"></i></a></div>";
    displayAlerts();
    displayProperWater();
}

function toggleSprinker(){
    playProperly(sfx_buttonPress);
    curZone.toggleWatering();
    displayProperWater();
}

function displayGateUI(){
    currentUI = null;
    activePenElement = null;
    curPen = null;
    document.getElementsByClassName("zone-pens")[0].innerHTML = "<h2>Locks</h2><a class=\"button\" id=\"water-mode\" onclick=\"switchTo(2)\">Sprinklers</a><a class=\"button\" id=\"feed-mode\" onclick=\"switchTo(1)\">Feeding</a> <a class=\"button active\" id=\"gate-mode\" onclick=\"switchTo(0)\">Locks</a><br><ul class=\"pen-list\"></ul><br><a class=\"button\" id=\"lock-all\" onclick=\"contextLock()\"><i class=\"fa fa-unlock-alt\"></i> All</a>";
    var penList = document.getElementsByClassName("pen-list")[0];
    penList.innerHTML = "";
    for(var pen = 0; pen < curZone.getNumberPens();pen++){
        penList.innerHTML += "<li class=\"pen\" onclick=toggleLock(" + pen + ")><a"+ " id=" + "\"pen-" + (pen+1) +"\">Pen " + (pen+1) + "</a></li>";
        useProperColor(("pen-" + (pen+1)), curZone.fetchLocked(pen));
        if((pen+1)%4==0){
            penList.innerHTML += "<br>";
        }
    }
    updateLockAllBtn();
}

function displayCorrect(bool, id){
    if(bool){
        document.getElementById(id).style.backgroundColor = "#086033";
        document.getElementById(id).style.color = "color:rgba(77, 130, 214, 1)"
        if(id=="all-lock"){
            document.getElementById(id).title="Unlocks all pens in the zoo"; 
        }else if(id=="all-fed"){
            document.getElementById(id).title="Sets all Feeding systems to Manual"; 
        }else if(id=="all-water"){
            document.getElementById(id).title="Deactivates all sprinklers in the zoo";
        }
    }else{
        document.getElementById(id).style.backgroundColor = "#943f61";
        document.getElementById(id).style.color = "color:rgba(77, 130, 214, 1)"
        if(id=="all-lock"){
            document.getElementById(id).title="Locks all pens in the zoo"; 
        }else if(id=="all-fed"){
            document.getElementById(id).title="Sets all Feeding systems to Auto"; 
        }else if(id=="all-water"){
            document.getElementById(id).title="Activates all sprinklers in the zoo"; 
        }
    }

}

function areAllLocked(){
    var shouldLock = this.zooManager.areAllLocked();
    if(shouldLock){
        playProperly(sfx_lock);
    }else{
        playProperly(sfx_unlock);
    }
    this.zooManager.toggleAllLock(!shouldLock);
    displayCorrect(!shouldLock, "all-lock");
    /*if(this.zooManager.areAllLocked()){
        alert("All pens in the zoo have been locked!");
    }else{
        alert("All pens in the zoo have been unlocked!");
    }*/
}

function areAllFed(){
    var shouldFeed = this.zooManager.areAllFed()
    this.zooManager.toggleAllFeed(!shouldFeed);
    displayCorrect(!shouldFeed, "all-fed");
    if(!shouldFeed){
        playProperly(sfx_feed);
    }
    /*if(this.zooManager.areAllFed()){
        alert("All feeding systems in the zoo have been activated!");
    }else{
        alert("All feeding systems in the zoo have been deactivated!");
    }*/
}

function areAllWatered(){
    var shouldWater = this.zooManager.areAllWatered();
    this.zooManager.toggleAllWater(!shouldWater);
    displayCorrect(!shouldWater, "all-water");
    if(!shouldWater){
        playProperly(sfx_sprinkler);
    }
    /*if(this.zooManager.areAllWatered()){
        alert("All sprinkler systems in the zoo have been turned on!");
    }else{
        alert("All sprinkler systems in the zoo have been turned off!");
    }*/
}

function getInfo(zoneID, mode=0){
    console.log(curZone);
    isSwitching = false;
    displayOverlay(zoneID);
    switchTo(mode);
}

function updateLockAllBtn(){
    var lockAllBtn = document.getElementById("lock-all");
    lockAllBtn.innerHTML = setProperBtnLock() + " All"
}

function contextLock(){
    var penList = document.getElementsByClassName("pen-list")[0];
    penList.innerHTML = "";
    if(!curZone.checkAllLocked()){
        lockAllPens();
    }else{
        unlockAllPens();
    }
    for(var pen = 0; pen < curZone.getNumberPens();pen++){
        penList.innerHTML += "<li class=\"pen\" onclick=toggleLock(" + pen + ")><a"+ " id=" + "\"pen-" + (pen+1) +"\">Pen " + (pen+1) + "</a></li>";
        useProperColor(("pen-" + (pen+1)), curZone.fetchLocked(pen));
        if((pen+1)%4==0){
            penList.innerHTML += "<br>";
        }
    }
    updateLockAllBtn();
}

function lockAllPens(){
    playProperly(sfx_lock);
    curZone.lockAllPens();
}

function unlockAllPens(){
    playProperly(sfx_unlock);
    curZone.unlockAllPens();
}

function setProperBtnLock(){
    if(curZone.checkAllLocked()){
        return "<i class=\"fa fa-unlock-alt\"></i>"
    }else{
        return "<i class=\"fa fa-lock\"></i>"
    }
}

function getProperLockSymbol(curPen){
    if(curZone.fetchLocked(curPen)){
        return "<i style=\"font-size:30px\" class=\"fa fa-lock\"></i>"
    }else{
        return "<i style=\"font-size:30px\" class=\"fa fa-unlock-alt\"></i>"
    }
}

function useProperColor(elementID, locked){
    if(locked){
        document.getElementById(elementID).style.backgroundColor="#086033";
        document.getElementById(elementID).style.backgroundImage="url(\"content/images/lock.png\")";
    }else{
        document.getElementById(elementID).style.backgroundColor="#943f61";;
        document.getElementById(elementID).style.backgroundImage="url(\"content/images/unlock.png\")";
    }
    document.getElementById(elementID).style.backgroundSize="100%";
    document.getElementById(elementID).style.backgroundRepeat="no-repeat";
    document.getElementById(elementID).style.backgroundPosition="center";
}

function toggleLock(penID){
    curZone.toggleLock(penID);
    document.getElementById("pen-"+(penID+1)).innerHTML = "Pen " + (penID+1);
    useProperColor(("pen-"+(penID+1)),curZone.fetchLocked(penID));
    updateLockAllBtn();
}

function dismissInfo(){
    document.getElementsByClassName("zone-info")[0].style.opacity = "0%";
    document.getElementsByClassName("zone-overlay")[0].style.width = "0%";
    document.getElementsByClassName("zone-overlay")[0].style.height = "0%";
    document.getElementsByClassName("zone-overlay")[0].style.opacity = "0%";
    document.getElementsByClassName("zone-overlay-back")[0].style.width = "0%";
    document.getElementsByClassName("zone-overlay-back")[0].style.height = "0%";
    document.getElementsByClassName("zone-overlay-back")[0].style.opacity = "0%";
    currentUI = null;
    curPen = null;
    curZone = null;
    activePenElement.classList.remove("active");
    activePenElement = null;
    alerts=[];
    alertInfo=[];
    isSwitching = false;
}

var totalTime = 0;
function update(){
    totalTime += 1;
    if(currentUI==null){
        return;
    }
    if(currentUI.className == "feed-settings"){
        updateFeedIntervalDisplay();
    }else if(currentUI.className == "water-settings"){
        updateWaterUI();
    }
}

function nothing(){
    //Do nothing
}

this.tick = true;
const tick = setInterval(function() {
    this.zooManager.incrementTime();
    update();
    updateHoverInfo();
  }, 1000);

 //clearInterval(tick);

 setupZoneOnHover();
 //toggle();
 displayCorrect(areAllLocked, "all-lock");
 displayCorrect(areAllFed, "all-fed");
 displayCorrect(areAllWatered, "all-water");