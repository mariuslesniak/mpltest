// This is an attempt to interpolate/extrapolate lottery draws 
// using "everpolate" algorythm by Boris Chumichev
// two methods were used Polynomial Interpolation and Lineat Regression
// Polynomial Interpolation is really good for interpolation only, unstable beyond the N-1 point
// Linear regression is not good here really

const { linear } = require('everpolate');
const { polynomial } = require('everpolate');
const { linearRegression } = require('everpolate');
const reader = require('xlsx');

// SIMPLE TESTS
// ------------
// const everpolate = require('everpolate').linear;
var valueInterpolation = [];
valueInterpolation = linear([2, 0, 8], [-2, 0, 6, 8], [4, 0, 3, -3])
console.log(valueInterpolation);
// const everpolate = require('everpolate').polynomial;
var polyInterpolation = [];
polyInterpolation = polynomial([0.021, 0.022], [0, 1.1, 2.4], [12, 431, 39]);
console.log(polyInterpolation);
// Linear regression
var regression = [];
const xValues = [0, 1, 2, 3, 4, 5];
const yValues = [2, 3, 4, 5, 6, 7];
regression = linearRegression(xValues, yValues);
console.log(regression.evaluate([2,3.5]));
// END of SIMPLE TESTS
// -------------------

//FUNCTIONS
//********* 

// Set2Num function
//-----------------

let set2num = function(arg){
    const numSet=arg;
    const numRange=59;
    const numSetLength = numSet.length
    console.log(`numSetLength=`,numSetLength);
    let numDelta=[]
    let Sum=[];
    let Sum0=0;
    let numRef=0;
    let i,j;
    for (let i=0; i<=numSet.length-1;i++){
        numDelta[i]=0;
    }
    for (let i=0; i<=numSetLength-1;i++){
        Sum[i]=0;
    }

    // Functions
    //----------
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
    //   console.log(` A test run for C(10,3)=`,combinations(10,3));

    // The external for loop
    //----------------------
    for (let k=0;k<numSetLength;k++){
      Sum0=0;
      numDelta[k]=numSet[k]-numRef-1;
      if (numDelta[k]>0) {
        for (let j=0;j<numDelta[k];j++ ){
            i=j+1;
            Sum[k]=Sum0+combinations(numRange-numRef-i,numSetLength-(k+1));
            Sum0=Sum[k];
        }
      }
      // if ((numDelta[k]===0) && (k===numSetLength-1)) {
        if (k===numSetLength-1) {
          Sum[k]=Sum0+combinations(numRange-numSet[k]-i,numSetLength-(k+1));
          Sum0=Sum[k];
        }
      
      numRef=numSet[k];
      }
    Sum0=0;
    for (let k=0;k<=numSet.length-1;k++){
        Sum0=Sum0+Sum[k];
    }
    console.log(`Sum0=`,Sum0);
    return Sum0;
    // console.log(`***********End***********`);
}

// Reading our test file
const filein = reader.readFile('./excel_data/LottoHistory1.xlsx');
const fileout = reader.readFile('./excel_data/LottoOutput.xlsx');
let xAxis = [];
let yAxis =[];
let xParam;

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
console.log("sheets name:",sheets);
for(let i = 0; i < sheets.length; i++)
{
const temp = reader.utils.sheet_to_json(
		filein.Sheets[filein.SheetNames[i]])
temp.forEach((res) => {
	data.push(res)
})
}

// How much data?
console.log(`data length:`,data.length);

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
console.log(`data length:`,data.length);

// Polynomial calculations
for (let i = 0; i < data.length; i ++ ){

    yAxis[i]=data[i].Number;
    xAxis[i]=data[i].Sequence;
    console.log(xAxis,yAxis);
}
// Polynomial extrapolation 
// var polyInterpolation = [];
polyInterpolation = polynomial([data.length-2,data.length-1,data.length], xAxis, yAxis);
console.log(polyInterpolation);
// Linear regression
// var regression = [];
regression = linearRegression(xAxis, yAxis);
console.log(regression.evaluate([data.length,data.length+3]));