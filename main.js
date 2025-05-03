const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('sheet1');
const time = new Date();

function doGet(e) {
  const getData = e.parameter;
  const action = getData.action;
  const roomCode = getData.roomCode;
  const userUsedVersion = getData.userUsedVersion;
  updateTimestamp();
  switch (action) {
    case "getRoomCode":
      return getRoomCode();
    case "setRoomCode":
      deleteTriggers();
      createTrigger();
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

const roomCodeRange = findRanges("ルームコード", 0, 1, 1);
const timeLimitRange = findRanges("有効期限(分)", 0, 1, 1);
const timeLimitValue = sheet.getRange(timeLimitRange[0]).getValue();

function setRoomCode(roomCode) {
  PropertiesService.getScriptProperties().setProperty("ROOM_CODE", roomCode);
  sheet.getRange(roomCodeRange).setValue(roomCode);
  return ContentService.createTextOutput().append(`コードを共有しました\n有効期限は${timeLimitValue}分です`);
}

function createTrigger() {
  ScriptApp.newTrigger('resetRoomCode').timeBased().after(timeLimitValue * 60 * 1000).create();
}

function deleteTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i])
  }
}

function resetRoomCode() {
  deleteTriggers();
  PropertiesService.getScriptProperties().setProperty("ROOM_CODE", "Expired");
  sheet.getRange(roomCodeRange).setValue("Expired");
}

//TODO バージョン番号を分割してチェック=>アップデートの優先度を表示
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

function updateTimestamp() {
  const timestampRanges = findRanges("タイムスタンプ", 0, 1, 1);
  sheet.getRange(timestampRanges[0]).setValue(time);
}

function test_getUpdatePriorityMessage() {
  let test_CurrentVersion = "1.0.1";
  let test_UserUsedVersion = "1.0.0";

  let split_CurrentVersion = test_CurrentVersion.split(".");
  let split_UserUsedVersion = test_UserUsedVersion.split(".");
  console.log(split_CurrentVersion);
  console.log(split_UserUsedVersion);

  for (let i = 0; i < split_CurrentVersion.length; i++) {
    // console.log(split_CurrentVersion[i]);
    if (split_CurrentVersion[i] !== split_UserUsedVersion[i]) {
      console.log(i);
    }
  }
}