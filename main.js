function doGet(e) {
  const getData = e.parameter;
  const action = getData.action;
  const roomCode = getData.roomCode;
  const userUsedVersion = getData.userUsedVersion;
  switch (action) {
    case "getRoomCode":
      deleteTriggers();
      createTrigger();
      return getRoomCode();
    case "setRoomCode":
      return setRoomCode(roomCode);
    case "checkVersion":
      return checkVersion(userUsedVersion);
    case "getUpdateURL":
      return getUpdateURL();
    default:
      return ContentService.createTextOutput().append("Bad request");
  }
}

function getRoomCode() {
  const roomCode = PropertiesService.getScriptProperties().getProperty("ROOM_CODE");
  if (roomCode !== "Expired") {
    return ContentService.createTextOutput().append(roomCode);
  } else {
    return ContentService.createTextOutput().append("コードの有効期限が切れています。");
  }
}

function setRoomCode(roomCode) {
  PropertiesService.getScriptProperties().setProperty("ROOM_CODE", roomCode);
  return ContentService.createTextOutput().append("コードを共有しました！！\n有効期限は10分です");
}

function createTrigger() {
  ScriptApp.newTrigger('resetRoomCode').timeBased().after(10 * 60 * 1000).create();
}

function deleteTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i])
  }
}

function resetRoomcode() {
  PropertiesService.getScriptProperties().setProperty("ROOM_CODE", "Expired");
}

function checkVersion(userUsedVersion) {
  const currentVersion = PropertiesService.getScriptProperties().getProperty("VERSION");
  if (userUsedVersion != currentVersion) {
    return ContentService.createTextOutput().append("Older version");
  }
}

function getUpdateURL() {
  const url = PropertiesService.getScriptProperties().getProperty("UPDATE_URL");
  return ContentService.createTextOutput().append(url);
}