const fs = require('fs')
const folderPath = document.getElementById('fileInput');
let root;
const submitBtn = document.querySelector('.submitBtn');
const resultDom = document.querySelector('.resultArea');
// 这会打印出磁盘根级别的所有文件
// 同时包含'/'和'C:\'
const defaultPath = localStorage.getItem('readPath');
if (defaultPath) {
  folderPath.value = defaultPath;
}
const previewClick = url => window.open(url);
// 处理文件
const handleReadEvent = () => {
  if (folderPath && folderPath.value) {
    try {
      root = fs.readdirSync(folderPath.value);
      localStorage.setItem('readPath', folderPath.value);
      console.log(root);
      let str = '';
      const arr = [];
      if (root && root.length) {
        root.forEach(m => {
          const obj = {
            name: m,
            path: folderPath.value + '/' + m,
            size: 0,
            status: 0
          }
          arr.push(obj);
          try {
            const fileInfo = fs.statSync(obj.path);
            obj.size = fileInfo.size ? Math.round(fileInfo.size / 1024) + " KB" : 0;
          } catch (error) {

          }
          // console.log(fs.statSync(obj.path));
          // str += `<div class="resultArea_item" path="${folderPath.value}/${m}">${m}</div>`
        });
        arr.forEach((n, i) => {
          str += `<tr>
          <td class="textCenter">${i+1}</td>
          <td>${n.name}</td>
          <td>${n.path}</td>
          <td class="textCenter">${n.size}</td>
          <td class="textCenter">${n.status == 0 ? "未上传" : "已上传"}</td>
          <td class="textCenter handleFilePreview" path="${n.path}">点击预览</td>
          </tr>`
        });
      }
      resultDom.getElementsByTagName('tbody')[0].innerHTML = str;
    } catch (error) {
      resultDom.getElementsByTagName('tbody')[0].innerHTML = error;
    }
  }
};
// 点击确认
submitBtn.addEventListener('click', handleReadEvent);
document.addEventListener("DOMContentLoaded", function () {
  handleReadEvent();
  handleAllEvent();
});

// 定时
setInterval(() => {
  handleReadEvent();
}, 60 * 1000);
// 所有点击事件
function handleAllEvent(){
  // 点击预览
  document.querySelector('.resultArea').addEventListener('click', (e)=>{
    const target = e.target;
    if(target.classList.contains('handleFilePreview')){
      const path = target.getAttribute('path');
      window.open(path);
    }
  });
}