'use strict';
//Name: Num2Set.js
//Title: Calculating a set of a 6-number out 1-49 range based on a number
//Specify the numeric range
const numRange = 59;
console.log(`The number range is`,numRange);
//const numbers = [3,5,8,9]; 
const numbers = [1,2,3,4,5,7];
let numSet = [];
// const numSetLength = numSet.length;
const numSetLength = numbers.length;
console.log(`The size on the number set is`,numbers.length);
const targetNum = 12418824;
//const targetNum = 8753796;
console.log(`The target numeric combination is`,targetNum);
let combValue=0; 
let combSum = [];
combSum[0]=0;
let combSum0=0;
let x=1;
let y=[0,numSetLength,1,0];
let argIndexI,argcombSum0,argIndexJ;

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

function combIteration(indexI,combSum0,indexJ) {
  
for (let i=indexI; i<=(numRange); i++) {
    combSum[0]=0;
    combValue=combinations (numRange-i,numSetLength-indexJ);
    combSum[i]=combSum0+combValue;
    combSum0=combSum[i];

    if (combSum[i] > targetNum) {
        numSet[indexJ-1] = i; 
        x=i;
        indexJ=indexJ+1;
        combSum[i]=combSum[i-1];
        y=[x,indexJ,combSum[i],combSum[i-1]];
        
        return y;
        break;
    } 
    if(combSum[i] === targetNum) {
      numSet[indexJ-1] = i;
        x=i;
        indexJ=indexJ+1;
        y=[x,indexJ,combSum[i],combSum[i-1]];
       
        return y;
        break;
    }
}
}
combSum[0]=1;
argIndexI=1; argcombSum0=0; argIndexJ=1;
combIteration(argIndexI,argcombSum0,argIndexJ);
for (let j = 1; j <= numSetLength; j++) {
  //Calling combIteration function
  combIteration(argIndexI,argcombSum0,argIndexJ);
  argIndexI=y[0]+1; argcombSum0=y[3]; argIndexJ=y[1];
}
console.log(`The resultant set of numbers is`,numSet);
// console.log(`numSet[]=`,numSet);
