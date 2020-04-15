import XLSX from 'xlsx'

export default function (JSONData, FileName, ShowLabel) {
    // 插件版excel
    const arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData
    const header = ShowLabel.reduce((acc, cur) => acc.concat(cur.title), [])
  // 数据按照标题顺序写入table
  const content = arrData.reduce((acc, cur) => {
    return acc.concat(ShowLabel.reduce((title, curTitle) => {
      console.log(curTitle)
      title[curTitle['title']] = cur[curTitle['key']] !== undefined ? cur[curTitle['key']] : ''
      return title
    }, {}))
  }, [])

  const jsonFile = XLSX.utils.json_to_sheet(content, {header})
  console.log(content, header, ShowLabel, arrData)
  XLSX.writeFile({SheetNames: ['Sheet1'], Sheets: {Sheet1: jsonFile}}, FileName + '.xls')

  // 手动生成excel
  // const arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData
  // let excel = '<table>'
  // // 表头
  // excel += ShowLabel.reduce((acc, cur) => acc + '<td>' + cur.title + '</td>', '<tr>') + '</tr>'

  // // 数据按照标题顺序写入table
  // excel += arrData.reduce((acc, cur) => {
  //   return acc + '<tr>' + ShowLabel.reduce((title, curTitle) => `${title}<td>${cur[curTitle['key']] !== undefined ? cur[curTitle['key']] : ''}</td>`, '') + '</tr>'
  // }, '')

  // // table 完成
  // excel += '</table>'

  // const excelFile = generageFile(excel)
  // downLoad(FileName, excelFile)

}

// function generageFile(excel) {
//   let excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
//   excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
//   excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
//   excelFile += '; charset=UTF-8">';
//   excelFile += "<head>";
//   excelFile += "<!--[if gte mso 9]>";
//   excelFile += "<xml>";
//   excelFile += "<x:ExcelWorkbook>";
//   excelFile += "<x:ExcelWorksheets>";
//   excelFile += "<x:ExcelWorksheet>";
//   excelFile += "<x:Name>";
//   excelFile += "sheet1";
//   excelFile += "</x:Name>";
//   excelFile += "<x:WorksheetOptions>";
//   excelFile += "<x:DisplayGridlines/>";
//   excelFile += "</x:WorksheetOptions>";
//   excelFile += "</x:ExcelWorksheet>";
//   excelFile += "</x:ExcelWorksheets>";
//   excelFile += "</x:ExcelWorkbook>";
//   excelFile += "</xml>";
//   excelFile += "<![endif]-->";
//   excelFile += "</head>";
//   excelFile += "<body>";
//   excelFile += excel;
//   excelFile += "</body>";
//   excelFile += "</html>";
//   return excelFile
// }

// function downLoad(name, file) {
//   const uri = file;
//   const link = document.createElement("a");
//   link.href = uri;

//   link.style = "visibility:hidden";
//   link.download = name + ".xls";

//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }