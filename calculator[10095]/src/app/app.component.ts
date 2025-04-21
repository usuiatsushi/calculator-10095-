import { CurrencyPipe } from '@angular/common';
import { Component,OnInit, signal } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { f, t } from '@angular/core/weak_ref.d-Bp6cSy-X';
import { RouterOutlet } from '@angular/router';
import { first } from 'rxjs';

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
  

  isFormDisabled = false;    // オペレーターなどを有効
  isMemoryDisabled = true;    //  MR,MC を無効
  isEqualDisabled = false;   //  = を無効

  currentNumber: string = '0';    // スクリーン
    currentNumberAbs: string = "0";  //  スクリーンの絶対値
    rounding : string = null; // 丸め処理用
    roundingA : string = null; // 丸め処理用

  decimalLength: number = 0;
    decimalLengthFirst: number = 0;
    decimalLengthSecond: number = 0;
  answer: string = "";
  answerBigint: bigint = 0n;
  answerNumber: any = 0;

  screenText:string = '';   // サブスクリーン

  firstOperand: string = null;  // ファーストオペランド
  secondOperand: string = null;   // セカンドオペランド
  secondOperandString: String = "";   // セカンドオペランド:　String

  operator: string = '';  // オペレーター
  subOperator: string = ''; //  サブオペレーター 
  operatorKeyOn: boolean = false;  // オペレーターキー　チェック
  subOperatorKeyOn: boolean = false;  // サブオペレーターキー　チェック
  equalKeyOn: boolean = false;  // イコールキー　チェック

  waitForSecondNumber: boolean = false;  //　セカンドオペランド　チェック

  memoryNumber:string = null; // メモリの値
  memoryNumberKeyOn: boolean = false; // メモリキー　チェック
  
  
  // 文字数制限
  zahlenMaxLength:number = 10;
  decimalMaxLength:number = 8;
  
  
  //メモリ機能
  
  public memoryOperation(op:string){
    
    switch (op){
        case 'M+':
          // 定義不可能　基本押せないので意味ない
        if(this.undifined(this.currentNumber) == 0){  
          this.currentNumber = "0"; this.screenText = "";
        } else {  //計算
          if(!this.memoryNumber == true){
            this.memoryNumber = "0";
          } else {
            this.memoryNumber = this.memoryNumber;
          }

          const result = this.doCalculation(this.memoryNumber,"+",this.currentNumber)
          this.memoryNumber = result;
        }
  
        if(this.equalKeyOn == true && !this.operator == false){  // x + y = z の時 次の計算に移行 + y を保存する
          const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
          if((this.secondOperand == null && !secondOpresult == false && !Number(secondOpresult) == false) || (!Number(secondOpresult) == false && !secondOpresult == false && !this.screenText == false && secondOpresult !== this.secondOperand)){
            this.secondOperandString = secondOpresult;
            this.secondOperand = secondOpresult;
          }    
          console.log(this.secondOperand,"this.secondOperand");

          this.screenText = "";
        }
        console.log(this.memoryNumber,"this.memoryNumber",this.secondOperand,"this.secondOperand")
      
        console.log(this.memoryNumber);
        this.memoryNumberKeyOn = true;  // メモリーキーチェック
        this.isMemoryDisabled = false;
        break;
      case 'M-':
          // 定義不可能　基本押せないので意味ない
        if(this.undifined(this.currentNumber) == 0){   
          this.currentNumber = "0"; 
          this.screenText = "";
        } else {    //計算
          if(!this.memoryNumber == true){
            this.memoryNumber = "0";
          } else {
            this.memoryNumber = this.memoryNumber;
          }
          const result = this.doCalculation(this.memoryNumber,"-",this.currentNumber)
          this.memoryNumber = result;
        }

        if(this.equalKeyOn == true && !this.operator == false){  // x + y = z の時 次の計算に移行 + y を保存する
          const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
          if((this.secondOperand == null && !secondOpresult == false && !Number(secondOpresult) == false) || (!Number(secondOpresult) == false && !secondOpresult == false && !this.screenText == false && secondOpresult !== this.secondOperand)){
            this.secondOperandString = secondOpresult;
            this.secondOperand = secondOpresult;
          }    
          console.log(this.secondOperand,"this.secondOperand");
          this.screenText = "";
        }

        console.log(this.memoryNumber);
        this.memoryNumberKeyOn = true;  // メモリーキーチェック
        this.isMemoryDisabled = false;

        break;
      case 'MR':
        this.currentNumber = this.memoryNumber; // 結果を表示

        // セカンドオペランドを設定
        // x + y = z の時 次の計算に移行 + y を保存する
        if(this.equalKeyOn == true && !this.operator == false){  
          const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
          if((this.secondOperand == null && !secondOpresult == false && !Number(secondOpresult) == false) || (!Number(secondOpresult) == false && !secondOpresult == false && !this.screenText == false && secondOpresult !== this.secondOperand)){
            this.secondOperandString = secondOpresult;
            this.secondOperand = secondOpresult;
          }    
          console.log(this.secondOperand,"this.secondOperand");
        this.screenText = "";
        } else
        //  x + y^2 の時　y で上書き
        if(this.subOperatorKeyOn == true && !this.operator == false && this.screenText.indexOf(" " + this.operator+ " ") !== -1){  
          this.screenText = this.screenText.substring(0,this.screenText.indexOf(" " + this.operator+ " ")+2);
        }

        
        // Infinity をオーバーフローに
        if(this.currentNumber == 'Infinity'){
          this.currentNumber = '値が大きすぎます';
          this.isFormDisabled = true;
          this.isMemoryDisabled = true;
        }

        // 絶対値を取得
        if(Math.sign(Number(this.currentNumber)) == -1){
          this.currentNumberAbs = this.currentNumber.slice(1);
        } else{
          this.currentNumberAbs = this.currentNumber;
        }
        
        console.log(this.currentNumberAbs,"this.currentNumberAbs");
        
        // ~ e- の時 小数に直す
        if(this.currentNumberAbs.includes("e-")){
          const alpha = Number( this.currentNumberAbs.slice(this.currentNumberAbs.indexOf('e-') +2));
          let beta = null;
          if(this.currentNumberAbs.includes(".")){
            beta = this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf('.')) + this.currentNumberAbs.slice(this.currentNumberAbs.indexOf('.') +1,this.currentNumberAbs.indexOf('e-'))
          } else {
            beta = this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf('e-'))
          }
          this.currentNumberAbs = "0." + "0".repeat(alpha) + beta;
          console.log(this.currentNumberAbs,"syousu");
          
        } 
        // 定義不可能でない
        if(this.undifined(this.currentNumber) == 0){
        } else
        // ~ e+ の時
        if(this.currentNumberAbs.includes("e+")){
          this.currentNumber = '値が大きすぎます';
          this.isFormDisabled = true;
          this.isMemoryDisabled = true;
        } else
        // 整数のみ
        if(this.currentNumberAbs.includes(".") == false){
          
          // zahlenMaxLength 桁以上なら e+
          if(this.currentNumberAbs.length > this.zahlenMaxLength){
            this.currentNumber = '値が大きすぎます';
            this.isFormDisabled = true;
            this.isMemoryDisabled = true;
          }
        } else
        // 小数点あり
        if(this.currentNumberAbs.includes(".")){
          
          console.log(this.currentNumberAbs.indexOf(".")," .");

          // 小数点抜き出し
          const a = this.currentNumberAbs.slice(this.currentNumberAbs.indexOf(".") + 1)
          //  整数抜き出し
          const z = this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf("."))

          // zahlenMaxLength 桁以上なら e+
          if(z.length > this.zahlenMaxLength){
            this.currentNumber = '値が大きすぎます';
            this.isFormDisabled = true;
            this.isMemoryDisabled = true;
          } else
          // 小数点がdecimalMaxLength 桁以上
          if(a.length > this.decimalMaxLength){
            const b = a.slice(this.decimalMaxLength - 1,this.decimalMaxLength + 1);
            const c = Math.round(Number(b)/10);
            console.log(a.slice(0,this.decimalMaxLength - 1),a,b,c);
            if(c == 10){
              const d = this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf(".") + 1) + a.slice(0,this.decimalMaxLength - 1) + "9";
              this.currentNumberAbs = this.doCalculation(d,"+","0." + "0".repeat(this.decimalMaxLength-1) + "1" );
              console.log(d,"d");
            } else {
              this.currentNumberAbs = this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf(".") + 1) + a.slice(0,this.decimalMaxLength - 1) + c;
            }
          }
        }

        // 0.00000000 はエラー
        if(this.currentNumberAbs == "0.00000000"){
          this.currentNumber = '値が小さすぎます';
          this.isFormDisabled = true;
          this.isMemoryDisabled = true;
        }

        // 小数点　4.00000000 を　4 に
        this.currentNumberAbs = this.currentNumberAbs.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');

        
        if(this.currentNumber == '値が大きすぎます' || this.currentNumber == '値が小さすぎます' ){
          this.memoryNumber = null;
          this.isMemoryDisabled = true;
        } else      
        if(Math.sign(Number(this.currentNumber)) == -1){  // 負の数        
          this.currentNumber =  "-" +  this.currentNumberAbs;  
        } else { this.currentNumber = this.currentNumberAbs;}   // 正の数
        
            

        // フラグオフ
        this.waitForSecondNumber = false;
        this.memoryNumberKeyOn = true;  // メモリーキーチェック
        this.subOperatorKeyOn = false;
        break;
        
      case 'MC':
          // x + y = z の時 次の計算に移行 + y を保存する
        if(this.equalKeyOn == true && !this.operator == false){  
          const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
          if((this.secondOperand == null && !secondOpresult == false && !Number(secondOpresult) == false) || (!Number(secondOpresult) == false && !secondOpresult == false && !this.screenText == false && secondOpresult !== this.secondOperand)){
            this.secondOperandString = secondOpresult;
            this.secondOperand = secondOpresult;
          }    
          console.log(this.secondOperand,"this.secondOperand");
          this.screenText = "";
        }
        this.memoryNumber = null;   //メモリークリア
        this.isMemoryDisabled = true;   // MR,MC をDisable
        break;
    }
    

  }

  //　数字入力
  public getNumber(v: string){
    //　フラグチェック
    console.log(this.waitForSecondNumber,"waitForSecondNumber");
    console.log(this.memoryNumberKeyOn,"this.memoryNumberKeyOn");

    if(this.undifined(this.currentNumber) == 0){    // 定義不可能
      this.currentNumber = v; 
      this.screenText = "",
      this.waitForSecondNumber = false;
      this.firstOperand = null; 
      this.secondOperand = null; 
      this.operator = null;
    } else
    if(this.screenText?.includes("=")){     // x + y = z の時 次の計算に移行
      this.currentNumber = v;
      this.screenText = "";
      this.firstOperand = null;
      // this.secondOperand = null;
      this.waitForSecondNumber = false;
    } else
    if(this.subOperatorKeyOn == true && !this.operator == false && this.screenText.indexOf(" " + this.operator+ " ") !== -1){  //  x + y^2 の時　y で上書き
      this.currentNumber = v;
      this.screenText = this.screenText.substring(0,this.screenText.indexOf(" " + this.operator+ " ")+2);
    } else  // x + negate(x) のとき
    if(!this.operator == false && this.screenText.includes("negate") && this.screenText.indexOf(" " + this.operator+ " ") !== -1){
      this.currentNumber = v;
      this.screenText = this.screenText.substring(0,this.screenText.indexOf(" " + this.operator+ " ")+2);
    } else
    if((this.subOperatorKeyOn == true && !this.operator == true) || (this.subOperatorKeyOn == true && !this.operator == false && this.screenText?.includes(this.operator) == false)){  //  x^2 の時　x で上書き
      this.currentNumber = v;
      this.firstOperand = null;
      this.waitForSecondNumber = false;
    } else 
    if(this.waitForSecondNumber){      // waitForSecondNumberフラグチェック trueの時
      this.currentNumber = v;
      this.waitForSecondNumber = false;
      this.secondOperand = null;
    } else
    if(this.memoryNumberKeyOn == true){   // メモリーキーチェック　おそらくMRでスクリーン上に表示する設定にしているから必要
      this.currentNumber = v;
      this.memoryNumberKeyOn = false;
      this.waitForSecondNumber = false;
    } else
    if(this.currentNumber == '0'){    // スクリーン下が0のとき
      this.currentNumber = v;
    } else {    //　通常時は数字を追加
      this.currentNumber += v;
    }
    // "00"を0に
    if(Number(this.currentNumber) == 0 && this.currentNumber?.includes(".") == false){
      this.currentNumber = "0";
    }

    console.log(this.firstOperand,"this.firstOperand",this.secondOperand,"this.secondOperand");
    
    //　フラグオフ
    if(!this.memoryNumber == false){this.isMemoryDisabled = false; }
    this.isFormDisabled = false;
    this.memoryNumberKeyOn = false;
    this.operatorKeyOn = false;
    this.subOperatorKeyOn = false;
    this.equalKeyOn = false;

    //10億の桁まで計算できること  小数点は最大8位まで表示できること 

    // 絶対値を取得
    if(Math.sign(Number(this.currentNumber)) == -1){
      this.currentNumberAbs = this.currentNumber.slice(1);
    }
      this.currentNumberAbs = this.currentNumber;

    console.log(this.currentNumberAbs,"currentNumberAbs");
    
    // 整数のみ
    if(this.currentNumberAbs.includes(".") == false){
      // zahlenMaxLength 桁以上なら入力無効
      if(this.currentNumberAbs.length > this.zahlenMaxLength){
        this.currentNumberAbs = this.currentNumberAbs.slice(0,this.zahlenMaxLength);
      } 
    } else
    // 小数点含む
    if(this.currentNumberAbs.includes(".") == true){      
      // 小数点以下がdecimalMaxLengt 桁以上なら入力無効
      if(this.currentNumberAbs.length - this.currentNumberAbs.indexOf(".") - 1 > this.decimalMaxLength){
        this.currentNumberAbs = this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf(".")+1+this.decimalMaxLength);
      }
    }

    // 符号を戻す
    if(Math.sign(Number(this.currentNumber)) == -1){
      this.currentNumber = "-" + this.currentNumberAbs;
    }
      this.currentNumber = this.currentNumberAbs ;

  }

  getPositiveNegative(){

    // 定義不可能 基本押せないので意味ない
    if(this.undifined(this.currentNumber) == 0){  
      this.currentNumber = "0"; 
      this.screenText = ""; 
      this.firstOperand = null; 
      this.secondOperand = null; 
      this.operator = null;
    }
      
      const A = this.currentNumber

      if(this.currentNumber == "0"){  // 数値が0の時
      } else
      if(Math.sign(Number(this.currentNumber)) == -1){  // 負の数
        this.currentNumber = this.currentNumber.slice(1);
      } else {  // 正の数
      this.currentNumber = "-" + this.currentNumber;
      }  

      if(!this.screenText == true){  //サブスクリーンなし
      } else
      if(this.screenText?.slice(-1) == "="){ // x + y = z の時
        this.screenText = "negate(" + A + ")";
      } else
      if(this.screenText?.slice(-1) == this.operator && this.operatorKeyOn){ // x + の次に押したとき
        this.screenText = this.screenText + " negate(" + A + ")";
        this.secondOperand = null;
      } else
      if(this.subOperatorKeyOn == true && !this.operator == false && this.screenText.indexOf(" " + this.operator+ " ") !== -1){  // x + √(y) の時
        this.screenText = this.screenText.slice(0,this.screenText.indexOf(" " + this.operator + " " ) + 3) + "negate(" + this.screenText.slice(this.screenText.indexOf(" " + this.operator + " " ) + 3) + ")";
      } else // negate(x) + y の時
      if(this.screenText?.includes("negate") && this.screenText?.slice(-1) == this.operator){
      } else // negate(x) の時
      if(this.screenText?.includes("negate")){ 
        this.screenText = this.screenText?.slice(0,this.screenText.indexOf("negate")) + "negate(" + this.screenText?.slice(this.screenText.indexOf("negate")) + ")";
      } else // x^2 のとき
      if(this.subOperatorKeyOn == true && this.operatorKeyOn == false){   
        this.screenText = "negate(" + this.screenText + ")";
      }

      // 丸め処理があるとき
      if(!this.rounding == false){  
        if(this.rounding.includes("-") == true){
          this.rounding = this.rounding.slice(1);
        } else {  
        this.rounding = "-" + this.rounding
        }
      }

      //　フラグオフ
    this.memoryNumberKeyOn = false;
  }

  getDecimal(){

    //　定義不可能
    if(this.undifined(this.currentNumber) == 0){  
      this.screenText = "",
      this.waitForSecondNumber = false;
      this.secondOperand = null;
      this.operator = null;
      this.currentNumber = "0";
      this.firstOperand = null;
    }

    if(Math.sign(Number(this.currentNumber)) == -1){
      this.currentNumberAbs = this.currentNumber.slice(1);
    } else{
      this.currentNumberAbs = this.currentNumber;
    }

    // ~ + の時
    if(this.operatorKeyOn == true && this.screenText.slice(-1) == this.operator){
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
        this.currentNumber = "0.";
        this.screenText = "";
    } else
    // 入力値に . を含まないとき　(デフォルト)
    if(!this.currentNumber.includes('.')){
        this.currentNumber += '.'; 
    } 

     //　フラグをオフ
    this.memoryNumberKeyOn = false;
    this.waitForSecondNumber = false;
    this.operatorKeyOn = false;
    this.equalKeyOn = false;
    this.subOperatorKeyOn = false;
  }

  /*
  public countermeasure (secondOp: string){
    // 浮動小数点対策
    if(this.firstOperand.includes(".") == true && secondOp.includes(".") == true){
      this.decimalLengthFirst = this.firstOperand.length - this.firstOperand.indexOf(".") -1 ;
      this.decimalLengthSecond = secondOp.length - secondOp.indexOf(".") -1 ;
      if(this.decimalLengthFirst >= this.decimalLengthSecond){this.decimalLength = this.decimalLengthFirst} else {this.decimalLength = this.decimalLengthSecond}
      this.firstOperand = this.firstOperand.slice(0,this.firstOperand.indexOf(".")) + this.firstOperand.slice(this.firstOperand.indexOf(".") + 1) + "0".repeat(this.decimalLength - this.decimalLengthFirst);
      secondOp = secondOp.slice(0,secondOp.indexOf(".")) + secondOp.slice(secondOp.indexOf(".") + 1) + "0".repeat(this.decimalLength - this.decimalLengthSecond);
    } else
    if(this.firstOperand.includes(".") == true){
      this.decimalLength = this.firstOperand.length - this.firstOperand.indexOf(".") -1 ;
      this.firstOperand = this.firstOperand.slice(0,this.firstOperand.indexOf(".")) + this.firstOperand.slice(this.firstOperand.indexOf(".") + 1);
      secondOp = secondOp + "0".repeat(this.decimalLength);
    } else
    if(secondOp.includes(".") == true){
      this.decimalLength = secondOp.length - secondOp.indexOf(".") -1 ;
      secondOp = secondOp.slice(0,secondOp.indexOf(".")) + secondOp.slice(secondOp.indexOf(".") + 1);
      this.firstOperand = this.firstOperand + "0".repeat(this.decimalLength);
    }
  }
  */


  public doCalculation(firstOp: string ,op: string , secondOp: string){

    console.log("xx",firstOp,secondOp);
    
    // 計算機能　リターンで計算結果を返す
    switch (op){
      case '+':
        // 0.00000000 対策
        if("-" + firstOp == secondOp || firstOp == "-" + secondOp){firstOp = "1" , secondOp = "-1"}
        // 浮動小数点対策
        if(firstOp.includes(".") == true && secondOp.includes(".") == true){
          this.decimalLengthFirst = firstOp.length - firstOp.indexOf(".") -1 ;
          this.decimalLengthSecond = secondOp.length - secondOp.indexOf(".") -1 ;
          if(this.decimalLengthFirst >= this.decimalLengthSecond){this.decimalLength = this.decimalLengthFirst} else {this.decimalLength = this.decimalLengthSecond}
          firstOp = firstOp.slice(0,firstOp.indexOf(".")) + firstOp.slice(firstOp.indexOf(".") + 1) + "0".repeat(this.decimalLength - this.decimalLengthFirst);
          secondOp = secondOp.slice(0,secondOp.indexOf(".")) + secondOp.slice(secondOp.indexOf(".") + 1) + "0".repeat(this.decimalLength - this.decimalLengthSecond);
        } else
        if(firstOp.includes(".") == true){
          this.decimalLength = firstOp.length - firstOp.indexOf(".") -1 ;
          firstOp = firstOp.slice(0,firstOp.indexOf(".")) + firstOp.slice(firstOp.indexOf(".") + 1);
          secondOp = secondOp + "0".repeat(this.decimalLength);
        } else
        if(secondOp.includes(".") == true){
          this.decimalLength = secondOp.length - secondOp.indexOf(".") -1 ;
          secondOp = secondOp.slice(0,secondOp.indexOf(".")) + secondOp.slice(secondOp.indexOf(".") + 1);
          firstOp = firstOp + "0".repeat(this.decimalLength);
        }

        this.answerBigint = BigInt(firstOp) + BigInt(secondOp);

      break;
      case '-': 
        // 0.00000000 対策
        if(firstOp == secondOp){firstOp = "1" , secondOp = "1"}
        // 浮動小数点対策
        if(firstOp.includes(".") == true && secondOp.includes(".") == true){
          this.decimalLengthFirst = firstOp.length - firstOp.indexOf(".") -1 ;
          this.decimalLengthSecond = secondOp.length - secondOp.indexOf(".") -1 ;
          if(this.decimalLengthFirst >= this.decimalLengthSecond){this.decimalLength = this.decimalLengthFirst} else {this.decimalLength = this.decimalLengthSecond}
          firstOp = firstOp.slice(0,firstOp.indexOf(".")) + firstOp.slice(firstOp.indexOf(".") + 1) + "0".repeat(this.decimalLength - this.decimalLengthFirst);
          secondOp = secondOp.slice(0,secondOp.indexOf(".")) + secondOp.slice(secondOp.indexOf(".") + 1) + "0".repeat(this.decimalLength - this.decimalLengthSecond);
        } else
        if(firstOp.includes(".") == true){
          this.decimalLength = firstOp.length - firstOp.indexOf(".") -1 ;
          firstOp = firstOp.slice(0,firstOp.indexOf(".")) + firstOp.slice(firstOp.indexOf(".") + 1);
          secondOp = secondOp + "0".repeat(this.decimalLength);
        } else
        if(secondOp.includes(".") == true){
          this.decimalLength = secondOp.length - secondOp.indexOf(".") -1 ;
          secondOp = secondOp.slice(0,secondOp.indexOf(".")) + secondOp.slice(secondOp.indexOf(".") + 1);
          firstOp = firstOp + "0".repeat(this.decimalLength);
        }

        this.answerBigint = BigInt(firstOp) - BigInt(secondOp);

      break;
      case '×':
        // 0.00000000 対策
        if(firstOp == "0" || secondOp == "0"){ firstOp = "0"; secondOp = "0"}
        // 浮動小数点対策
        if(firstOp.includes(".") == true && secondOp.includes(".") == true){
          this.decimalLengthFirst = firstOp.length - firstOp.indexOf(".") -1 ;
          this.decimalLengthSecond = secondOp.length - secondOp.indexOf(".") -1 ;
          this.decimalLength = this.decimalLengthFirst + this.decimalLengthSecond;
          firstOp = firstOp.slice(0,firstOp.indexOf(".")) + firstOp.slice(firstOp.indexOf(".") + 1);
          secondOp = secondOp.slice(0,secondOp.indexOf(".")) + secondOp.slice(secondOp.indexOf(".") + 1);
        } else
        if(firstOp.includes(".") == true){
          this.decimalLength = firstOp.length - firstOp.indexOf(".") -1 ;
          firstOp = firstOp.slice(0,firstOp.indexOf(".")) + firstOp.slice(firstOp.indexOf(".") + 1);
        } else
        if(secondOp.includes(".") == true){
          this.decimalLength = secondOp.length - secondOp.indexOf(".") -1 ;
          secondOp = secondOp.slice(0,secondOp.indexOf(".")) + secondOp.slice(secondOp.indexOf(".") + 1);
        }
        console.log(this.decimalLength);
        
        this.answerBigint = BigInt(firstOp) * BigInt(secondOp); 
      break;

      case '÷': 
        
        // 浮動小数点対策
        let firstOpLength = firstOp.length;
        let rep = 28-firstOpLength;
        if(rep < 0){ rep = 0 }
        // 0.00000000 対策
        if(firstOp == "0"){ 
          secondOp = "1"
        } else
        if(firstOp.includes(".") == true && secondOp.includes(".") == true){
          this.decimalLengthFirst = firstOp.length - firstOp.indexOf(".") -1 ;
          this.decimalLengthSecond = secondOp.length - secondOp.indexOf(".") -1 ;
          this.decimalLength = this.decimalLengthFirst - this.decimalLengthSecond;
          firstOp = firstOp.slice(0,firstOp.indexOf(".")) + firstOp.slice(firstOp.indexOf(".") + 1) + "0".repeat(rep);
          secondOp = secondOp.slice(0,secondOp.indexOf(".")) + secondOp.slice(secondOp.indexOf(".") + 1);
        } else
        if(firstOp.includes(".") == true){
          this.decimalLength = firstOp.length - firstOp.indexOf(".") -1 ;
          firstOp = firstOp.slice(0,firstOp.indexOf(".")) + firstOp.slice(firstOp.indexOf(".") + 1) + "0".repeat(rep);          
        } else
        if(secondOp.includes(".") == true){
          this.decimalLength = - secondOp.length + secondOp.indexOf(".") +1 ;
          secondOp = secondOp.slice(0,secondOp.indexOf(".")) + secondOp.slice(secondOp.indexOf(".") + 1);
          firstOp = firstOp + "0".repeat(rep);
        } else {
          this.decimalLength = 0;
          firstOp = firstOp + "0".repeat(rep);
        }

        this.decimalLength = this.decimalLength + (rep);
        console.log("rr",firstOp,secondOp,this.decimalLength,(rep));

        // 0.00000000 対策
        if(firstOp == "0"){ 
          this.answerBigint = 0n;
          this.decimalLength = 0;
        } else {
          this.answerBigint = BigInt(firstOp) / BigInt(secondOp); 
        }
        
      break;
      case '=':
      break;
      case '√':
        return String( Math.round(Number(secondOp)) );
      break;
      case '²':
        // 浮動小数点対策
        if(secondOp.includes(".") == true){
          this.decimalLength = secondOp.length - secondOp.indexOf(".") -1 ;
          secondOp = secondOp.slice(0,secondOp.indexOf(".")) + secondOp.slice(secondOp.indexOf(".") + 1)
        }
        this.decimalLength = this.decimalLength * 2 ;

        this.answerBigint = BigInt(secondOp) ** 2n;
      break;
      case '1/':
        let repo = 28;
         if(secondOp.includes(".") == true){
           this.decimalLength = - secondOp.length + secondOp.indexOf(".") +1 ;
           secondOp = secondOp.slice(0,secondOp.indexOf(".")) + secondOp.slice(secondOp.indexOf(".") + 1);
           firstOp = "1" + "0".repeat(repo); 
         } else {
           this.decimalLength = 0;
           firstOp = "1" + "0".repeat(repo); 
         }
 
         this.decimalLength = this.decimalLength + (repo);
         console.log("rr",firstOp,secondOp,this.decimalLength,repo);
 
        this.answerBigint = BigInt(firstOp) / BigInt(secondOp); 

      break;
    }
    
    console.log("aaa",this.answerBigint,String(this.answerBigint).length,this.decimalLength);
    
    

    if(this.decimalLength !== 0){
      let signS = null;
      let answerBigintString = String(this.answerBigint);

      if(answerBigintString.slice(0,1) == "-"){
        // 負の数
        answerBigintString = answerBigintString.slice(1); signS = "-";
      } else {  
        // 正の数
        signS = "";
      }
      
      // 文字列で答えを生成
      if (answerBigintString.length < this.decimalLength) {
        // 小数点以下の桁数を補う
        const paddedAnswer = "0." + "0".repeat(this.decimalLength - answerBigintString.length) + answerBigintString;
        this.answer = signS + paddedAnswer;
        console.log("kkk", paddedAnswer);
      } else if (answerBigintString.length === this.decimalLength) {
        // 小数点以下の桁数が一致
        const exactAnswer = "0." + answerBigintString;
        this.answer = signS + exactAnswer;
        console.log("ddd", answerBigintString);
      } else {
        // 整数部と小数部に分割
        const integerPart = answerBigintString.slice(0, -this.decimalLength);
        const decimalPart = answerBigintString.slice(-this.decimalLength);
        const formattedDecimal = String("0." + decimalPart).slice(2); // 先頭の "0." を削除
        this.answer = signS + integerPart + "." + formattedDecimal;
        console.log("lll", integerPart, "0." + decimalPart);
      }
      /*
      // 文字列で答えを生成
      if( answerBigintString.length < this.decimalLength){
        this.answer = signS + String ( ( "0." + "0".repeat(this.decimalLength-answerBigintString.length) + answerBigintString ) );
        console.log("kkk",String ( ( "0." + "0".repeat(this.decimalLength-answerBigintString.length) + answerBigintString )) );
        
      } else
      if( answerBigintString.length == this.decimalLength){
        this.answer = signS + String ( ( "0." + answerBigintString ) ) ;
        console.log("ddd",answerBigintString);
        
      } else { 
        this.answer = signS + answerBigintString.slice(0,(-1*this.decimalLength)) + "." + String(  ("0." + answerBigintString.slice(-1*this.decimalLength,18) ) ).slice(2) ;
        console.log("lll",answerBigintString.slice(0,(-1*this.decimalLength)), "0." + answerBigintString.slice(-1*this.decimalLength,this.decimalMaxLength+4));   
      }
      */

      // 引き継がないように消去
      this.decimalLength = 0;
    } else {
      // 小数点なければそのまま
      this.answer = String(this.answerBigint);
    }

    // 10. を　10 に修正
    if(this.answer.slice(-1) == "."){
      this.answer = this.answer.slice(0,-1)
    }

    console.log(this.answer,"this.answer",this.firstOperand,"this.firstOperand");
    
    return this.answer;
    
  }

  public getOperation(op: string){
    
    // .で数値が終わる場合　.削除
    if(this.currentNumber.slice(-1) == "." ){
        this.currentNumber = this.currentNumber.slice(0,-1);
    }
    if(this.currentNumber.slice(-1) == "." ){
      this.currentNumber = this.currentNumber.slice(0,-1);
    }

    /*
    // 0.00000 は 0 に変更  下記により省略可
    if(Number(this.currentNumber) == 0){
      this.currentNumber = "0";
    }
    if(Number(this.currentNumber) == 0){
      this.currentNumber = "0";
    }
    */

    // 小数点　4.00000000 を　4 に  
    this.currentNumber = this.currentNumber.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
    if(!this.firstOperand == false){
      this.firstOperand = this.firstOperand.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
    }
    if(!this.secondOperand == false){
      this.secondOperand = this.secondOperand.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
    }

     console.log(this.firstOperand,"this.firstOperand",this.secondOperand,"this.secondOperand",this.subOperatorKeyOn,"this.subOperatorKeyOn",this.equalKeyOn, "this.equalKeyOn",this.operatorKeyOn,"operatorKeyOn",this.operator,"operator",op,"op");
    
    // 定義不可能 基本は押せないので必要なし
    if(this.undifined(this.currentNumber) == 0){ 
      this.currentNumber = "0";
      this.firstOperand = null;
      this.secondOperand = null;
      this.operator = null;
      this.screenText = ""; 
      this.isFormDisabled = false;
      if(!this.memoryNumber == false){this.isMemoryDisabled = false; }

    } else // 0で割ることはできません
    if(this.operator == "÷" && op == '=' && this.currentNumber == "0"){
          this.screenText = "";
          this.currentNumber = '0で割ることはできません'; // font-size 変えた
          this.isFormDisabled = true;
          this.isMemoryDisabled = true;

          
    } else
    // サブオペレーター
    if(op === '1/'){  // x分の１ボタン
      if(this.currentNumber == "0"){
          this.currentNumber = '0で割ることはできません'; // font-size 変えたい
          this.screenText = '1/(0)';
            /*
            if(this.screenText == null || !this.operator == true){
              this.screenText = '1/(0)';
            } else {
              this.screenText += '1/(0)';
            }
            */
          this.isFormDisabled = true;
          this.isMemoryDisabled = true; 
      } else  // x + y = z の時
      if(this.equalKeyOn){
        const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
        if((this.secondOperand == null && !secondOpresult == false && !Number(secondOpresult) == false) || (!Number(secondOpresult) == false && !secondOpresult == false && !this.screenText == false && secondOpresult !== this.secondOperand)){
          this.secondOperandString = secondOpresult;
          this.secondOperand = secondOpresult;
        }    
        console.log(this.secondOperand,"this.secondOperand");
          const result = this.doCalculation(this.firstOperand,'1/',this.currentNumber);
          this.screenText = "1/(" +this.currentNumber + ")" ;
          this.currentNumber = String(result);
          this.firstOperand = null;
      } else // x + , x + y + のとき
      if(this.operatorKeyOn == true && this.screenText?.slice(-1) == this.operator){
        const result = this.doCalculation(this.firstOperand,'1/',this.currentNumber);
          this.screenText += " 1/(" +this.currentNumber + ")" ;
          this.currentNumber = String(result);
          this.secondOperand = null;
      } else // x + -y のとき
        if(this.operatorKeyOn == true && this.screenText.includes("negate")){
          const result = this.doCalculation(this.firstOperand,'1/',this.currentNumber);
          this.screenText = this.screenText.slice(0,this.screenText.indexOf(" " + this.operator+ " ")) +" " +this.operator + " " + "1/(" + this.currentNumber + ")" ;
          this.currentNumber = result;
          this.secondOperand = null;
      } else // x + y^2 のとき
      if(!this.operator == false && this.subOperatorKeyOn == true && this.screenText.indexOf(" " + this.operator+ " ") !== -1){
        this.screenText = this.screenText.slice(0,this.screenText.indexOf(" " + this.operator+ " ")) +" " +this.operator + " " + "1/(" + this.currentNumber + ")" ;
        if(!this.rounding == false){
          console.log("rounding now");
          const result = this.doCalculation(this.firstOperand,'1/',this.rounding);
          this.currentNumber = String(result);
          this.rounding = null;
        } else {
          const result = this.doCalculation(this.firstOperand,'1/',this.currentNumber);
          this.currentNumber = String(result);
        }
      } else  // 1/x 1/x 1/x 1/x 
      if(this.screenText?.indexOf(" " + this.operator+ " ") == -1 && this.subOperatorKeyOn == true){
        this.screenText = "1/(" + this.currentNumber + ")" ;
        if(!this.rounding == false){
          console.log("rounding now");
          const result = this.doCalculation(this.firstOperand,'1/',this.rounding);
          this.currentNumber = String(result);
          this.firstOperand = String(result);
          this.rounding = null;
        } else {
          const result = this.doCalculation(this.firstOperand,'1/',this.currentNumber);
          this.currentNumber = String(result);
          this.firstOperand = String(result);
        }
      } else  //   +-×÷　の後
      if(this.screenText?.slice(-1) == this.operator){
        this.screenText = this.screenText + " " + "1/(" +this.currentNumber + ")" ;
        const result = this.doCalculation(this.firstOperand,'1/',this.currentNumber);
          this.currentNumber = String(result);
      } else  {  // 数値のみ 
        const result = this.doCalculation(this.firstOperand,'1/',this.currentNumber);
        this.screenText = "1/(" +this.currentNumber + ")" ;
        this.currentNumber = String(result);
        this.firstOperand = String(result);
      }
      this.subOperator = op;
      this.waitForSecondNumber = true;
      this.subOperatorKeyOn = true;
      this.operatorKeyOn = false;
      this.equalKeyOn = false;
    } else
    // ２乗
    if(op === '²'){
      // x + y = z の時
      if(this.equalKeyOn){
        const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
        if((this.secondOperand == null && !secondOpresult == false && !Number(secondOpresult) == false) || (!Number(secondOpresult) == false && !secondOpresult == false && !this.screenText == false && secondOpresult !== this.secondOperand)){
          this.secondOperandString = secondOpresult;
          this.secondOperand = secondOpresult;
        }    
        console.log(this.secondOperand,"this.secondOperand");
        const result = this.doCalculation(this.firstOperand,'²',this.currentNumber)
        this.screenText = "(" + this.currentNumber + ")" + "²" ;
        this.currentNumber = result;
        this.firstOperand = null;
      } else // x + , x + y + のとき
      if(this.operatorKeyOn == true && this.screenText?.slice(-1) == this.operator){
        const result = this.doCalculation(this.firstOperand,'²',this.currentNumber)
        this.screenText += " (" + this.currentNumber + ")" + "²" ;
        this.currentNumber = result;
        this.secondOperand = null;
      } else // x + -y のとき
      if(this.operatorKeyOn == true && this.screenText.includes("negate")){
        const result = this.doCalculation(this.firstOperand,'²',this.currentNumber)
        this.screenText = this.screenText?.slice(0,this.screenText?.indexOf(" " + this.operator+ " ")) + " " + this.operator + " " + "(" + this.currentNumber + ")" + "²";
        this.currentNumber = result;
        this.secondOperand = null;
      } else // x + y^2 のとき
      if(!this.operator == false && this.subOperatorKeyOn == true && this.screenText?.indexOf(" " + this.operator+ " ") !== -1){
          this.screenText = this.screenText?.slice(0,this.screenText?.indexOf(" " + this.operator+ " ")) +" " +this.operator + " (" + this.currentNumber + ")" + "²";
          if(!this.rounding == false){
            console.log("rounding now");
            const result = this.doCalculation(this.firstOperand,'²',this.rounding);
            this.currentNumber = String(result);
            this.rounding = null;
          } else {
            const result = this.doCalculation(this.firstOperand,'²',this.currentNumber);
            this.currentNumber = result;
          }
           
      } else // x^2 ^2 ^2
      if(this.screenText?.indexOf(" " + this.operator+ " ") == -1 && this.subOperatorKeyOn == true){
        this.screenText = "(" + this.currentNumber + ")" + "²";
          if(!this.rounding == false){
            console.log("rounding now");
            const result = this.doCalculation(this.firstOperand,'²',this.rounding);
            this.currentNumber = String(result);
            this.firstOperand = String(result);
            this.rounding = null;
          } else {
            const result = this.doCalculation(this.firstOperand,'²',this.currentNumber);
            this.currentNumber = String(result);
            this.firstOperand = String(result);
         }
      } else //   +-×÷　の後
      if(this.screenText?.slice(-1) == this.operator){
          this.screenText = this.screenText + " " + "(" + this.currentNumber + ")" + "²";
          const result = this.doCalculation(this.firstOperand,'²',this.currentNumber);
          this.currentNumber = result;
      } else {  // 数値のみ
          const result = this.doCalculation(this.firstOperand,'²',this.currentNumber);
          this.screenText = "(" + this.currentNumber + ")" + "²" ;
          this.currentNumber = String(result);
          this.firstOperand = String(result); 
      }
      this.subOperator = op;
      this.waitForSecondNumber = true;
      this.subOperatorKeyOn = true;
      this.operatorKeyOn = false;
      this.equalKeyOn = false;
    } else
   
    if(op === '√'){       // ルート
      if(Math.sign(Number(this.currentNumber)) == -1){ // 負の数を√　（虚数）
          /*
          if(this.screenText == null){
            this.screenText = '√(' + this.currentNumber + ')';
          } else 
          if(this.screenText.includes("negate")){
            this.screenText = '√(' + this.currentNumber + ')';
          } else {
            this.screenText += ' √(' + this.currentNumber + ')';
          }
            */
          this.screenText = ' √(' + this.currentNumber + ')';
            this.currentNumber = '無効な入力です'; // font-size 変えたい
            this.isFormDisabled = true;
            this.isMemoryDisabled = true;   
      } else  // ＝の後
      if(this.equalKeyOn == true){    
        const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
        if((this.secondOperand == null && !secondOpresult == false && !Number(secondOpresult) == false) || (!Number(secondOpresult) == false && !secondOpresult == false && !this.screenText == false && secondOpresult !== this.secondOperand)){
            this.secondOperandString = secondOpresult;
            this.secondOperand = secondOpresult;
          }    
          console.log(this.secondOperand,"this.secondOperand");
          const result = Math.sqrt(Number(this.currentNumber))
          this.screenText = "√(" +this.currentNumber + ")" ; 
          this.currentNumber = String(result);
          this.firstOperand = null;
      } else // x + , x + y + のとき
      if(this.operatorKeyOn == true && this.screenText?.slice(-1) == this.operator){
          const result = Math.sqrt(Number(this.currentNumber))
          this.screenText += " √(" +this.currentNumber + ")" ; 
          this.currentNumber = String(result);
          this.secondOperand = null;
      } else // x + -y のとき
        if(this.operatorKeyOn == true && this.screenText.includes("negate")){
          const result = Math.sqrt(Number(this.currentNumber));
          this.screenText = this.screenText.slice(0,this.screenText.indexOf(" " + this.operator+ " ")) +" " + this.operator + " " + "√(" + this.currentNumber + ")";
          this.currentNumber = String(result);
          this.secondOperand = null;
      } else  // x + y^2 のとき
      if(!this.operator == false && this.subOperatorKeyOn == true && this.screenText.indexOf(" " + this.operator+ " ") !== -1){
        this.screenText = this.screenText.slice(0,this.screenText.indexOf(" " + this.operator+ " ")) +" " + this.operator + " " + "√(" + this.currentNumber + ")";
        if(!this.rounding == false){
          console.log("rounding now");
          const result = Math.sqrt(Number(this.rounding));
          this.currentNumber = String(result);
          this.rounding = null;
        } else {
          this.currentNumber = String(Math.sqrt(Number(this.currentNumber))); 
        }
      } else  // x^2 の時
      if(this.screenText?.indexOf(" " + this.operator+ " ") == -1 && this.subOperatorKeyOn == true){
        this.screenText = "√(" + this.currentNumber + ")" ;
        if(!this.rounding == false){
          console.log("rounding now");
          const result = Math.sqrt(Number(this.rounding));
          this.currentNumber = String(result);
          this.firstOperand = String(result);
          this.rounding = null;
        } else {
        const result = Math.sqrt(Number(this.currentNumber));
        this.currentNumber = String(result);
        this.firstOperand = String(result);
        }
      } else  //   +-×÷　の後
      if(this.screenText?.slice(-1) == this.operator){     
          this.screenText += " " + "√(" +this.currentNumber + ")";
          this.currentNumber = String(Math.sqrt(Number(this.currentNumber)));
      
      } else {    // 数値のみ
        const result = Math.sqrt(Number(this.currentNumber));
        this.screenText = "√(" +this.currentNumber + ")" ;
        this.currentNumber = String(result);
        this.firstOperand = String(result);
      }
      this.subOperator = op;
      this.waitForSecondNumber = true;
      this.subOperatorKeyOn = true;
      this.operatorKeyOn = false;
      this.equalKeyOn = false;
    } else {
    // メインオペレータ
          if(this.firstOperand === null){   // オペランドチェック　数値一つ目か二つ目か
            this.firstOperand = this.currentNumber;    // ファーストオペランドを設定
              //  セカンドオペランドあり　x + y = z →　a = の時
              if(!this.operator == false && !this.secondOperand == false && op == "="){
                if(this.subOperatorKeyOn == true){
                  this.screenText = this.screenText + " " + this.operator + " " + this.secondOperandString + " =";
                } else {
                  this.screenText = this.currentNumber + " " + this.operator + " " + this.secondOperandString + " =";
                }
                
                const result = this.doCalculation(this.firstOperand,this.operator ,this.secondOperand);
                this.currentNumber = String(result);
                this.firstOperand = String(result);
              } else{
                if(this.subOperatorKeyOn == true){
                  this.firstOperand = this.currentNumber;
                  this.screenText = this.screenText + " " + op;
                } else{
                  this.screenText = this.currentNumber + " " + op;
                }  
              }
            this.secondOperand = null;
            this.waitForSecondNumber = true;
          } else 
          if(!this.operator == true && this.subOperatorKeyOn == true){  // x^2 +　の時
            this.firstOperand = this.currentNumber;
            this.screenText = this.screenText + " " + op;
            this.waitForSecondNumber = true;
          } else 
          if(this.equalKeyOn == true && !this.operator == false && op == "="){   // = 連打
            // secondOperand を設定
            const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
            if((this.secondOperand == null && !secondOpresult == false && !Number(secondOpresult) == false) || (!Number(secondOpresult) == false && !secondOpresult == false && !this.screenText == false && secondOpresult !== this.secondOperand)){
              this.secondOperandString = secondOpresult;
              this.secondOperand = secondOpresult;
            }    
            console.log(this.secondOperand,"this.secondOperand");
              if(!this.secondOperand == false){
                  // MRによってfirstOperandが変わるとき用
                  this.firstOperand = this.currentNumber;
                this.screenText = this.currentNumber + " " + this.operator + " " + this.secondOperandString + " =";
                const result = this.doCalculation(this.firstOperand,this.operator , this.secondOperand)
                this.currentNumber = String(result);
                this.firstOperand = String(result);
                this.waitForSecondNumber = true;
              }
          } else
          if(this.equalKeyOn == true && op !== "="){    // = 後の四則演算
            this.screenText = this.currentNumber + " " + op ;
            this.firstOperand = this.currentNumber;           
            this.waitForSecondNumber = true;
          } else // +-×÷　を連続 オペレーターを変更
          if(this.operatorKeyOn == true && this.operator !== "=" && op !== "="){
              this.screenText = this.screenText.substring(0,this.screenText.length-1) + op;
          } else // サブオペレーター使用時の計算
          if(this.subOperatorKeyOn == true && op == "=" && !this.secondOperand == false){
            const result = this.doCalculation(this.firstOperand,this.operator , this.secondOperand);
            this.screenText = this.screenText + " " + this.operator +" " + this.secondOperand + " =";
            this.currentNumber = String(result);
            this.firstOperand = String(result);
            this.waitForSecondNumber = true;
          } else // x + y^2 =
          if(this.subOperatorKeyOn == true && op == "=" && !this.secondOperand == true){
            this.screenText = this.screenText + " =";
            // secondOperand を設定
            const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
             if((this.secondOperand == null && !secondOpresult == false && !Number(secondOpresult) == false) || (!Number(secondOpresult) == false && !secondOpresult == false && !this.screenText == false && secondOpresult !== this.secondOperand)){
            this.secondOperandString = secondOpresult;
            this.secondOperand = secondOpresult;
            }    
              console.log(this.secondOperand,"this.secondOperand");
            // 計算
            const result = this.doCalculation(this.firstOperand,this.operator,this.currentNumber);
            this.currentNumber = String(result);
            this.firstOperand = String(result);
            this.waitForSecondNumber = true;
          } else  // x^2 + のとき
          if(this.subOperatorKeyOn == true && !this.operator == true && op !== "="){
                this.firstOperand = this.currentNumber;
                this.screenText = this.screenText + " " + op;
                this.waitForSecondNumber = true;
          } else  // x + y^2 + のとき
          if(this.subOperatorKeyOn == true && !this.operator == false && op !== "=" && this.screenText.indexOf(" " + this.operator+ " ") !== -1){
            console.log(this.firstOperand,"this.firstOperand",this.secondOperand,"this.secondOperand");
            const result = this.doCalculation(this.firstOperand,this.operator,this.currentNumber)
            this.screenText = result + " " + op;
            this.currentNumber = String(result);
            this.firstOperand = result;
            this.waitForSecondNumber = true;
          } else // x + y = z CE x^2 + のとき
          if(this.subOperatorKeyOn == true && !this.operator == false && op !== "=" && this.screenText.indexOf(" " + this.operator+ " ") == -1){
            this.firstOperand = this.currentNumber;
              this.screenText = this.screenText + " " + op;
              this.waitForSecondNumber = true;
          } else // =　で計算
          if(!this.operator == false && op == "="){ 
            console.log(this.firstOperand,"this.firstOperand",this.secondOperand,"this.secondOperand");
            // セカンドオペランドがない時
            if(!this.secondOperand == true){
              const result = this.doCalculation(this.firstOperand,this.operator,this.currentNumber);
              if(this.screenText.slice(-1) == this.operator){
                this.screenText = this.screenText + " " + this.currentNumber + " " + op;
              } else {
                this.screenText = this.screenText + " =";
              }
              this.currentNumber = String(result);
              this.firstOperand = String(result);
              this.waitForSecondNumber = true;
              // セカンドオペランドを設定
              const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
              if((this.secondOperand == null && !secondOpresult == false && !Number(secondOpresult) == false) || (!Number(secondOpresult) == false && !secondOpresult == false && !this.screenText == false && secondOpresult !== this.secondOperand)){
                this.secondOperandString = secondOpresult;
                this.secondOperand = secondOpresult;
              }    
              console.log(this.firstOperand,"this.firstOperand",this.secondOperand,"this.secondOperand");
            } else {
              // セカンドオペランドがある時
              this.firstOperand = this.currentNumber;
                this.screenText = this.currentNumber + " " + this.operator + " " + this.secondOperandString + " =";
                const result = this.doCalculation(this.firstOperand,this.operator , this.secondOperand);
                this.currentNumber = String(result);
                this.firstOperand = String(result);
                this.waitForSecondNumber = true;
            }
          } else // firstOperand を上書き
          if(!this.operator == false && op !== "=" && !this.screenText == true){
            this.firstOperand = this.currentNumber;    // ファーストオペランドを設定
            this.screenText = this.currentNumber + " " + op;
            this.waitForSecondNumber = true;
            this.secondOperand = null;
          } else // その他で計算
          if(!this.operator == false && op !== "="){
              const result = this.doCalculation(this.firstOperand,this.operator , this.currentNumber)
                this.screenText = result + " " + op;
                this.currentNumber = String(result);
                this.firstOperand = result;
                this.waitForSecondNumber = true;
          } else  // this.operator がない時 かつ  =
          if(!this.operator == true && op == "="){
            if(!this.secondOperand == true){
              this.firstOperand = this.currentNumber;
              this.screenText = this.currentNumber + " " + op;
              this.waitForSecondNumber = true;
            } else{
              this.firstOperand = this.currentNumber;
                this.screenText = this.currentNumber + " " + this.operator + " " + this.secondOperandString + " =";
                const result = this.doCalculation(this.firstOperand,this.operator , this.secondOperand);
                this.currentNumber = String(result);
                this.firstOperand = String(result);
                this.waitForSecondNumber = true;
            }
          } else // this.operator がない時 かつ　四則演算
          if(!this.operator == true && op !== "="){
            this.firstOperand = this.currentNumber;
            this.screenText = this.currentNumber + " " + op;
            this.waitForSecondNumber = true;
          }

          if(op !== "="){this.operator = op;}
          this.operatorKeyOn = true;
          this.subOperatorKeyOn = false;
          if(op == "="){this.equalKeyOn = true;}else{this.equalKeyOn=false;}

    }

    // roundingを消去
    this.rounding = null;

    // Infinity をオーバーフローに
    if(this.currentNumber == 'Infinity'){
      this.currentNumber = '値が大きすぎます';
      this.isFormDisabled = true;
      this.isMemoryDisabled = true;
    }

    console.log(this.currentNumber,"this.currentNumber");

    // 絶対値を取得
    if(Math.sign(Number(this.currentNumber)) == -1){
      this.currentNumberAbs = this.currentNumber.slice(1);
    } else{
      this.currentNumberAbs = this.currentNumber;
    }
    
    console.log(this.currentNumberAbs,"this.currentNumberAbs");
     
    // ~ e- の時 小数に直す
    if(this.currentNumberAbs.includes("e-")){
      const alpha = Number( this.currentNumberAbs.slice(this.currentNumberAbs.indexOf('e-') +2));
      let beta = null;
      if(this.currentNumberAbs.includes(".")){
        beta = this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf('.')) + this.currentNumberAbs.slice(this.currentNumberAbs.indexOf('.') +1,this.currentNumberAbs.indexOf('e-'))
      } else {
        beta = this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf('e-'))
      }
      this.currentNumberAbs = "0." + "0".repeat(alpha) + beta;
      console.log(this.currentNumberAbs,"syousu");
      
    } 
    // 定義不可能でない
    if(this.undifined(this.currentNumber) == 0){
    } else
    // ~ e+ の時
    if(this.currentNumberAbs.includes("e+")){
      this.currentNumber = '値が大きすぎます';
      this.isFormDisabled = true;
      this.isMemoryDisabled = true;
    } else
    // 整数のみ
    if(this.currentNumberAbs.includes(".") == false){
      
      // zahlenMaxLength 桁以上なら e+
      if(this.currentNumberAbs.length > this.zahlenMaxLength){
        this.currentNumber = '値が大きすぎます';
        this.isFormDisabled = true;
        this.isMemoryDisabled = true;
      }
    } else
    // 小数点あり
    if(this.currentNumberAbs.includes(".")){
      
      // 小数点抜き出し
      const a = this.currentNumberAbs.slice(this.currentNumberAbs.indexOf(".") + 1)
      //  整数抜き出し
      const z = this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf("."))
 
      // zahlenMaxLength 桁以上なら e+
      if(z.length > this.zahlenMaxLength){
        this.currentNumber = '値が大きすぎます';
        this.isFormDisabled = true;
        this.isMemoryDisabled = true;
      } else
      // 小数点がdecimalMaxLength 桁以上
      if(a.length > this.decimalMaxLength){
        
        //丸め処理用  / 小数点　decimalMaxLength + 5 位まで
        this.rounding = z + "." + a.slice(0, this.decimalMaxLength + 5);
        console.log(this.rounding,"rounding");
        // 負の数
        if(Math.sign(Number(this.currentNumber)) == -1){   
          this.rounding =  "-" +  this.rounding;  
        } else // 正の数
        { this.rounding = this.rounding;} 

        this.roundingA = this.rounding;
    
        

        const b = a.slice(this.decimalMaxLength - 1,this.decimalMaxLength + 1);
        const c = Math.round(Number(b)/10);
        console.log(a.slice(0,this.decimalMaxLength - 1),a,b,c);
        if(c == 10){
          const d = this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf(".") + 1) + a.slice(0,this.decimalMaxLength - 1) + "9";
          this.currentNumberAbs = this.doCalculation(d,"+","0." + "0".repeat(this.decimalMaxLength-1) + "1" );
          console.log(d,"d");
        } else {
          console.log("a",this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf(".") + 1),"b",a.slice(0,this.decimalMaxLength - 1),"c",c);
          this.currentNumberAbs = this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf(".") + 1) + a.slice(0,this.decimalMaxLength - 1) + c;
        }
      }
    }

    // 0.00000000 はエラー
    if(this.currentNumberAbs == "0.00000000"){
      this.currentNumber = '値が小さすぎます';
      this.isFormDisabled = true;
      this.isMemoryDisabled = true;
    }

    // 小数点　4.00000000 を　4 に
    this.currentNumberAbs = this.currentNumberAbs.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');

    // firstOperand を直す
    if(this.firstOperand == this.currentNumber){
      if(Math.sign(Number(this.currentNumber)) == -1){  // 負の数        
        this.firstOperand =  "-" +  this.currentNumberAbs;  
      } else { this.firstOperand = this.currentNumberAbs;}   // 正の数
    }

    // エラー表示を維持
    if(this.currentNumber == '値が大きすぎます' || this.currentNumber == '値が小さすぎます' ){

    } else  // サブスクリーンに数値がある時　かつ　負の数
    if(this.screenText.includes(this.currentNumber) && Math.sign(Number(this.currentNumber)) == -1){ 
      this.screenText = this.screenText.slice(0,this.screenText.indexOf(this.currentNumber)) + "-" + this.currentNumberAbs + this.screenText.slice(this.screenText.indexOf(this.currentNumber)+this.currentNumber.length)
      this.currentNumber =  "-" +  this.currentNumberAbs;
    } else  // サブスクリーンに数値がある時　かつ　正の数
    if(this.screenText.includes(this.currentNumber) && Math.sign(Number(this.currentNumber)) !== -1){ 
      this.screenText = this.screenText.slice(0,this.screenText.indexOf(this.currentNumber)) + this.currentNumberAbs + this.screenText.slice(this.screenText.indexOf(this.currentNumber)+this.currentNumber.length);
      this.currentNumber = this.currentNumberAbs
    } else  // 負の数 
    if(Math.sign(Number(this.currentNumber)) == -1){   
      this.currentNumber =  "-" +  this.currentNumberAbs;  
    } else // 正の数
    { this.currentNumber = this.currentNumberAbs;}   

    
    
    /*
    // 定義不可能でない
    if(this.undifined(this.currentNumber) == 0){
    } else
    // ~ e- の時
    if(this.currentNumberAbs.includes("e-")){
        // ~ e- の　~ を抽出
        const a = this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf("e-"));

        // 整数部分がzahlenMaxLength 桁以上
        if(a.length > this.zahlenMaxLength + 1){
          // ~ を整数に変換
          const b = a.slice(0,this.zahlenMaxLength + 2);
          const c = String(Math.round(Number(b)*(10**(this.zahlenMaxLength-1))));
          const d = Number(c.slice(0,1) + "." + c.slice(1));
          this.currentNumberAbs = String(d) + "e-" + this.currentNumberAbs.slice(this.currentNumberAbs.indexOf("e-")+2);
  
          console.log(b,"b",c,"c",this.currentNumberAbs,"this.currentNumberAbs");
        } 
    } else
    // ~ e+ の時
    if(this.currentNumberAbs.includes("e+")){

      // ~ e+ の　~ を抽出
      const a = this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf("e+"));

      // 整数部分がzahlenMaxLength 桁以上
      if(a.length > this.zahlenMaxLength + 1){
        // ~ を整数に変換
        const b = a.slice(0,this.zahlenMaxLength + 2);
        const c = String(Math.round(Number(b)*(10**(this.zahlenMaxLength-1))));
        const d = Number(c.slice(0,1) + "." + c.slice(1));
        this.currentNumberAbs = String(d) + "e+" + this.currentNumberAbs.slice(this.currentNumberAbs.indexOf("e+")+2);

        console.log(b,"b",c,"c",this.currentNumberAbs,"this.currentNumberAbs");
      } 
    } else
    // 整数のみ
    if(this.currentNumberAbs.includes(".") == false){

      console.log(this.currentNumberAbs.length,this.zahlenMaxLength);
      
      // zahlenMaxLength 桁以上なら e+
      if(this.currentNumberAbs.length > this.zahlenMaxLength){
        const a = this.currentNumberAbs.slice(0,this.zahlenMaxLength+1);
        const b = String(Math.round(Number(a)/10));
        const c = Number(b.slice(0,1) + "." + b.slice(1));
        this.currentNumberAbs = String(c) + "e+" + String(this.currentNumberAbs.length-1);
      } 
    } else
    // 小数点あり
    if(this.currentNumberAbs.includes(".")){
      
      console.log(this.currentNumberAbs.indexOf(".")," .");

      // 小数点抜き出し
      const a = this.currentNumberAbs.slice(this.currentNumberAbs.indexOf(".") + 1)
      //  整数抜き出し
      const z = this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf("."))

      // zahlenMaxLength 桁以上なら e+
      if(z.length > this.zahlenMaxLength){
        const za = z.slice(0,this.zahlenMaxLength+1);
        const zb = String(Math.round(Number(za)/10));
        const zc = Number(zb.slice(0,1) + "." + zb.slice(1));
        this.currentNumberAbs = String(zc) + "e+" + String(z.length-1);
      } else
      // 小数点がdecimalMaxLength 桁以上
      if(a.length > this.decimalMaxLength){
        const b = a.slice(this.decimalMaxLength - 1,this.decimalMaxLength + 1);
        const c = Math.round(Number(b)/10);
        console.log(this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf(".") + 1),a.slice(0,this.decimalMaxLength - 1),a,b,c);
        if(c == 10){
          const d = Number(this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf(".") + 1) + a.slice(0,this.decimalMaxLength - 1) + "9");
          this.currentNumberAbs = String(d + 10**(-this.decimalMaxLength));
          console.log(d,"d");
        } else {
          this.currentNumberAbs = this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf(".") + 1) + a.slice(0,this.decimalMaxLength - 1) + c;
        }
      }
    }
    
    if(this.screenText.includes(this.currentNumber) && Math.sign(Number(this.currentNumber)) == -1){ // サブスクリーンに数値がある時　かつ　負の数
      this.screenText.slice(0,this.screenText.indexOf(this.currentNumber)) + "-" + this.currentNumberAbs + this.screenText.slice(this.screenText.indexOf(this.currentNumber))
    } else      
    if(this.screenText.includes(this.currentNumber) && Math.sign(Number(this.currentNumber)) !== -1){ // サブスクリーンに数値がある時　かつ　正の数 
      this.screenText.slice(0,this.screenText.indexOf(this.currentNumber)) + this.currentNumberAbs + this.screenText.slice(this.screenText.indexOf(this.currentNumber))
    } else      
    if(Math.sign(Number(this.currentNumber)) == -1){  // 負の数        
      this.currentNumber =  "-" +  this.currentNumberAbs;  
    } else { this.currentNumber = this.currentNumberAbs;}   // 正の数


    */


    console.log(this.operator,"operator",this.firstOperand,"this.firstOperand",this.secondOperand,"this.secondOperand");
    this.memoryNumberKeyOn = false; // メモリーキーオフ
  }

  // クリア
  public clear(){
    // 数値クリア
    this.currentNumber = '0';
    // スクリーンクリア
    this.screenText = null;
    // オペランドクリア
    this.firstOperand = null;
    this.secondOperand = null;
    this.secondOperandString = null;
    // オペレータークリア
    this.operator = '';
    this.subOperator = "";
    // フラグクリア
    this.waitForSecondNumber = false;
    this.memoryNumberKeyOn = false;
    this.subOperatorKeyOn = false;
    this.operatorKeyOn = false;
    this.equalKeyOn = false;
    this.isFormDisabled = false;
    if(!this.memoryNumber == false){this.isMemoryDisabled = false; }
    
  }

  // 数値のみクリア
  public reset(){
   

    if(this.undifined(this.currentNumber) == 0){  // 定義不可能
      this.currentNumber = "0"; 
      this.screenText = "";
      this.firstOperand = null; 
      this.secondOperand = null; 
      this.operator = null;
      this.equalKeyOn = false;
    }

    this.currentNumber = '0';  // 数値を0に
    
    
    if(!this.screenText == true || this.screenText == "0"){ // サブスクリーンが0の時
      this.screenText = "";
    } else
    if(this.equalKeyOn == true && !this.operator == false){  // x + y = z の時 次の計算に移行 + y を保存する
      const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
          if((this.secondOperand == null && !secondOpresult == false && !Number(secondOpresult) == false) || (!Number(secondOpresult) == false && !secondOpresult == false && !this.screenText == false && secondOpresult !== this.secondOperand)){
            this.secondOperandString = secondOpresult;
            this.secondOperand = secondOpresult;
          }    
          console.log(this.secondOperand,"this.secondOperand");
      this.screenText = "";
      this.waitForSecondNumber = false;
    } else // 計算途中 x + , x + y のとき
    if(!this.operator == false && this.screenText.indexOf(" " + this.operator) !== -1){ 
      let firstOperandString = this.screenText.slice(0,this.screenText.indexOf(" " + this.operator));
      this.screenText = firstOperandString + " " + this.operator;
    } else // x^2 の直後
    if((this.subOperatorKeyOn == true && !this.operator == true) || (this.subOperatorKeyOn == true && !this.operator == false && this.screenText?.includes(this.operator) == false)){ 
      this.firstOperand = null;
    } else // = Z の後
    if(this.screenText?.includes("=") == true){ 
      this.screenText = ""
      this.firstOperand = null;
    } else {
      this.screenText = "";
    }
    
    if(this.screenText.includes("null")){   // nullが表示されてしまう場合
      this.screenText = "";
    }

    console.log(this.operator,"op",this.firstOperand,"this.firstOperand",this.secondOperand,"this.secondOperand");

     // フラグオフ
     this.memoryNumberKeyOn = false;
     this.subOperatorKeyOn = false;
     this.operatorKeyOn = false;
     this.isFormDisabled = false;
     if(!this.memoryNumber == false){this.isMemoryDisabled = false; }
  }

  // 一文字消去
  public Delete(){
      // フラグオフ
      this.isFormDisabled = false;
      if(!this.memoryNumber == false){this.isMemoryDisabled = false; }

      if(this.undifined(this.currentNumber) == 0){  // 定義不可能
      this.currentNumber = "0"; 
      this.screenText = "";
      this.firstOperand = null;
      this.secondOperand = null; 
      this.operator = null
      this.subOperatorKeyOn = false;
      this.operatorKeyOn = false;
      this.equalKeyOn = false;
      }

      console.log(this.operator,"this.operator",this.equalKeyOn,"e",this.operatorKeyOn,"o",this.currentNumber,"c");

      // メモリーキー　の後は変更なし
      if(this.memoryNumberKeyOn){ 
      } else  // スクリーンが0のとき
      if(this.currentNumber == "0" && this.screenText == ""){ 
      } else  // x + x + x + 　保持する
      if(!this.operator == false && this.screenText?.slice(-1) == this.operator && this.operatorKeyOn == true){ 
      } else  //  x + y の yのみ消去
      if(!this.operator == false && this.screenText?.slice(-1) == this.operator){ 
        this.currentNumber = this.currentNumber.slice(0, -1);
      } else  //  a = は何もせず
      if(!this.operator == true && this.screenText?.includes("=") == true){
      } else  // x + y = z  スクリーンのみ消去
      if(this.screenText?.includes('=') == true){ 
        this.screenText = ""
        this.firstOperand = null;
      } else  // x + y = z  の後保持する
      if(this.equalKeyOn == true){
        this.screenText = ""
        this.firstOperand = null;
      } else  //  8 + √ 9   保持する
      if(this.screenText?.includes(this.operator) == true){ 
      } else  // e+nのとき スクリーンのみ消去
      if(this.currentNumber?.includes("e") == true){ 
        this.screenText = "";
      } else  // x^2 は保持
      if(this.subOperatorKeyOn == true){
      } else  // サブスクリーンが null or "" の時
      if(!this.screenText == true){   
        this.currentNumber = this.currentNumber.slice(0, -1);
      } else {     // 基本は一文字消去
        this.currentNumber = this.currentNumber.slice(0, -1);
        this.screenText = this.screenText?.slice(0, -1); 
      } 
      // currentNumber がnull なら0 に - のみを0に
      if(!this.currentNumber == true || this.currentNumber == "-"){
        this.currentNumber = "0"
      }

      console.log("del",this.firstOperand,"this.firstOperand",this.secondOperand,"this.secondOperand");
      
    }

  public undifined(currentNumber: string){
    if(isNaN(Number(this.currentNumber)) || currentNumber === '0で割ることはできません' || currentNumber === '無効な入力です' || currentNumber === '値が大きすぎます'  || currentNumber === '値が小さすぎます'){
      return 0;
    } else {
      return 1;
    }
  }
  
  public setSecondOperand(text: string,op: string){   // セカンドオペランドで場合分け
    console.log(text.indexOf(" " + op + " "),text.indexOf("="),text.slice(text.indexOf(" " + op + " ")+3,text.indexOf("=")-1) );

    let secondOperandText = text.slice(text.indexOf(" " + op + " ")+3,text.indexOf("=")-1) 
    let countA = null;
    let countB = null;
    let signS = null;

    if(secondOperandText.includes("negate")){ // negate を分解
      countA = secondOperandText.match(/negate/g).length;
      countB = secondOperandText.match(/\)/g).length
      const firstIndex = secondOperandText.indexOf(")");
      let secondIndex = null;
      if (firstIndex !== -1) {
        secondIndex = secondOperandText.indexOf(")", firstIndex + 1);
        if (secondIndex !== -1 && countA !== countB) {
          secondOperandText = secondOperandText.slice(secondOperandText.lastIndexOf("negate(")+7,secondIndex)
        } else {
          secondOperandText = secondOperandText.slice(secondOperandText.lastIndexOf("negate(")+7,secondOperandText.indexOf(")"))
        }
      }

      if(countA % 2 == 1){
        signS = -1; // 負の数
      }

      console.log("count",countA,countB,"first",firstIndex,"second",secondIndex,"text",secondOperandText);
    
      if(signS == -1){
        secondOperandText = "-" + secondOperandText
      } 
    }
    console.log(secondOperandText,"secondOperandText");

    if(secondOperandText.includes('1/')){       // セカンドオペランドが　1/x 
      let resultO = null;
      console.log(this.roundingA,"roundingA");
      
      if(this.roundingA == null){
        resultO = this.doCalculation("0",'1/',secondOperandText.slice(secondOperandText.indexOf("(")+1,secondOperandText.indexOf(")")));
      } else {
        resultO = this.roundingA;
      }

      // 小数点あり
      if(resultO.includes(".")){
        // 小数点抜き出し
        const a = resultO.slice(resultO.indexOf(".") + 1)
  
          /*
          //  整数抜き出し
          const z = resultR.slice(0,resultR.indexOf("."))
  
          // zahlenMaxLength 桁以上なら '値が大きすぎます'
          if(z.length > this.zahlenMaxLength){
            this.currentNumber = '値が大きすぎます';
            this.isFormDisabled = true;
            this.isMemoryDisabled = true;
          } else
          */
  
          // 小数点がdecimalMaxLength 桁以上
          if(a.length > this.decimalMaxLength){
            const b = a.slice(this.decimalMaxLength - 1,this.decimalMaxLength + 1);
            const c = Math.round(Number(b)/10);
            if(c == 10){
              const d = resultO.slice(0,resultO.indexOf(".") + 1) + a.slice(0,this.decimalMaxLength - 1) + "9";
              resultO = this.doCalculation(d,"+","0." + "0".repeat(this.decimalMaxLength-1) + "1" );
            } else {
              resultO = resultO.slice(0,resultO.indexOf(".") + 1) + a.slice(0,this.decimalMaxLength - 1) + c;
            }
          }
        }
        
        if(signS == -1){
          if(resultO.includes("-")){
            resultO = resultO.slice(1);
          } else {
            resultO = "-" + resultO;
          }
        }
        console.log(resultO,"result",signS,"signS");
        resultO = resultO.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
        return resultO;
    } else
    if(secondOperandText.includes('²')){      // セカンドオペランドが　x²
       let resultS = this.doCalculation("0",'²',secondOperandText.slice(secondOperandText.indexOf("(")+1,secondOperandText.indexOf(")")));
      // 小数点あり
      if(resultS.includes(".")){
      // 小数点抜き出し
      const a = resultS.slice(resultS.indexOf(".") + 1)

        /*
        //  整数抜き出し
        const z = resultR.slice(0,resultR.indexOf("."))

        // zahlenMaxLength 桁以上なら '値が大きすぎます'
        if(z.length > this.zahlenMaxLength){
          this.currentNumber = '値が大きすぎます';
          this.isFormDisabled = true;
          this.isMemoryDisabled = true;
        } else
        */

        // 小数点がdecimalMaxLength 桁以上
        if(a.length > this.decimalMaxLength){
          const b = a.slice(this.decimalMaxLength - 1,this.decimalMaxLength + 1);
          const c = Math.round(Number(b)/10);
          if(c == 10){
            const d = resultS.slice(0,resultS.indexOf(".") + 1) + a.slice(0,this.decimalMaxLength - 1) + "9";
            resultS = this.doCalculation(d,"+","0." + "0".repeat(this.decimalMaxLength-1) + "1" );
          } else {
            resultS = resultS.slice(0,resultS.indexOf(".") + 1) + a.slice(0,this.decimalMaxLength - 1) + c;
          }
        }
      }

      console.log(resultS,"resultS",signS,"signS");
      
      if(signS == -1){
        resultS = "-" + resultS
      } 

      resultS = resultS.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
      return resultS;
    } else 
    if(secondOperandText.includes("√")){  // セカンドオペランドが　√x
      let resultR = String( Math.sqrt(Number(secondOperandText.slice(secondOperandText.indexOf("(")+1,secondOperandText.indexOf(")")))) );
      // 小数点あり
      if(resultR.includes(".")){
      // 小数点抜き出し
      const a = resultR.slice(resultR.indexOf(".") + 1)

        /*
        //  整数抜き出し
        const z = resultR.slice(0,resultR.indexOf("."))

        // zahlenMaxLength 桁以上なら '値が大きすぎます'
        if(z.length > this.zahlenMaxLength){
          this.currentNumber = '値が大きすぎます';
          this.isFormDisabled = true;
          this.isMemoryDisabled = true;
        } else
        */

        // 小数点がdecimalMaxLength 桁以上
        if(a.length > this.decimalMaxLength){
          const b = a.slice(this.decimalMaxLength - 1,this.decimalMaxLength + 1);
          const c = Math.round(Number(b)/10);
          if(c == 10){
            const d = resultR.slice(0,resultR.indexOf(".") + 1) + a.slice(0,this.decimalMaxLength - 1) + "9";
            resultR = this.doCalculation(d,"+","0." + "0".repeat(this.decimalMaxLength-1) + "1" );
          } else {
            resultR = resultR.slice(0,resultR.indexOf(".") + 1) + a.slice(0,this.decimalMaxLength - 1) + c;
          }
        }
      }
      if(signS == -1){
        resultR = "-" + resultR
      } 
      resultR = resultR.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
      return resultR;
    } else {// セカンドオペランドが　数値
      secondOperandText = secondOperandText.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
      return secondOperandText;
    }
  }
  
  /*
  number: number | null = null;
  result: number | null = null;
  error: string = '';
  tolerance: number = 0.00001; // 許容誤差
  maxIterations: number = 100; // 最大イテレーション数

  calculateSqrt() {
    if (this.number === null || this.number < 0) {
      this.error = '0以上の数値を入力してください。';
      this.result = null;
      return;
    }

    this.error = '';
    let guess = this.number / 2; // 初期推測値
    let i = 0;

    while (Math.abs(guess * guess - this.number) > this.tolerance && i < this.maxIterations) {
      guess = 0.5 * (guess + this.number / guess);
      i++;
    }

    if (i === this.maxIterations && Math.abs(guess * guess - this.number) > this.tolerance) {
      this.error = '指定されたイテレーション数内で収束しませんでした。';
      this.result = null;
    } else {
      this.result = guess;
    }
  }
  */

  ngOnInit(): void {
    
  }  

}

