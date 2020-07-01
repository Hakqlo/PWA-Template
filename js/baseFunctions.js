import dialogPolyfill from 'dialog-polyfill'
/**
 * 
 * @param {string} title 
 * @param {Array.<(string|HTMLElement)>} contents 
 * @param {Object.<string, string>} buttons 
 */
const popup = (title, contents, buttons = { "OK": "ok" }) => {
  const previousDialogs = document.querySelectorAll("dialog");
  const thePreviousOneDialog = previousDialogs[previousDialogs.length - 1]
  previousDialogs.forEach(v => {
    v.setAttribute("class", "sent-back");
  })/*
    background-color: red;
    -webkit-mask: url(./icon/ios-safari-share-icon.svg) no-repeat center;
    mask: url(./icon/ios-safari-share-icon.svg) no-repeat center;*/
  //below would be a shit code.
  //why didn't I just make one function that creates a new element and adds onto a specific element
  const dialog = document.createElement("dialog");
  dialogPolyfill.registerDialog(dialog);
  document.body.appendChild(dialog);
  const form = document.createElement("form");
  dialog.appendChild(form);
  form.setAttribute("method", "dialog")
  const titleBar = document.createElement("p");
  form.appendChild(titleBar);
  titleBar.setAttribute("class", "title");
  titleBar.innerText = title;
  const cancelButton = document.createElement("button");
  cancelButton.innerText = "cancel"
  cancelButton.setAttribute("value", "cancel");

  titleBar.appendChild(cancelButton);
  contents.forEach(v => {
    const columnBar = document.createElement("p");
    if (typeof v === "string") {
      let label = document.createElement("label");
      columnBar.appendChild(label);
      label.innerText = v;
    } else if (v instanceof HTMLElement) {
      columnBar.appendChild(v);
    }
    form.appendChild(columnBar);

  })
  const menu = document.createElement("menu");
  form.appendChild(menu);
  for (const v in buttons) {
    const btn = document.createElement("button");
    btn.innerHTML = v;
    menu.appendChild(btn);
    btn.setAttribute("value", buttons[v])
    btn.setAttribute("type", "submit");
  }
  return new Promise(resolve => {
    dialog.addEventListener('close',() => {
      setTimeout(() => dialog.remove(), 500);
      thePreviousOneDialog && thePreviousOneDialog.removeAttribute("class");
      resolve(dialog.returnValue);
    });
    setTimeout(() => dialog.showModal(), 100);
  })
}
const createElementFromHTML = (htmlString) => {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}
export function init(window){
  window.popup = popup;
  window.createElementFromHTML = createElementFromHTML;
}
/*
popup("Install",[
    createElementFromHTML(`
        <div><div style='background-color: red;
        -webkit-mask: url(./icon/ios-safari-share-icon.svg) no-repeat center;
        mask: url(./icon/ios-safari-share-icon.svg) no-repeat center;'></div> press this button</div>
    `)]).then(res=>console.log(res))
//popup("aaaa",["vsgahjbxnjdwax","bhsajknxmdks"],{"OK",()=>{console.log(ok clicked)}})
`<dialog id="sysDialog">
<form method="dialog">
  <p class="title">${title}<button value="cancel">cancel</button></p>
  <p><label>${contents}</label></p>
  <menu>
    <button id="confirmBtn" value="default">Confirm</button>
  </menu>
</form>
</dialog>`*/
/*
        while(true){
            const imgStartIndex = str.indexOf("{img:");
            if(imgStartIndex!==0){

                let label = document.createElement("label");
                titleBar.appendChild(label);
                if(imgStartIndex!==-1){
                    label.innerText = str.substring(0,imgStartIndex);
                    str = str.substring(imgStartIndex);
                }else{
                    label.innerText = str;
                    break;
                }

            }else if(imgStartIndex===0){
                const tagEndIndex = str.indexOf("}");
                const imgSrc = str.substring(5,tagEndIndex);
                str = str.substring(tagEndIndex+1);
                let img = document.createElement("img");
                titleBar.appendChild(img);
                img.src = imgSrc;
            }else if(str.length===0)break;
        }*/