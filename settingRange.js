/*
  findText = "string";  検索する文字列
  offsetCol = 0;        findTextが見つかったセルから右にオフセット
  offsetRow = 0;        findTextが見つかったセルから下にオフセット
  selectRanges = 1;     findTextが見つかったセルから下に選択するセル
                        "last"で最終行まで,"new"で最終行+1の範囲を返す
*/

function findRanges(findText, offsetCol, offsetRow, selectRanges) {
  let ranges = [];
  const finder = sheet.createTextFinder(findText).matchEntireCell(true);
  const foundRange = finder.findNext();
  if (!foundRange) {
    console.error(`${findText} was not found.`);
    return;
  }

  if (selectRanges == "last") {
    selectRanges = sheet.getLastRow() - 1;
  } else if (selectRanges == "new") {
    selectRanges = 1;
    offsetRow = sheet.getLastRow() - 1;
  }

  for (let i = 0; i < selectRanges; i++) {
    let targetRow = foundRange.getRow() + offsetRow + i;
    let targetCol = foundRange.getColumn() + offsetCol;
    let colLetter = colNumberToLetter(targetCol);
    ranges.push(`${colLetter}${targetRow}`);
  }
  return ranges;
}

function colNumberToLetter(col) {
  let letter = '';
  while (col > 0) {
    const temp = (col - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    col = Math.floor((col - temp - 1) / 26);
  }
  return letter;
}