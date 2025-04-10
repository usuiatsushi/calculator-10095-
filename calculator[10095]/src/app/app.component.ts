import { Component,OnInit } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { max } from 'rxjs';


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
    currentNumberAbs: string = "0"

  screenText:string = '';

  firstOperand: number = null; 
  secondOperand:number = null;

  operator: string = '';
  subOperator: string = '';
  operatorKeyOn: boolean = false;
  subOperatorKeyOn: boolean = false;

  waitForSecondNumber = false;

  memoryNumber:number = 0;
  memoryNumberKeyOn: boolean = false;
  
  
  
  //メモリ機能
  public memoryOperation(op:string){
    switch (op){
      //M+
      case 'M+':
        
        if(this.currentNumber == "NaN" || this.currentNumber == "error"){
          //定義不可能
          this.currentNumber = "0";
          this.screenText = "";
        } else {
          //計算
        this.memoryNumber = this.memoryNumber + Number(this.currentNumber);
        }
        console.log(this.memoryNumber)
        // メモリーキーチェック
        this.memoryNumberKeyOn = true;
        break;
      //M-
      case 'M-':
        if(this.currentNumber == "NaN" || this.currentNumber == "error" ){
          //定義不可能
          this.currentNumber = "0";
          this.screenText = "";
        } else {
          //計算
          this.memoryNumber = this.memoryNumber - Number(this.currentNumber);
        }
        console.log(this.memoryNumber)
        // メモリーキーチェック
        this.memoryNumberKeyOn = true;
        break;
      //MR//
      case 'MR':
        const MAX_LENGTH = 13;
        let memoryNumberString = String(this.memoryNumber)
        　//　文字数13まで
        if (memoryNumberString.length > MAX_LENGTH) {
          if(memoryNumberString.includes("e")){
            // e+ を含むとき
            memoryNumberString = String(Math.round((Number(memoryNumberString.substring(0,10)))*(10**7))/(10**7)) + "e" + memoryNumberString.substring(memoryNumberString.indexOf("+"));
          } else if(memoryNumberString.includes(".")){
            // 小数点を含むとき
            if(memoryNumberString.indexOf(".")<=11){
              //　小数点が11文字目までにある時
              memoryNumberString = String((Math.round(Number(memoryNumberString.substring(0,14)) * (10**(12-memoryNumberString.indexOf("."))))) / (10**(12-memoryNumberString.indexOf("."))) );
            } else if(memoryNumberString.indexOf("-") == 0){
              //　小数点が12文字目以降　→　整数部分のみ着目　かつ　負の数
              memoryNumberString = "-" + String(Math.round(Number(memoryNumberString.substring(1,MAX_LENGTH-2))/10)/(10**(MAX_LENGTH-5))) + "e+" + String(Number(memoryNumberString.indexOf("."))-1);
            } else {
              //　小数点が12文字目以降　→　整数部分のみ着目　かつ　正の数
              memoryNumberString = String(Math.round(Number(memoryNumberString.substring(0,MAX_LENGTH-3))/10)/(10**(MAX_LENGTH-5))) + "e+" + String(Number(memoryNumberString.indexOf("."))-1);
            }
          } else if(memoryNumberString.indexOf("-") == 0){
            // 負の数
            memoryNumberString = "-" + String(Math.round(Number(memoryNumberString.substring(1,MAX_LENGTH-2))/10)/(10**(MAX_LENGTH-5))) + "e+" + String(memoryNumberString.length-2);
          } else {
            // 正の数
            memoryNumberString = String(Math.round(Number(memoryNumberString.substring(0,MAX_LENGTH-3))/10)/(10**(MAX_LENGTH-5))) + "e+" + String(memoryNumberString.length-1);
          }   
        }
      　//　文字数13以下
        this.currentNumber = memoryNumberString;
        this.firstOperand = null;
        this.waitForSecondNumber = false;
        this.screenText = this.currentNumber ; 
        // メモリーキーチェック
        this.memoryNumberKeyOn = true;
        break;
        
      case 'MC':
        //メモリークリア
        this.memoryNumber = 0;
        break;
    }

  }

  //　数字入力
  public getNumber(v: string){
    //　フラグチェック
    console.log(this.waitForSecondNumber,"waitForSecondNumber");
    console.log(this.memoryNumberKeyOn,"this.memoryNumberKeyOn");

    if(this.currentNumber == "NaN" || this.currentNumber == "error" ){
      // 定義不可能
      this.currentNumber = v;
      this.waitForSecondNumber = false;
    } else
    if(this.screenText?.includes("=")){
      this.currentNumber = v;
      this.screenText = "";
      this.waitForSecondNumber = false;
    } else
    if(this.memoryNumberKeyOn == true){
      // メモリーキーチェック　おそらくMRでスクリーン上に表示する設定にしているから必要
      this.currentNumber = v;
      this.memoryNumberKeyOn = false;
    } else
    if(this.waitForSecondNumber){
      // waitForSecondNumberフラグチェック
      this.currentNumber = v;
      this.secondOperand = Number(v);
      this.waitForSecondNumber = false;
    } else
    if(this.currentNumber == '0'){
      // スクリーン下が0のとき
      this.currentNumber = v;
    } else {
      //　通常時は数字を追加
      this.currentNumber += v;
    }
    // "00"を0に
    if(Number(this.currentNumber) == 0 && this.currentNumber?.includes(".") == false){
      this.currentNumber = "0";
    }

    this.memoryNumberKeyOn = false;
    this.operatorKeyOn = false;
    
    //10億の桁まで計算できること  小数点は最大8位まで表示できること // 桁数増やすならMAX_LENGTH を調整
    const MAX_LENGTH = 10;
    if(Math.sign(Number(this.currentNumber)) == -1){
      this.currentNumberAbs = this.currentNumber.slice(1);
    }
      this.currentNumberAbs = this.currentNumber;

    console.log(this.currentNumberAbs,"currentNumberAbs");
    
    if (this.currentNumberAbs.length > MAX_LENGTH) {
      // 入力値の絶対値の文字数をMAX_LENGTHに制限　それ以降は反応しない
      if(v == "00"){
          if(this.currentNumberAbs.length == MAX_LENGTH + 1){
              this.currentNumber =  this.currentNumber.substring(0,this.currentNumber.length-1);
          } else if(this.currentNumber.length == MAX_LENGTH + 2){
            this.currentNumber =  this.currentNumber.substring(0,this.currentNumber.length-2);
          }
      } else {
          this.currentNumber = this.currentNumber.substring(0,this.currentNumber.length-1);
      }
    }
  }

  getPositiveNegative(){
    if(this.currentNumber == "NaN" || this.currentNumber == "error"){
      //　定義不可能
      this.currentNumber = "0";
      this.screenText = "";
      this.firstOperand = 0;
    }
      //　メモリーキーフラグをオフに
    if(this.memoryNumberKeyOn == true)
      this.memoryNumberKeyOn = false;
    console.log(this.operator);
      this.currentNumber = String(-1*Number(this.currentNumber));
      if(this.currentNumber == "0"){
        // 数値が0の時　
        this.screenText = "";
      } else
        // 数値が0以外
      if(this.operator && this.screenText.includes(this.operator)){
        // オペレーターがある時　計算途中
          if(this.operator !== "="){
            this.screenText = this.firstOperand +" " + this.operator + " " +this.currentNumber;
          } else {
          }
      } else {
        // オペレーターなし　数値のみ
      }
  }

  getDecimal(){
    //　メモリーキーフラグをオフ
    this.memoryNumberKeyOn = false;
    this.operatorKeyOn = false;

    //　定義不可能
    if(this.currentNumber == "NaN" || this.currentNumber == "error"){
      this.currentNumber = "0";
      this.screenText = "";
      this.firstOperand = 0;
    }
    if(this.currentNumber == "Infinity"){
      this.currentNumber = '0';
      this.screenText = this.screenText.substring(0,this.screenText.indexOf("Infinity"));
    } else
    if(this.currentNumber == "-Infinity"){
      this.currentNumber = '0';
      this.screenText = this.screenText.substring(0,this.screenText.indexOf("-Infinity"));
    } 

    if(this.operator && this.screenText.slice(-2,-1) == this.operator){
       this.currentNumber = "0.";     
    } else
    // 小数点すでにある時　何もしない　e+の時は有効数字的に何もしなくてもよいという判断
    if(this.currentNumber && this.currentNumber.includes('.')){
    } else 
    // 数値が0の時　
    if(Number(this.currentNumber) == 0){
      this.currentNumber = "0.";
    } else
    // 結果表示に = を含む時
    if(this.screenText?.includes("=")){
        this.currentNumber += '.'; 
    } else
    // 入力値に . を含まないとき　(デフォルト)
    if(!this.currentNumber.includes('.')){
        this.currentNumber += '.'; 
    } 
    this.waitForSecondNumber = false;
  }

  private doCalculation(op: string , secondOp: number){
    // 計算機能　リターンで計算結果を返す
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
    // メモリーキーオフ
    this.memoryNumberKeyOn = false;
    // .で数値が終わる場合　.削除
    if(this.currentNumber.slice(-1) == "." ){
        this.currentNumber = this.currentNumber.slice(0,-1);
    }
    
    console.log(this.operatorKeyOn,"operatorKeyOn",this.operator,"operator",op,"op");
    
    // 定義不可能
    if(this.currentNumber == "NaN" || this.currentNumber == "error"){
      this.currentNumber = "0";
      this.firstOperand = 0;
    }
    
    // サブオペレーター
    // x分の１ボタン
    if(op === '1/'){
      if(this.operator){
        // 計算途中
        if(this.operator !== "=")
        { 
          this.screenText = this.screenText + " " + "1/(" +this.currentNumber + ")" ;
          this.currentNumber = String(1/Number(this.currentNumber));
        } else {
          const result = 1/Number(this.currentNumber)
          this.screenText = "1 /(" +this.currentNumber + ")" ;
          this.currentNumber = String(result);
          this.firstOperand = result;
          this.operator = "1/";
          this.waitForSecondNumber = true;
        }
      } else   
      // 数値のみ    
      {
        const result = 1/Number(this.currentNumber)
        this.screenText = "1 /(" +this.currentNumber + ")" ;
        this.currentNumber = String(result);
        this.firstOperand = result;
        this.waitForSecondNumber = true;
      }
      this.subOperator = op;
      this.subOperatorKeyOn = true;
    } else
    // ２乗
    if(op === '²'){
      if(this.operator){
        //　計算途中
          if(this.operator !== "=")
          { 
            this.screenText = this.screenText + " " + "(" + this.currentNumber + ")" + "²";
            this.currentNumber = String(Number(this.currentNumber)**2);
          } else {
            const result = Number(this.currentNumber)**2
            this.screenText = "(" + this.currentNumber + ")" + "²"  ;
            this.currentNumber = String(result);
            this.firstOperand = result;
            this.waitForSecondNumber = true;
          }
      } else {
      // 数値のみ
          const result = Number(this.currentNumber)**2
          this.screenText = "(" + this.currentNumber + ")" + "²" ;
          this.currentNumber = String(result);
          this.firstOperand = result;
          this.waitForSecondNumber = true;
      }
      this.subOperator = op;
      this.subOperatorKeyOn = true;
    } else
    // ルート
    if(op === '√'){
      
      if(this.operator){
        // 計算途中
        if(this.operator !== "=")
        { 
          this.screenText = this.screenText + " " + "√(" +this.currentNumber + ")";
          this.currentNumber = String(Math.sqrt(Number(this.currentNumber)));
          this.waitForSecondNumber = true;
        } else {
          const result = Math.sqrt(Number(this.currentNumber))
          this.screenText = "√(" +this.currentNumber + ")" ; 
          this.currentNumber = String(result);
          this.firstOperand = result;
          this.waitForSecondNumber = true;
        }
        // 数値のみ
      } else {
                const result = Math.sqrt(Number(this.currentNumber))
                this.screenText = "√(" +this.currentNumber + ")" ;
                this.currentNumber = String(result);
                this.firstOperand = result;
                this.waitForSecondNumber = true;
      }
      this.subOperator = op;
      this.subOperatorKeyOn = true;
      this.operatorKeyOn = false;
    } else {
    // メインオペレータ
    // オペランドチェック　数値一つ目か二つ目か
          if(this.firstOperand === null){
            this.firstOperand = Number(this.currentNumber);
            this.screenText = this.currentNumber + " " + op;
            this.operator = op;
            this.waitForSecondNumber = true;
          } else 
          if(this.operator == ""){
            this.firstOperand = Number(this.currentNumber);
            this.screenText = this.screenText + " " + op;
            this.operator = op;
            this.waitForSecondNumber = true;
          } else
          // +-×÷　を連続 オペレーターを変更
          if(this.operatorKeyOn == true && this.operator !== "=" && op !== "="){
                this.screenText = this.screenText.substring(0,this.screenText.length-1) + op;
                this.operator = op;
          } else
          if(this.subOperatorKeyOn == true && op == "="){
                const result = this.doCalculation(this.operator , Number(this.currentNumber))
                this.screenText = this.screenText + " =";
                this.currentNumber = String(result);
                this.firstOperand = result;
                this.operator = op;
                this.waitForSecondNumber = true;
          } else 
          if(this.operator  && op == "="){
                // =で計算
                const result = this.doCalculation(this.operator , Number(this.currentNumber))
                this.screenText = this.screenText + " " + this.currentNumber + " " + op;
                this.currentNumber = String(result);
                this.firstOperand = result;
                this.operator = op;
                this.waitForSecondNumber = true;
          } else
          if(this.operator  && op !== "="){
                // その他で計算
                const result = this.doCalculation(this.operator , Number(this.currentNumber))
                this.screenText = result + " " + op;
                this.currentNumber = String(result);
                this.firstOperand = result;
                this.operator = op;
                this.waitForSecondNumber = true;
          }
        
          this.operatorKeyOn = true;
          this.subOperatorKeyOn = false;
    }

    console.log(this.currentNumber,"currentNumber");
    
    // 文字数制限
    const MAX_LENGTH = 10;
    if(Math.sign(Number(this.currentNumber)) == -1){
      this.currentNumberAbs = this.currentNumber.slice(1);
    }
      this.currentNumberAbs = this.currentNumber;
    
    if (this.currentNumberAbs.length > MAX_LENGTH) {
      if(this.currentNumberAbs.includes("e")){
          this.currentNumber = String(Math.round((Number(this.currentNumber.substring(0,10)))*(10**7))/(10**7)) + "e" + this.currentNumber.substring(this.currentNumber.indexOf("+"));
      } else if(this.currentNumberAbs.includes(".")){
          // 整数部分が MAX_LENGTH 桁以内
          if(this.currentNumberAbs.indexOf(".")< MAX_LENGTH +1){
            　this.currentNumberAbs = String((Math.round(Number(this.currentNumberAbs.substring(0,MAX_LENGTH+1)) * (10**((MAX_LENGTH-1)-this.currentNumberAbs.indexOf("."))))) / (10**((MAX_LENGTH-1)-this.currentNumber.indexOf("."))));
          } else {
            // 整数部分が MAX_LENGTH+1 桁以上
            this.currentNumberAbs = String(Math.round(Number(this.currentNumberAbs.substring(0,MAX_LENGTH+1))/10)/(10**(MAX_LENGTH-1))) + "e+" + String(this.currentNumberAbs.length-1);
          }
      } else {
        // MAX_LENGTH+1 桁以上
        this.currentNumberAbs = String(Math.round(Number(this.currentNumberAbs.substring(0,MAX_LENGTH+1))/10)/(10**(MAX_LENGTH-1))) + "e+" + String(this.currentNumberAbs.length-1);
      }

      if(Math.sign(Number(this.currentNumber)) == -1){
        this.currentNumber =　"-" +  this.currentNumberAbs;
      } else { this.currentNumber = this.currentNumberAbs; }
    }
    
    console.log(this.operator,"operator");
    
  }

  // クリア
  public clear(){
    // メモリーキーオフ
    if(this.memoryNumberKeyOn == true)
      this.memoryNumberKeyOn = false;
    
    this.currentNumber = '0';
    this.firstOperand = null;
    this.operator = '';
    this.waitForSecondNumber = false;
    this.secondOperand = null;
    this.screenText = null;
  }

  // 数値のみクリア
  public reset(){
    // メモリーキーオフ
    if(this.memoryNumberKeyOn == true)
      this.memoryNumberKeyOn = false;
    
    // 定義不可能
    if(this.currentNumber == "NaN" || this.currentNumber == "error"){
      this.screenText = "";
      this.firstOperand = null;
    }

    // 数値を0に
    this.currentNumber = '0';
    this.secondOperand = null;
    console.log(this.operator);
    
    if(this.screenText == "" || this.screenText == "0"){
      this.screenText = "";
    } else
    if(this.operator == "="){
      this.screenText = "";
      this.firstOperand = 0;
    } else 
    if(this.operator){
      // 計算途中
      let firstOperandString = String(this.firstOperand);
        if(firstOperandString .indexOf("e") !== -1){
          // e+を含む場合
          firstOperandString = firstOperandString .substring(0,10) + firstOperandString .substring(firstOperandString .indexOf("e"),firstOperandString .length);
        }
      this.screenText = firstOperandString + " " + this.operator + " ";
    } else {      
      this.screenText = "";
    }
    if(this.screenText.includes("null")){
      // nullが表示されてしまう場合
      this.screenText = "";
    }
  }

  // 一文字消去
  public Delete(){
    if(this.memoryNumberKeyOn == true)
      this.memoryNumberKeyOn = false;
    
      console.log(this.operator);
      
      if(this.screenText !== null){
        if(this.screenText.includes("=")){
          this.screenText = this.currentNumber;
          this.waitForSecondNumber = false;
        }
      }

      if(this.screenText == null || this.screenText === '' || this.screenText === '0' ){
        this.screenText = "";
        this.currentNumber = '0';
      } else
      if(this.currentNumber == "Infinity"){
        this.currentNumber = '0';
        this.screenText = this.screenText.substring(0,this.screenText.indexOf("Infinity"));
      } else
      if(this.currentNumber == "-Infinity"){
        this.currentNumber = '0';
        this.screenText = this.screenText.substring(0,this.screenText.indexOf("-Infinity"));
      } else
      if(this.currentNumber == "NaN" ||  this.screenText == "error"){
      this.currentNumber = '0';
      this.firstOperand = null;
      this.operator = '';
      this.waitForSecondNumber = false;
      this.screenText = null;
      } else
      if(this.screenText.includes("e")){
        // e+nのとき そのまま維持        
      } else
      if(this.screenText.slice(-2,-1) == this.operator){
        // 四則演算のみ消去
        this.screenText = this.screenText.slice(0, -3);
        this.firstOperand = null;
        this.waitForSecondNumber = false;
        this.currentNumber = this.screenText
      } else{
        // 基本は一文字消去
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
 
 