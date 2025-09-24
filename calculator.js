// ===============================
//  Calculadora TI-30X IIS
// ===============================

let currentInput = "0";
let operator = null;
let firstOperand = null;

const display   = document.getElementById("display");
const operation = document.getElementById("operation");
const info      = document.getElementById("info");

display.removeAttribute("readonly");

// Logs
const errorLogs = [];
function logError(msg) { errorLogs.push(`[${new Date().toISOString()}] ${msg}`); }

// Utils
function setDisplay(v) { currentInput = String(v); display.value = currentInput; }
function flash(btn) { if (!btn) return; btn.classList.add("active-press"); setTimeout(()=>btn.classList.remove("active-press"),150); }

function rellenar_info(res, tipo="resultado") {
  if (Number.isNaN(res)) { info.textContent="❌ Entrada no válida"; info.style.background="red"; return; }
  let mensaje = tipo;
  if (res<100) mensaje += " | <100"; else if (res<=200) mensaje+=" | 100-200"; else mensaje+=" | >200";
  info.textContent="Operación: "+mensaje;
  info.style.background="#1976d2";
}

function esNumeroValido(s){ return /^-?\d+(\.\d+)?$/.test(String(s).trim()); }
function validarEntradaSimple(){
  const s=display.value.trim();
  if(!s){ info.textContent="Error: vacío"; info.style.background="red"; logError("Campo vacío"); return null;}
  if(!esNumeroValido(s)){ info.textContent="Error: no numérico"; info.style.background="red"; logError("Entrada inválida"); return null;}
  return parseFloat(s);
}
function parseCSV(){
  const raw=display.value.trim();
  if(!raw.includes(",")){ info.textContent="Error: formato CSV"; info.style.background="red"; logError("CSV inválido"); return null;}
  const nums=raw.split(",").map(x=>x.trim()).map(Number);
  if(nums.some(isNaN)){ info.textContent="Error: CSV no numérico"; info.style.background="red"; logError("CSV no numérico"); return null;}
  return nums;
}

// ---------- Básicos ----------
document.getElementById("clear").addEventListener("click",(e)=>{flash(e.currentTarget);setDisplay("0");firstOperand=null;operator=null;operation.textContent="0";info.textContent="Info sobre el número";info.style.background="#444";});
document.querySelectorAll(".num").forEach(btn=>btn.addEventListener("click",()=>{flash(btn);if(currentInput==="0")setDisplay(btn.textContent);else setDisplay(currentInput+btn.textContent);}));
document.getElementById("decimal").addEventListener("click",(e)=>{flash(e.currentTarget);setDisplay(currentInput+".");});
document.getElementById("comma").addEventListener("click",(e)=>{flash(e.currentTarget);setDisplay(currentInput+",");});
document.getElementById("sign").addEventListener("click",(e)=>{flash(e.currentTarget);const n=validarEntradaSimple();if(n!==null)setDisplay(-n);});

// ---------- Unitarias ----------
document.getElementById("cuadrado").addEventListener("click",(e)=>{flash(e.currentTarget);const n=validarEntradaSimple();if(n===null)return;const r=n*n;setDisplay(r);operation.textContent=`${n}²`;rellenar_info(r,"cuadrado");});
document.getElementById("raiz").addEventListener("click",(e)=>{flash(e.currentTarget);const n=validarEntradaSimple();if(n===null)return;if(n<0){info.textContent="❌ Raíz negativa";info.style.background="red";return;}const r=Math.sqrt(n);setDisplay(r);operation.textContent=`√${n}`;rellenar_info(r,"raiz");});
document.getElementById("modulo").addEventListener("click",(e)=>{flash(e.currentTarget);const n=validarEntradaSimple();if(n===null)return;setDisplay(Math.abs(n));operation.textContent=`|${n}|`;rellenar_info(Math.abs(n),"modulo");});
document.getElementById("factorial").addEventListener("click",(e)=>{flash(e.currentTarget);const s=display.value.trim();if(!/^\d+$/.test(s)){info.textContent="❌ Solo enteros ≥0";info.style.background="red";return;}const n=parseInt(s);let r=1;for(let i=2;i<=n;i++)r*=i;setDisplay(r);operation.textContent=`${n}!`;rellenar_info(r,"factorial");});
document.getElementById("potencia").addEventListener("click",(e)=>{flash(e.currentTarget);const n=validarEntradaSimple();if(n===null)return;firstOperand=n;operator="^";operation.textContent=`${n} ^`;setDisplay("0");});

// ---------- Binarias ----------
function prepararOp(opSimbolo,opId){const n=validarEntradaSimple();if(n===null)return;firstOperand=n;operator=opId;operation.textContent=`${n} ${opSimbolo}`;setDisplay("0");}
document.getElementById("suma").addEventListener("click",(e)=>{flash(e.currentTarget);prepararOp("+","+");});
document.getElementById("resta").addEventListener("click",(e)=>{flash(e.currentTarget);prepararOp("-","-");});
document.getElementById("multiplicacion").addEventListener("click",(e)=>{flash(e.currentTarget);prepararOp("×","*");});
document.getElementById("division").addEventListener("click",(e)=>{flash(e.currentTarget);prepararOp("÷","/");});

document.getElementById("igual").addEventListener("click",(e)=>{
  flash(e.currentTarget);
  if(!operator)return;
  const b=validarEntradaSimple();if(b===null)return;
  let r;
  if(operator==="+"){r=firstOperand+b;rellenar_info(r,"suma");operation.textContent=`${firstOperand}+${b}`;}
  else if(operator==="-"){r=firstOperand-b;rellenar_info(r,"resta");operation.textContent=`${firstOperand}-${b}`;}
  else if(operator==="*"){r=firstOperand*b;rellenar_info(r,"mult");operation.textContent=`${firstOperand}×${b}`;}
  else if(operator==="/"){if(b===0){info.textContent="❌ División entre 0";info.style.background="red";return;}r=firstOperand/b;rellenar_info(r,"div");operation.textContent=`${firstOperand}÷${b}`;}
  else if(operator==="^"){r=Math.pow(firstOperand,b);rellenar_info(r,"potencia");operation.textContent=`${firstOperand}^${b}`;}
  setDisplay(r);firstOperand=null;operator=null;
});

// ---------- CSV ----------
document.getElementById("csv-sumatorio").addEventListener("click",(e)=>{flash(e.currentTarget);const nums=parseCSV();if(!nums)return;const r=nums.reduce((a,b)=>a+b,0);setDisplay(r);operation.textContent=`Σ(${nums.join(",")})`;rellenar_info(r,"csv");});
document.getElementById("csv-media").addEventListener("click",(e)=>{flash(e.currentTarget);const nums=parseCSV();if(!nums)return;const r=nums.reduce((a,b)=>a+b,0)/nums.length;setDisplay(r);operation.textContent=`media(${nums.join(",")})`;rellenar_info(r,"csv");});
document.getElementById("csv-ordenar").addEventListener("click",(e)=>{flash(e.currentTarget);const nums=parseCSV();if(!nums)return;nums.sort((a,b)=>a-b);setDisplay(nums.join(", "));info.textContent="✔ CSV ordenado";info.style.background="#2196f3";});
document.getElementById("csv-revertir").addEventListener("click",(e)=>{flash(e.currentTarget);const nums=parseCSV();if(!nums)return;nums.reverse();setDisplay(nums.join(", "));info.textContent="✔ CSV invertido";info.style.background="#2196f3";});
document.getElementById("csv-quitar").addEventListener("click",(e)=>{flash(e.currentTarget);const nums=parseCSV();if(!nums)return;nums.pop();setDisplay(nums.join(", "));info.textContent="✔ CSV último eliminado";info.style.background="#2196f3";});

// ---------- Logs ----------
document.getElementById("descargar-log").addEventListener("click",(e)=>{
  flash(e.currentTarget);
  const contenido=errorLogs.join("\n")||"Sin errores registrados.";
  const blob=new Blob([contenido],{type:"text/plain;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download="logs_calculadora.txt";document.body.appendChild(a);
  a.click();a.remove();URL.revokeObjectURL(url);
});
