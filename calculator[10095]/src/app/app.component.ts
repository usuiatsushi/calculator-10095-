import { Component,ElementRef,ViewChild,AfterViewInit,OnInit, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalcComponent } from "./calc/calc.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CalcComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

})

export class AppComponent implements OnInit {


  currentNumber = '0';
  firstOperand: any = null;
  operator: string = '';
  waitForSecondNumber = false;
  secondOperand:any = null;
  screenText:string = '';
  memoryNumber:number = null;
  

  public memoryOperation(op:string){
    switch (op){
      case 'M+':
        this.memoryNumber = this.memoryNumber + Number(this.currentNumber);
        this.currentNumber = "0";
        this.screenText = '';
        break;
      case 'M-':
        this.memoryNumber = this.memoryNumber - Number(this.currentNumber);
        this.currentNumber = "0";
        this.screenText = '';
        break;
      case 'MR':
        this.currentNumber = String(this.memoryNumber)
        this.screenText = '';
        break;
      case 'MC':
        this.memoryNumber = 0;
        this.screenText = '';
    }

  }


  public getNumber(v: string){
    console.log(v);
    console.log(this.waitForSecondNumber);
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
    if(this.waitForSecondNumber){
      this.currentNumber = v;
      this.secondOperand = v;
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
    console.log(this.operator);
      this.currentNumber = String(-1*Number(this.currentNumber));
      if(this.currentNumber == "0"){
        this.screenText = "";
      } else
      if(this.operator){
        if(this.screenText.includes(this.operator)){
          this.screenText = this.firstOperand +this.operator + this.currentNumber;
        }
      } else {
      this.screenText = this.currentNumber;
      }
  }

  getDecimal(){
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
      return Math.sqrt(secondOp);
      case '²':
      return secondOp ** 2;
      case '1/':
      return 1 / secondOp;
    }
  }

  public getOperation(op: string){
    
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
        this.waitForSecondNumber = false;
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
    const MAX_LENGTH = 13;
    if (this.currentNumber.length > MAX_LENGTH) {
      console.log(this.currentNumber.substring(MAX_LENGTH-1,MAX_LENGTH+1));
      if(this.currentNumber.includes(".")){
        this.currentNumber = this.currentNumber.substring(0, MAX_LENGTH-1) + Math.round(Number(this.currentNumber.substring(MAX_LENGTH-1,MAX_LENGTH+1))/10);
       } else {
        this.currentNumber = this.currentNumber.substring(0, MAX_LENGTH-1) + "..."
      }
    console.log(this.operator);
    
    }
  }

  public clear(){
    this.currentNumber = '0';
    this.firstOperand = null;
    this.operator = '';
    this.waitForSecondNumber = false;
    this.secondOperand = null;
    this.screenText = null;
  }

  public reset(){
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
    this.screenText = String(this.firstOperand) + " " + this.operator + " ";
    } else {
      this.screenText = "";
    }
  }

  public Delete(){
    if(this.currentNumber === '0' ){
      this.currentNumber = '0';
      } else if(this.screenText.slice(-1) == this.operator){
        this.screenText = this.screenText.slice(0, -1);
        this.firstOperand = null;
        this.waitForSecondNumber = false;
        this.currentNumber = this.screenText
      } else{
        this.currentNumber = this.currentNumber.slice(0, -1);
        this.screenText = this.screenText.slice(0, -1);
      }
    }


  //最大文字数、桁制限


  
  ngOnInit(): void {
    
  }   
    ///
 }
 
 