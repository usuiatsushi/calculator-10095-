import { Component,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

})

export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }


  currentNumber: string = '0';
  firstOperand: number = null;
  operator: string = '';
  waitForSecondNumber = false;
  secondOperand:number = null;
  screenText:string = '';
  memoryNumber:number = 0;
  memoryNumberKeyOn: boolean = false;
  
  

  public memoryOperation(op:string){
    switch (op){
      case 'M+':
        if(this.currentNumber == "Infinity" || this.currentNumber == "NaN" ){
          this.currentNumber = "0";
          this.screenText = "";
        } else {
        this.memoryNumber = this.memoryNumber + Number(this.currentNumber);
        }
        console.log(this.memoryNumber)
        this.memoryNumberKeyOn = true;
        break;
      case 'M-':
        if(this.currentNumber == "Infinity" || this.currentNumber == "NaN" ){
          this.currentNumber = "0";
          this.screenText = "";
        } else {
          this.memoryNumber = this.memoryNumber - Number(this.currentNumber);
        }
        console.log(this.memoryNumber)
        this.memoryNumberKeyOn = true;
        break;
      case 'MR':
        const MAX_LENGTH = 13;
        let memoryNumberString = String(this.memoryNumber)
        console.log(memoryNumberString)
        console.log(memoryNumberString.substring(0,13))
        if (memoryNumberString.length > MAX_LENGTH) {
          if(memoryNumberString.includes("e")){
            memoryNumberString = String(Math.round((Number(memoryNumberString.substring(0,10)))*(10**7))/(10**7)) + "e" + memoryNumberString.substring(memoryNumberString.indexOf("+"));
          } else if(this.currentNumber.includes(".")){
            memoryNumberString = String((Math.round(Number(memoryNumberString.substring(0,14)) * (10**(12-memoryNumberString.indexOf("."))))) / (10**(12-memoryNumberString.indexOf("."))) );
          } else if(this.currentNumber.indexOf("-") == 0){
            memoryNumberString = "-" + String(Math.round(Number(memoryNumberString.substring(1,MAX_LENGTH-2))/10)/(10**(MAX_LENGTH-5))) + "e+" + String(memoryNumberString.length-2);
          } else {
            memoryNumberString = String(Math.round(Number(memoryNumberString.substring(0,MAX_LENGTH-3))/10)/(10**(MAX_LENGTH-5))) + "e+" + String(memoryNumberString.length-1);
          }   
        }
        this.currentNumber = memoryNumberString;
        this.firstOperand = null;
        this.waitForSecondNumber = false;
        this.screenText = this.currentNumber ; 
        this.memoryNumberKeyOn = true;
        break;
      case 'MC':
        this.memoryNumber = 0;
        break;
    }

  }


  public getNumber(v: string){
    console.log(v);
    console.log(this.waitForSecondNumber);
    console.log(this.memoryNumberKeyOn);

    

    if(this.currentNumber == "Infinity" || this.currentNumber == "NaN" ){
      this.currentNumber = v;
      this.screenText = v;
    } else
    if(this.screenText == null){
      this.currentNumber = v;
      this.screenText = v;
    } else
    if(this.screenText.includes('=')){
      console.log("true")
      this.currentNumber = v;
      this.screenText = v;
      this.waitForSecondNumber = false;
    } else 
    if(this.screenText == "1/(0) = undefined"){
      this.currentNumber = v;
      this.screenText = v;
    } else
    if(this.currentNumber !== "0" && this.screenText == ""){
      this.currentNumber = v;
      this.screenText = v;
    } else
    if(this.memoryNumberKeyOn == true){
      this.currentNumber = v;
      this.screenText = v;
      this.memoryNumberKeyOn = false;
    } else
    if(this.waitForSecondNumber){
      this.currentNumber = v;
      this.secondOperand = Number(v);
      this.waitForSecondNumber = false;
      this.screenText += v;
    } else
    if(this.currentNumber == '0'){
      this.currentNumber = v;
      this.screenText += v;
    } else {
      this.currentNumber += v;
      this.screenText += v;
    }
    const MAX_LENGTH = 13;
    if (this.currentNumber.length > MAX_LENGTH) {
    this.currentNumber = this.currentNumber.substring(0, MAX_LENGTH);
    this.screenText = this.screenText.substring(0,this.screenText.length-1)
    }
  }

  getPositiveNegative(){
    if(this.memoryNumberKeyOn == true)
      this.memoryNumberKeyOn = false;
    console.log(this.operator);
      this.currentNumber = String(-1*Number(this.currentNumber));
      if(this.currentNumber == "0"){
        this.screenText = "";
      } else
      if(this.operator){
        if(this.screenText.includes(this.operator)){
          this.screenText = this.firstOperand +" " + this.operator + " " +this.currentNumber;
        }
      } else {
      this.screenText = this.currentNumber;
      }
  }

  getDecimal(){
    if(this.memoryNumberKeyOn == true)
      this.memoryNumberKeyOn = false;
    if(!this.currentNumber.includes('.')){
        this.currentNumber += '.'; 
        this.screenText += '.'; 
    }
  }

  private doCalculation(op: string , secondOp: number){
    switch (op){
      case '+':
      return this.firstOperand += secondOp;
      case '-': 
      return this.firstOperand -= secondOp;
      case '×': 
      return this.firstOperand *= secondOp; 
      case '÷': 
      return this.firstOperand /= secondOp; 
      case '=':
      return secondOp;
      case '√':
      return Number(Math.sqrt(secondOp));
      case '²':
      return secondOp ** 2;
      case '1/':
      return 1 / secondOp;
      default :
      return 0;
    }
  }

  public getOperation(op: string){
    if(this.memoryNumberKeyOn == true)
      this.memoryNumberKeyOn = false;
    
    if(this.currentNumber == "Infinity" || this.currentNumber == "NaN"){
      this.currentNumber = "0";
      this.screenText = op;
      this.firstOperand = 0;
    }
    
    if(op === '1/'){
      if(this.currentNumber === "0"){
        this.screenText = "1/(0) = undefined";
        this.currentNumber = "error";
        this.operator = "=";
        this.waitForSecondNumber = true;
      } else {
        this.operator = op;
        this.firstOperand = Number(this.currentNumber)
        const result = this.doCalculation(this.operator , Number(this.currentNumber))
        this.currentNumber = String(result);
        this.screenText = "1/(" +this.firstOperand+") = " +result ;
        this.firstOperand = result;
        this.operator = "=";
        this.waitForSecondNumber = true;
      }
    } else
    if(op === '²'){
      if(this.currentNumber === "0"){
        this.screenText = "0² = 1";
        this.currentNumber = "1";
        this.operator = "=";
        this.waitForSecondNumber = true;
      } else {
        this.operator = op;
        this.firstOperand = Number(this.currentNumber)
        const result = this.doCalculation(this.operator , Number(this.currentNumber))
        this.currentNumber = String(result);
        this.screenText = this.firstOperand+"² = " +result ;
        this.firstOperand = result;
        this.operator = "=";
        this.waitForSecondNumber = true;
      }
    } else

    if(op === '√'){
      if(this.currentNumber === "0"){
        this.screenText = "√(0) = 0";
        this.currentNumber = "0";
        this.operator = "=";
        this.waitForSecondNumber = true;
      } else {
        this.operator = op;
        this.firstOperand = Number(this.currentNumber)
        const result = this.doCalculation(this.operator , Number(this.currentNumber))
        this.currentNumber = String(result);
        this.screenText = "√(" +this.firstOperand + ") = " +result ;
        this.firstOperand = result;
        this.operator = "=";
        this.waitForSecondNumber = true;  
      }
    } else 

    if(this.firstOperand === null){
      this.firstOperand = Number(this.currentNumber);
      if(this.screenText === null){
        this.screenText = op;
      } else {
         this.screenText += " " + op + " ";
      }
      this.operator = op;
      this.waitForSecondNumber = true;
    } else 

    if(this.operator){
      if(this.screenText.slice(-2,-1) == this.operator && this.operator !== op){
            this.screenText = this.screenText.substring(0,this.screenText.length-2) + op + " ";
            this.operator = op;
      } else {
          const result = this.doCalculation(this.operator , Number(this.currentNumber))
          this.currentNumber = String(result);
          this.firstOperand = result;
          if(this.screenText === null){
            this.screenText += " " + op;
          } else 
          if(op == "="){
            this.screenText = "= " + result;
            this.operator = op;
            this.waitForSecondNumber = true;
          } else {
            this.screenText =  result + " " + op + " " ;
            this.operator = op;
            this.waitForSecondNumber = true;
          }
      
      } 
    }
    console.log(this.currentNumber)
    console.log(this.screenText);
    
    const MAX_LENGTH = 13;
    if (this.currentNumber.length > MAX_LENGTH) {
      if(this.currentNumber.includes("e")){
          this.currentNumber = String(Math.round((Number(this.currentNumber.substring(0,10)))*(10**7))/(10**7)) + "e" + this.currentNumber.substring(this.currentNumber.indexOf("+"));
      } else if(this.currentNumber.includes(".")){
        this.currentNumber = String((Math.round(Number(this.currentNumber.substring(0,14)) * (10**(12-this.currentNumber.indexOf("."))))) / (10**(12-this.currentNumber.indexOf("."))) );
      } else if(this.currentNumber.indexOf("-") == 0){
        this.currentNumber = "-" + String(Math.round(Number(this.currentNumber.substring(1,MAX_LENGTH-2))/10)/(10**(MAX_LENGTH-5))) + "e+" + String(this.currentNumber.length-2);
      } else {
        this.currentNumber = String(Math.round(Number(this.currentNumber.substring(0,MAX_LENGTH-3))/10)/(10**(MAX_LENGTH-5))) + "e+" + String(this.currentNumber.length-1);
      }   

      if(this.screenText.includes("=")){
        this.screenText = this.screenText.substring(0,this.screenText.indexOf("=")) + "= " + this.currentNumber;
      } else{
        this.screenText = this.currentNumber; 
      }
       
      if(this.operator !== "="){
        this.screenText += " " +this.operator + " ";
      }
    }
    console.log(this.operator);
  }


  public clear(){
    if(this.memoryNumberKeyOn == true)
      this.memoryNumberKeyOn = false;
    
    this.currentNumber = '0';
    this.firstOperand = null;
    this.operator = '';
    this.waitForSecondNumber = false;
    this.secondOperand = null;
    this.screenText = null;
  }

  public reset(){
    if(this.memoryNumberKeyOn == true)
      this.memoryNumberKeyOn = false;
    
    if(this.currentNumber == "Infinity" || this.currentNumber == "NaN"){
      this.screenText = "";
      this.firstOperand = null;
    }

    this.currentNumber = '0';
    this.secondOperand = null;
    console.log(this.operator);
    
    if(this.screenText == "" || this.screenText == "0"){
      this.screenText = "";
    } else
    if(this.operator == "="){
      this.screenText = "";
    } else 
    if(this.operator){
      let firstOperandString = String(this.firstOperand);
        if(firstOperandString .indexOf("e") !== -1){
          firstOperandString = firstOperandString .substring(0,10) + firstOperandString .substring(firstOperandString .indexOf("e"),firstOperandString .length);
        }
      this.screenText = firstOperandString + " " + this.operator + " ";
    } else {
      this.screenText = "";
    }
    if(this.screenText.includes("null")){
      this.screenText = "";
    }
  }

  public Delete(){
    if(this.memoryNumberKeyOn == true)
      this.memoryNumberKeyOn = false;
    
      console.log(this.operator);

      if(this.screenText.includes("=")){
        this.screenText = this.currentNumber;
        this.waitForSecondNumber = false;
      }

      if(this.screenText === '' || this.screenText === '0' ){
        this.screenText = "";
        this.currentNumber = '0';
      } else
      if(this.currentNumber == "Infinity" || this.currentNumber == "NaN" ||  this.screenText == "error"){
      this.currentNumber = '0';
      this.firstOperand = null;
      this.operator = '';
      this.waitForSecondNumber = false;
      this.screenText = null;
      } else
      if(this.screenText.includes("e")){
        this.currentNumber = this.currentNumber.substring(0,this.currentNumber.indexOf("e")) + "e+"+ String(Number((this.currentNumber.substring(this.currentNumber.indexOf("e")+1)))-1);
        if(this.operator !== "="){
          this.screenText = this.currentNumber + this.screenText.substring(this.screenText.indexOf(this.operator)-1);
        } else{
          this.screenText = this.currentNumber;
        }
        
      } else
      if(this.screenText.slice(-2,-1) == this.operator){
        this.screenText = this.screenText.slice(0, -3);
        this.firstOperand = null;
        this.waitForSecondNumber = false;
        this.currentNumber = this.screenText
      } else{
        this.currentNumber = this.currentNumber.slice(0, -1);
        this.screenText = this.screenText.slice(0, -1);
      }

      

      if(this.screenText == '' || this.screenText == '0' || this.screenText == ' '){
        this.screenText = "";
        this.currentNumber = '0';
      }

      if(this.currentNumber == "-"){
        this.currentNumber = "0"
        this.screenText = this.screenText.slice(0, -1);
      }
    }
  
  ngOnInit(): void {
    
  }   
    ///
 }
 
 