// Requiring the modules
const reader = require('xlsx');
const PolynomialRegression = require('ml-regression-polynomial');

// Reading our test file
const filein = reader.readFile('./excel_data/LottoHistory1.xlsx');
const fileout = reader.readFile('./excel_data/LottoOutput.xlsx')
const xAxis = [];
const yAxis =[];

//FUNCTIONS
//********* 

// Set2Num function
//-----------------

let set2num = function(arg){
    const num=arg;
    console.log('num:',num);
    const N=49;
    const L=num.length-1;
    let Dnum=[];
    let Sum=[];
    for (let i=0; i<=num.length-1;i++){
        Dnum[i]=0;
    }   
    for (let i=0; i<=L-1;i++){
        Sum[i]=0;
    }
    let Sum0=0;
    let Dk=1;
    let k=0;
    let i=1;
    let x; 
    let y;
    
    // set2num nested functions
    //-------------------------
    function product_Range(a,b) {
      var prd = a,i = a;
      while (i++< b) {
        prd*=i;
      }
      return prd; 
    }
    
    function combinations(n, r)  
    {
    if (n==r || r==0)   
    {
      return 1;
    } 
    else 
    {
      r=(r < n-r) ? n-r : r;
      return product_Range(r+1, n)/product_Range(1,n-r);
    }
    }
    
    //console.log(` A test run for C(48,5)=`,combinations(48,5));
    
    // The external for loop
    for (let k=0;k<L;k++){
      Sum0=0
      Dk=k+1
      Dnum[k]=num[k+1]-num[k]-1
      if (Dnum[k]>0) {
        // console.log(`*********Dnum >0*********`);
        for (let j=0;j<Dnum[k];j++ ){
          i=j+1;
          Sum[k]=Sum0+combinations(N-num[k]-i,L-(k+1));
          Sum0=Sum[k];
        }
      }
      else if ((Dnum[k]===0) && (k===L-1)) {
        Dnum[k]=1;
        for (let j=0;j<Dnum.length;j++) {
          i=j+1;
          Sum[k]=Sum0+combinations(N-num[k]-i,L-(k+1));
          Sum0=Sum[k]; 
        }
      } 
      else if ((Dnum[k]==0) && (k<=(L-2))) {
        continue;
      } 
      // console.log(`Sum[k]=`,Sum[k]);
    }
    Sum0=0;
    // console.log(`*******End for-loop*******`);
    for (let k=0;k<=L-1;k++){
        Sum0=Sum0+Sum[k];
    }
    return Sum0;
    // console.log(`***********End***********`);
    
}
// Deletion of a Results worksheet - a function
const deleteWorksheet = (filePath, workSheetName) => {
    const workBook = reader.readFile(filePath);
    const workSheetNames = Object.keys(workBook.Sheets);

    if (workSheetNames.includes(workSheetName)) {
        delete workBook.Sheets[workSheetName];
        delete workBook.SheetNames[workSheetName];
        indexToDelete = workBook.SheetNames.indexOf(workSheetName);
        workBook.SheetNames.splice(indexToDelete, 1);
        reader.writeFile(workBook, filePath);
    }
}

// Reading the CSV file with the historic lottery draw data
let data = []

const sheets = filein.SheetNames

for(let i = 0; i < sheets.length; i++)
{
const temp = reader.utils.sheet_to_json(
		filein.Sheets[filein.SheetNames[i]])
temp.forEach((res) => {
	data.push(res)
})
}

// Printing data
console.log(`data lenth:`,data.length);
// let balls = [0,7,10,24,31,48,56];
// let number = set2num(balls);
// console.log('number:',number);

//Sort the Draw objects (Ball 1-6) in an ascending order
for (let k=0; k<data.length;k++){
  
    data[k].Sequence = k;
    for (let i=1;i<6;i++){
        for (let j=i+1; j<=6; j++){
            let x=0;
            //console.log(`data[k]['Ball '+${i}:`,data[k]['Ball '+i]);
            if (data[k]['Ball '+i] > data[k]['Ball '+j]){
                x=data[k]['Ball '+i];
                data[k]['Ball '+i]=data[k]['Ball '+j];
                data[k]['Ball '+j]=x;
            }
        }
    }
    let balls=[0,data[k]['Ball 1'], data[k]['Ball 2'],data[k]['Ball 3'],data[k]['Ball 4'],data[k]['Ball 5'],data[k]['Ball 6']];
    data[k].Number = set2num(balls);
    //console.log('balls:', balls);
}
// Polynomial calculations
for (let i = 0; i < data.length; i ++ ){

  yAxis[i]=data[i].Number;
  xAxis[i]=data[i].Sequence;
  console.log(xAxis,yAxis);
  const degree = i
  const regression = new PolynomialRegression(xAxis, yAxis, degree);
  data[i].Interpolation=Math.round(regression.predict(i));
  console.log(Math.round(regression.predict(i)));
  data[i].Extrapolation=Math.round(regression.predict(i+1));
  console.log(Math.round(regression.predict(i+1)));
  console.log(regression.coefficients); // Prints the coefficients in increasing order of power (from 0 to degree).;
  console.log(regression.toString(3)); // Prints a human-readable version of the function.
  }