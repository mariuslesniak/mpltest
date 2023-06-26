'use strict';

//Title: Calculating a numeric representation of a 6-number out 1-49 range represeon
//Seting variables
//const numSet=[1,2,3];
// const numSet=[ 6, 14, 19, 20, 25, 30 ];
const numSet=[54,55,56,57,58,59];
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
  console.log(` A test run for C(59,6)=`,combinations(59,6));

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