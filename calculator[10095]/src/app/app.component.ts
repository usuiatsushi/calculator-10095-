import { Component,OnInit } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
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
    console.log(this.waitForSecondNumber);
    console.log(this.memoryNumberKeyOn);

    if(this.currentNumber == "Infinity" || this.currentNumber == "NaN" || this.currentNumber == "error" ){
      // 定義不可能
      this.currentNumber = v;
      this.screenText = v;
      this.waitForSecondNumber = false;
    } else
    if(this.screenText == null){
      // スクリーン上が空欄
      this.currentNumber = v;
      this.screenText = v;
    } else
    if(this.screenText.includes('=')){
      // ＝を含む時
      this.currentNumber = v;
      this.screenText = v;
      this.waitForSecondNumber = false;
    } else 
    if(this.screenText == "1/(0) = undefined"){
      // 定義不可能　一番上で消してるはずだが念のため。
      this.currentNumber = v;
      this.screenText = v;
    } else
    if(this.currentNumber !== "0" && this.screenText == ""){
      // スクリーン上が空白　かつ　スクリーン下が0以外
      // メモリー機能など使用時
      this.currentNumber = v;
      this.screenText = v;
    } else
    if(this.memoryNumberKeyOn == true){
      // メモリーキーチェック　おそらくMRでスクリーン上に表示する設定にしているから必要
      this.currentNumber = v;
      this.screenText = v;
      this.memoryNumberKeyOn = false;
    } else
    if(this.waitForSecondNumber){
      // オペレーター直後かどうか　フラグチェック
      this.currentNumber = v;
      this.secondOperand = Number(v);
      this.waitForSecondNumber = false;
      this.screenText += v;
    } else
    if(this.currentNumber == '0'){
      // スクリーン下が0のとき
      this.currentNumber = v;
      this.screenText += v;
    } else {
      //　通常時は数字を追加
      this.currentNumber += v;
      this.screenText += v;
    }
    this.memoryNumberKeyOn = false;
    
    const MAX_LENGTH = 13;
    if (this.currentNumber.length > MAX_LENGTH) {
      // 文字数を13に制限　それ以降は反応しない
      if(v == "00"){
          if(this.currentNumber.length == MAX_LENGTH + 1 ){
              this.currentNumber = this.currentNumber.substring(0, MAX_LENGTH);
              this.screenText = this.screenText.substring(0,this.screenText.length-1)
          } else if(this.currentNumber.length == MAX_LENGTH + 2 ){
            this.currentNumber = this.currentNumber.substring(0, MAX_LENGTH);
            this.screenText = this.screenText.substring(0,this.screenText.length-2)
          }
      } else {
          this.currentNumber = this.currentNumber.substring(0, MAX_LENGTH);
          this.screenText = this.screenText.substring(0,this.screenText.length-1)
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
      if(this.operator){
        // オペレーターがある時　計算途中
        if(this.screenText.includes(this.operator)){
          this.screenText = this.firstOperand +" " + this.operator + " " +this.currentNumber;
        }
      } else {
        // オペレーターなし　数値のみ
      this.screenText = this.currentNumber;
      }
  }

  getDecimal(){
    //　メモリーキーフラグをオフ
    if(this.memoryNumberKeyOn == true)
      this.memoryNumberKeyOn = false;

    //　定義不可能
    if(this.currentNumber == "Infinity" || this.currentNumber == "NaN" || this.currentNumber == "error"){
      this.currentNumber = "0";
      this.screenText = "";
      this.firstOperand = 0;
    }

    if(this.operator && this.screenText.slice(-2,-1) == this.operator){
       this.currentNumber = "0.";
       this.screenText += "0."      
    } else
    if(this.currentNumber.includes('.')){
      // 小数点すでにある時　何もしない　e+の時は有効数字的に何もしなくてもよいという判断
    } else
    if(Number(this.currentNumber) == 0){
      // 数値が0の時　
      this.currentNumber = "0.";
      if(this.screenText == null){this.screenText = "0."} else {
      // 00の場合を考慮
      this.screenText = `${this.screenText.substring(0, this.screenText.indexOf("00"))}0.`;}
    } else
    if(this.screenText.includes("=")){
        this.currentNumber += '.'; 
        this.screenText = this.currentNumber;
    } else
    if(!this.currentNumber.includes('.')){
      // 通常時
        this.currentNumber += '.'; 
        this.screenText += '.'; 
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
    if(this.memoryNumberKeyOn == true)
      this.memoryNumberKeyOn = false;

    console.log(this.currentNumber.slice(-1));
    
    if(this.currentNumber.slice(-1) == "." ){
        this.currentNumber = this.currentNumber.slice(0,-1);
        this.screenText = this.screenText.slice(0,-1);
    }
    
    console.log(this.currentNumber);
    
    // 定義不可能
    if(this.currentNumber == "NaN" || this.currentNumber == "error"){
      this.currentNumber = "0";
      this.screenText = op;
      this.firstOperand = 0;
    }
    
    // x分の１ボタン
    if(op === '1/'){
      if(this.operator){
        // 計算途中
        if(this.operator !== "=")
        { 
          this.screenText = this.firstOperand + " " + this.operator + " " + 1/Number(this.currentNumber);
          this.currentNumber = String(1/Number(this.currentNumber));
          console.log(this.screenText);
          
        } else if(this.currentNumber === "0"){
          this.screenText = "1/(0) = undefined";
          this.currentNumber = "error";
          this.operator = "=";
          this.waitForSecondNumber = true;
        } else {
          const result = 1/Number(this.currentNumber)
          this.screenText = "1 /(" +this.currentNumber + ") = " +result ; ;
          this.currentNumber = String(result);
          this.firstOperand = result;
          this.operator = "=";
          this.waitForSecondNumber = true;
        }
      } else   
      // 数値のみ    
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
    // ２乗
    if(op === '²'){
      if(this.operator){
        //　計算途中
          if(this.operator !== "=")
          { 
            this.screenText = this.firstOperand + " " +this.operator + " " + Number(this.currentNumber)**2 ;
            this.currentNumber = String(Number(this.currentNumber)**2);
          } else {
            const result = Number(this.currentNumber)**2
            this.screenText = this.currentNumber + "² = " +result ;
            this.currentNumber = String(result);
            this.firstOperand = result;
            this.operator = "=";
            this.waitForSecondNumber = true;
          }
      } else
      // 数値のみ
          if(this.currentNumber === "0"){
            this.screenText = "0² = 0";
            this.currentNumber = "0";
            this.operator = "=";
            this.waitForSecondNumber = true;
          } else {
            const result = Number(this.currentNumber)**2
            this.screenText = this.currentNumber + "² = " +result ;
            this.currentNumber = String(result);
            this.firstOperand = result;
            this.operator = "=";
            this.waitForSecondNumber = true;
          }
      
    } else
    // ルート
    if(op === '√'){
      console.log(this.firstOperand);
      
      if(this.operator){
        // 計算途中
        if(this.operator !== "=")
        { 
          this.screenText = this.firstOperand + " " + this.operator + " " + Math.sqrt(Number(this.currentNumber));
          this.currentNumber = String(Math.sqrt(Number(this.currentNumber)));
          console.log(this.screenText);
          
        } else {
          const result = Math.sqrt(Number(this.currentNumber))
          this.screenText = "√(" +this.currentNumber + ") = " +result ; 
          this.currentNumber = String(result);
          this.firstOperand = result;
          this.operator = "=";
          this.waitForSecondNumber = true;
        }
        // 数値のみ
      } else if(this.currentNumber === "0"){
                this.screenText = "√(0) = 0";
                this.currentNumber = "0";
                this.operator = "=";
                this.waitForSecondNumber = true;
      } else {  
                const result = Math.sqrt(Number(this.currentNumber))
                this.screenText = "√(" +this.currentNumber + ") = " +result ; ;
                this.currentNumber = String(result);
                this.firstOperand = result;
                this.operator = "=";
                this.waitForSecondNumber = true;
      }
    } else 
    // オペランドチェック　数値一つ目か二つ目か
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
    // 数値二つ目なら計算
    if(this.operator){
      if(this.screenText.slice(-2,-1) == this.operator && this.operator !== op){
        // 四則演算を変更するだけ
            this.screenText = this.screenText.substring(0,this.screenText.length-2) + op + " ";
            this.operator = op;
      } else {
        // 計算します
          const result = this.doCalculation(this.operator , Number(this.currentNumber))
          this.currentNumber = String(result);
          this.firstOperand = result;
          // 結果に合わせてスクリーンに表示
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

    // 文字数制限
    const MAX_LENGTH = 13;
    if (this.currentNumber.length > MAX_LENGTH) {
      if(this.currentNumber.includes("e")){
          this.currentNumber = String(Math.round((Number(this.currentNumber.substring(0,10)))*(10**7))/(10**7)) + "e" + this.currentNumber.substring(this.currentNumber.indexOf("+"));
      } else if(this.currentNumber.includes(".")){
      
          if(this.currentNumber.indexOf(".")<=11){
              this.currentNumber = String((Math.round(Number(this.currentNumber.substring(0,14)) * (10**(12-this.currentNumber.indexOf("."))))) / (10**(12-this.currentNumber.indexOf("."))) );
          } else if(this.currentNumber.indexOf("-") == 0){
            this.currentNumber = "-" + String(Math.round(Number(this.currentNumber.substring(1,MAX_LENGTH-2))/10)/(10**(MAX_LENGTH-5))) + "e+" + String(Number(this.currentNumber.indexOf("."))-1);
          } else {
            this.currentNumber = String(Math.round(Number(this.currentNumber.substring(0,MAX_LENGTH-3))/10)/(10**(MAX_LENGTH-5))) + "e+" + String(Number(this.currentNumber.indexOf("."))-1);
          }
      } else if(this.currentNumber.indexOf("-") == 0){
        this.currentNumber = "-" + String(Math.round(Number(this.currentNumber.substring(1,MAX_LENGTH-2))/10)/(10**(MAX_LENGTH-5))) + "e+" + String(this.currentNumber.length-2);
      } else {
        this.currentNumber = String(Math.round(Number(this.currentNumber.substring(0,MAX_LENGTH-3))/10)/(10**(MAX_LENGTH-5))) + "e+" + String(this.currentNumber.length-1);
      }   
      
      console.log(this.screenText);
      
      // =がスクリーンに表示されるとき
      if(this.screenText.includes("=")){
        this.screenText = this.screenText.substring(0,this.screenText.indexOf("=")) + "= " + this.currentNumber;
      } else if(op !== '1/' && op !== '²' && op !== '√'){
        this.screenText = this.currentNumber; 
      } else {
        this.screenText = this.firstOperand + " " + this.operator + " " + this.currentNumber;
      }
      
      // 四則演算の連打
      if(op !== '1/' && op !== '²' && op !== '√'){
        if(this.operator !== "="){
          this.screenText += " " +this.operator + " ";
        }
      }
      
    }
    
    console.log(this.operator);
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
    if(this.currentNumber == "Infinity" || this.currentNumber == "NaN" || this.currentNumber == "error"){
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
      if(this.currentNumber == "Infinity" || this.currentNumber == "NaN" ||  this.screenText == "error"){
      this.currentNumber = '0';
      this.firstOperand = null;
      this.operator = '';
      this.waitForSecondNumber = false;
      this.screenText = null;
      } else
      if(this.screenText.includes("e")){
        // e+nのとき　nを-1する
        this.currentNumber = this.currentNumber.substring(0,this.currentNumber.indexOf("e")) + "e+"+ String(Number((this.currentNumber.substring(this.currentNumber.indexOf("e")+1)))-1);
        if(this.operator !== "="){
          this.screenText = this.currentNumber + this.screenText.substring(this.screenText.indexOf(this.operator)-1);
        } else{
          this.screenText = this.currentNumber;
        }
        
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
 
 