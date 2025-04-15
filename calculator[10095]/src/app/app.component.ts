import { Component,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { zip } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

})

export class AppComponent implements OnInit {
  isFormDisabled = false;    // オペレーターなどを有効
  isMemoryDisabled = true;    //  MR,MC を無効

  currentNumber: string = '0';    // スクリーン
    currentNumberAbs: string = "0";  //  スクリーンの絶対値
    currentRealNumber: number = 0;  // スクリーンの実数値

  screenText:string = '';   // サブスクリーン

  firstOperand: number = null;  // ファーストオペランド: Number
  secondOperand: number = null;   // セカンドオペランド: Number
  secondOperandString: String = "";   // セカンドオペランド:　String

  operator: string = '';  // オペレーター
  subOperator: string = ''; //  サブオペレーター 
  operatorKeyOn: boolean = false;  // オペレーターキー　チェック
  subOperatorKeyOn: boolean = false;  // サブオペレーターキー　チェック
  equalKeyOn: boolean = false;  // イコールキー　チェック

  waitForSecondNumber: boolean = false;  //　セカンドオペランド　チェック

  memoryNumber:number = 0; // メモリの値
  memoryNumberKeyOn: boolean = false; // メモリキー　チェック
  
  
  // 文字数制限
  MAX_LENGTH:number = 25;
  zahlenMaxLength:number = 10;
  decimalMaxLength:number = 8;
  
  
  //メモリ機能
  public memoryOperation(op:string){
    switch (op){
        case 'M+':  //M+
        if(this.undifined(this.currentNumber) == 0){   // 定義不可能
          this.currentNumber = "0"; this.screenText = "";
        } else {  //計算
          this.memoryNumber = this.memoryNumber + this.currentRealNumber;
        }
        if(this.equalKeyOn == true && this.operator !== ""){  // x + y = z の時 次の計算に移行 + y を保存する
          console.log(this.secondOperand,"this.secondOperand");
          const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
          console.log(secondOpresult,"secondOpresult");
          if(this.secondOperand == null || (this.screenText !== "" && secondOpresult !== this.secondOperand)){
            this.secondOperandString = this.screenText.slice(this.screenText.indexOf(" " + this.operator + " ")+3,this.screenText.indexOf("=")-1);
            this.secondOperand = secondOpresult;
          }    
          console.log(this.secondOperand,"this.secondOperand");
          this.screenText = "";
        }
        console.log(this.memoryNumber,"this.memoryNumber",this.secondOperand,"this.secondOperand")
        this.memoryNumberKeyOn = true;  // メモリーキーチェック
        this.isMemoryDisabled = false;
        break;
      case 'M-':    //M-
        if(this.undifined(this.currentNumber) == 0){   // 定義不可能
          this.currentNumber = "0"; this.screenText = "";
        } else {    //計算
          this.memoryNumber = this.memoryNumber - this.currentRealNumber;
        }
        if(this.equalKeyOn == true && this.operator !== ""){  // x + y = z の時 次の計算に移行 + y を保存する
          console.log(this.secondOperand,"this.secondOperand");
          const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
          console.log(secondOpresult,"secondOpresult");
            if(this.secondOperand == null || (this.screenText !== "" && secondOpresult !== this.secondOperand)){
                this.secondOperandString = this.screenText.slice(this.screenText.indexOf(" " + this.operator + " ")+3,this.screenText.indexOf("=")-1);
                this.secondOperand = secondOpresult;
            }    
          console.log(this.secondOperand,"this.secondOperand");
          this.screenText = "";
        }
        console.log(this.memoryNumber)
        this.memoryNumberKeyOn = true;  // メモリーキーチェック
        this.isMemoryDisabled = false;
        break;
      case 'MR': //MR
        this.currentNumber = String(this.memoryNumber); // 結果を表示

        // セカンドオペランドを設定
        // x + y = z の時 次の計算に移行 + y を保存する
        if(this.equalKeyOn == true && this.operator !== ""){  
          if(this.secondOperand == null){
            this.secondOperandString = this.screenText.slice(this.screenText.indexOf(" " + this.operator + " ")+3,this.screenText.indexOf("=")-1);
            const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
            this.secondOperand = secondOpresult;
          }
        this.screenText = "";
        } else
        //  x + y^2 の時　y で上書き
        if(this.subOperatorKeyOn == true && this.operator !== ""){  
          this.screenText = this.screenText.substring(0,this.screenText.indexOf(" " + this.operator+ " ")+2);
        }

          
        // 絶対値を求める
        if(Math.sign(Number(this.currentNumber)) == -1){
          this.currentNumberAbs = this.currentNumber.slice(1);
        } else{
          this.currentNumberAbs = this.currentNumber;
        }
        
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
          
          const a = this.currentNumberAbs.slice(this.currentNumberAbs.indexOf(".") + 1)
          if(a.length > this.decimalMaxLength){
            const b = a.slice(this.decimalMaxLength - 1,this.decimalMaxLength + 1);
            const c = Math.round(Number(b)/10);
            if(c == 10){
              const d = Number(this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf(".") + 1) + a.slice(0,this.decimalMaxLength - 1) + "9");
              this.currentNumberAbs = String(d + 10**(-this.decimalMaxLength));
              console.log(d,"d");
            console.log(this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf(".") + 1),a.slice(0,this.decimalMaxLength - 1),a,b,c);
            } else {
              this.currentNumberAbs = this.currentNumberAbs.slice(0,this.currentNumberAbs.indexOf(".") + 1) + a.slice(0,this.decimalMaxLength - 1) + c;
            }
          }
        }
     
        if(Math.sign(Number(this.currentNumber)) == -1){  // 負の数        
          this.currentNumber =  "-" +  this.currentNumberAbs;  
        } else { this.currentNumber = this.currentNumberAbs;}   // 正の数
      
        
        // フラグオフ
        this.waitForSecondNumber = false;
        this.memoryNumberKeyOn = true;  // メモリーキーチェック
        this.subOperatorKeyOn = false;
        break;
        
      case 'MC':
        this.memoryNumber = 0;   //メモリークリア
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
      this.currentNumber = v; this.screenText = "",this.waitForSecondNumber = false;
    } else
    if(this.screenText?.includes("=")){     // x + y = z の時 次の計算に移行
      this.currentNumber = v;
      this.screenText = "";
      this.waitForSecondNumber = false;
    } else
    if(this.memoryNumberKeyOn == true){   // メモリーキーチェック　おそらくMRでスクリーン上に表示する設定にしているから必要
      this.currentNumber = v;
      this.memoryNumberKeyOn = false;
    } else
    if(this.subOperatorKeyOn == true && this.operator == ""){  //  x^2 の時　x で上書き
        this.currentNumber = v;
        this.firstOperand = null ;
    } else
    if(this.subOperatorKeyOn == true && this.operator !== ""){  //  x + y^2 の時　y で上書き
        this.currentNumber = v;
        this.screenText = this.screenText.substring(0,this.screenText.indexOf(" " + this.operator+ " ")+2);
    } else
    if(this.waitForSecondNumber){      // waitForSecondNumberフラグチェック trueの時
      this.currentNumber = v;
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

    // 実数値を置き換え
    this.currentRealNumber = Number(this.currentNumber);

    //　フラグオフ
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

      console.log(this.currentNumberAbs.length,this.zahlenMaxLength);
      
      // zahlenMaxLength 桁以上なら入力無効
      if(this.currentNumberAbs.length > this.zahlenMaxLength){
        this.currentNumberAbs = this.currentNumberAbs.slice(0,this.zahlenMaxLength);
      } 
    } else
    // 小数点含む
    if(this.currentNumberAbs.includes(".") == true){

      console.log(this.currentNumberAbs.length,this.currentNumberAbs.indexOf("."));
      
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
    
    if(this.undifined(this.currentNumber) == 0){  // 定義不可能
      this.currentNumber = "0"; this.screenText = "";}
      
      const A = this.currentNumber

      if(this.currentNumber == "0"){  // 数値が0の時
      } else
      if(Math.sign(Number(this.currentNumber)) == -1){  // 負の数
        this.currentNumber = this.currentNumber.slice(1);
      } else {  // 正の数
      this.currentNumber = "-" + this.currentNumber;
      }  

      if(this.screenText == ""){  //サブスクリーンなし
      } else
      if(this.screenText?.slice(-1) == "="){ // x + y = z の時
        this.screenText = "negate(" + A + ")";
      } else
      if(this.screenText?.includes("negate")){ // negate() の時
        this.screenText = this.screenText?.slice(0,this.screenText.indexOf("negate")) + "negate(" + this.screenText?.slice(this.screenText.indexOf("negate")) + ")";
      } else
      if(this.screenText?.slice(-1) == this.operator && this.operatorKeyOn){ // x + の次に押したとき
        this.screenText = this.screenText + " negate(" + A + ")";
      } else
      if(this.subOperatorKeyOn == true && this.operator !== ""){  // x + √(y) の時
        this.screenText = this.screenText.slice(0,this.screenText.indexOf(" " + this.operator + " " ) + 3) + "negate(" + this.screenText.slice(this.screenText.indexOf(" " + this.operator + " " ) + 2) + ")";
      } else
      if(this.subOperatorKeyOn == true && this.operator == ""){   // x^2 のとき
        this.screenText = "negate(" + this.screenText + ")";
      }

      // 実数値を置き換え
    this.currentRealNumber = Number(this.currentNumber);

      //　フラグオフ
    this.memoryNumberKeyOn = false;
  }

  getDecimal(){

    //　定義不可能
    if(this.currentNumber == "NaN" || this.currentNumber == "error"){
      this.currentNumber = "0";
      this.screenText = "";
      this.firstOperand = 0;
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

    // 実数値を置き換え
    this.currentRealNumber = Number(this.currentNumber);

     //　フラグをオフ
    this.memoryNumberKeyOn = false;
    this.waitForSecondNumber = false;
    this.operatorKeyOn = false;
    this.equalKeyOn = false;
    this.subOperatorKeyOn = false;
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

    // .で数値が終わる場合　.削除
    if(this.currentNumber.slice(-1) == "." ){
        this.currentNumber = this.currentNumber.slice(0,-1);
    }
    
    console.log(this.subOperatorKeyOn,"this.subOperatorKeyOn",this.equalKeyOn, "this.equalKeyOn",this.operatorKeyOn,"operatorKeyOn",this.operator,"operator",op,"op");
    
    if(this.undifined(this.currentNumber) == 0){ // 定義不可能
      this.currentNumber = "0";
      this.firstOperand = 0;
      this.screenText = ""; 
      this.isFormDisabled = false;

    } else // 0で割ることはできません
    if(this.operator == "÷" && op == '=' && this.currentNumber == "0"){
          this.currentNumber = '0で割ることはできません'; // font-size 変えたい
          this.isFormDisabled = true;
          
    } else
    // サブオペレーター
    if(op === '1/'){  // x分の１ボタン
      if(this.currentNumber == "0"){
          this.currentNumber = '0で割ることはできません'; // font-size 変えたい
            if(this.screenText == null){this.screenText = '1/(0)';} else {this.screenText += '1/(0)';}
          this.isFormDisabled = true;     
      } else
      if(this.equalKeyOn){
          console.log(this.secondOperand,"this.secondOperand");
          const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
          console.log(secondOpresult,"secondOpresult");
          if(this.secondOperand == null || (this.screenText !== "" && secondOpresult !== this.secondOperand)){
            this.secondOperandString = this.screenText.slice(this.screenText.indexOf(" " + this.operator + " ")+3,this.screenText.indexOf("=")-1);
            this.secondOperand = secondOpresult;
          }    
          console.log(this.secondOperand,"this.secondOperand");
          const result = 1/this.currentRealNumber
          this.screenText = "1 /(" +this.currentNumber + ")" ;
          this.currentNumber = String(result);
          this.firstOperand = result;
      } else
      if(this.operator !== "" && this.subOperatorKeyOn == true){
        this.screenText = this.screenText.slice(0,this.screenText.indexOf(" " + this.operator)) +" " +this.operator + " " + "1/(" +this.currentNumber + ")" ;
        this.currentNumber = String(1/this.currentRealNumber);
      } else
      if(this.operator){
          this.screenText = this.screenText + " " + "1/(" +this.currentNumber + ")" ;
          this.currentNumber = String(1/this.currentRealNumber);
      } else  {  // 数値のみ 
          const result = 1/this.currentRealNumber
          this.screenText = "1 /(" +this.currentNumber + ")" ;
          this.currentNumber = String(result);
          this.firstOperand = result;
      }
      this.subOperator = op;
      this.waitForSecondNumber = true;
      this.subOperatorKeyOn = true;
      this.operatorKeyOn = false;
      this.equalKeyOn = false;
    } else
    // ２乗
    if(op === '²'){
      if(this.operatorKeyOn){
          console.log(this.secondOperand,"this.secondOperand");
          const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
          console.log(secondOpresult,"secondOpresult");
          if(this.secondOperand == null || (this.screenText !== "" && secondOpresult !== this.secondOperand)){
              this.secondOperandString = this.screenText.slice(this.screenText.indexOf(" " + this.operator + " ")+3,this.screenText.indexOf("=")-1);
              this.secondOperand = secondOpresult;
            }    
          console.log(this.secondOperand,"this.secondOperand");
          const result = this.currentRealNumber**2
          this.screenText = "(" + this.currentNumber + ")" + "²" ;
          this.currentNumber = String(result);
          this.firstOperand = result;
      } else
      if(this.operator !== "" && this.subOperatorKeyOn == true){
          this.screenText = this.screenText.slice(0,this.screenText.indexOf(" " + this.operator)) +" " +this.operator + " (" + this.currentNumber + ")" + "²";
          this.currentNumber = String(this.currentRealNumber**2);
      } else
      if(this.operator){
          this.screenText = this.screenText + " " + "(" + this.currentNumber + ")" + "²";
          this.currentNumber = String(this.currentRealNumber**2);
      } else {  // 数値のみ
          const result = this.currentRealNumber**2
          this.screenText = "(" + this.currentNumber + ")" + "²" ;
          this.currentNumber = String(result);
          this.firstOperand = result;    
      }
      this.subOperator = op;
      this.waitForSecondNumber = true;
      this.subOperatorKeyOn = true;
      this.operatorKeyOn = false;
      this.equalKeyOn = false;
    } else
   
    if(op === '√'){       // ルート
      if(Math.sign(Number(this.currentNumber)) == -1){ // 負の数を√　（虚数）
          if(this.screenText == null){this.screenText = '√(' + this.currentNumber + ')';} else {this.screenText += '√(' + this.currentNumber + ')';}
            this.currentNumber = '無効な入力です'; // font-size 変えたい
            this.isFormDisabled = true;     
      } else
      if(this.equalKeyOn == true){    // ＝の後
          console.log(this.secondOperand,"this.secondOperand");
          const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
          console.log(secondOpresult,"secondOpresult");
          if(this.secondOperand == null || (this.screenText !== "" && secondOpresult !== this.secondOperand)){
            this.secondOperandString = this.screenText.slice(this.screenText.indexOf(" " + this.operator + " ")+3,this.screenText.indexOf("=")-1);
            this.secondOperand = secondOpresult;
          }    
          console.log(this.secondOperand,"this.secondOperand");
          const result = Math.sqrt(this.currentRealNumber)
          this.screenText = "√(" +this.currentNumber + ")" ; 
          this.currentNumber = String(result);
          this.firstOperand = result;
      } else
      if(this.operator !== "" && this.subOperatorKeyOn == true){
        this.screenText = this.screenText.slice(0,this.screenText.indexOf(" " + this.operator)) +" " +this.operator + " " + "√(" +this.currentNumber + ")";
        this.currentNumber = String(Math.sqrt(this.currentRealNumber));
      } else
      if(this.operator){         //   +-×÷　の後
          this.screenText += " " + "√(" +this.currentNumber + ")";
          this.currentNumber = String(Math.sqrt(this.currentRealNumber));
      } else {    // 数値のみ
          const result = Math.sqrt(this.currentRealNumber)
          this.screenText = "√(" +this.currentNumber + ")" ;
          this.currentNumber = String(result);
          this.firstOperand = result;
      }
      this.subOperator = op;
      this.waitForSecondNumber = true;
      this.subOperatorKeyOn = true;
      this.operatorKeyOn = false;
      this.equalKeyOn = false;
    } else {
    // メインオペレータ
          if(this.firstOperand === null){   // オペランドチェック　数値一つ目か二つ目か
            this.firstOperand = this.currentRealNumber;    // ファーストオペランドを設定
            this.screenText = this.currentNumber + " " + op;
            this.waitForSecondNumber = true;
          } else 
          if(this.operator == "" && this.subOperatorKeyOn == true){  // x^2 +　の時
            this.firstOperand = this.currentRealNumber;
            this.screenText = this.screenText + " " + op;
            this.waitForSecondNumber = true;
          } else 
          if(this.equalKeyOn == true && this.operator!== "" && op == "="){   // = 連打
              console.log(this.secondOperand,"this.secondOperand");
              const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
              console.log(secondOpresult,"secondOpresult");
              if(this.secondOperand == null || (this.screenText !== "" && secondOpresult !== this.secondOperand)){
                this.secondOperandString = this.screenText.slice(this.screenText.indexOf(" " + this.operator + " ")+3,this.screenText.indexOf("=")-1);
                this.secondOperand = secondOpresult;
              }    
              console.log(this.secondOperand,"this.secondOperand");
              this.firstOperand = this.currentRealNumber;
              this.screenText = this.currentNumber + " " + this.operator + " " + this.secondOperandString + " =";
              const result = this.doCalculation(this.operator , Number(this.secondOperand))
              this.currentNumber = String(result);
              this.firstOperand = result;
              this.waitForSecondNumber = true;
          } else
          if(this.equalKeyOn == true && op !== "="){    // = 後の四則演算
            this.screenText = this.currentNumber + " " + op ;
            this.waitForSecondNumber = true;
          } else // +-×÷　を連続 オペレーターを変更
          if(this.operatorKeyOn == true && this.operator !== "=" && op !== "="){
              this.screenText = this.screenText.substring(0,this.screenText.length-1) + op;
          } else // サブオペレーター使用時の計算
          if(this.subOperatorKeyOn == true && op == "=" && this.secondOperand !== null){
                const result = this.doCalculation(this.operator , this.secondOperand);
                this.screenText = this.screenText + " " + this.operator +" " + this.secondOperand + " =";
                this.currentNumber = String(result);
                this.firstOperand = result;
                this.waitForSecondNumber = true;
          } else 
          if(this.subOperatorKeyOn == true && op == "=" && this.secondOperand == null){
                const result = this.doCalculation(this.operator , this.currentRealNumber);
                this.screenText = this.screenText + " =";
                this.currentNumber = String(result);
                this.firstOperand = result;
                this.waitForSecondNumber = true;
          } else
          if(this.subOperatorKeyOn == true && op !== "="){
                this.firstOperand = this.currentRealNumber;
                this.screenText = this.screenText + " " + op;
                this.waitForSecondNumber = true;
          } else // =　で計算
          if(this.operator  && op == "="){  
                const result = this.doCalculation(this.operator , this.currentRealNumber);
                this.screenText = this.screenText + " " + this.currentNumber + " " + op;
                this.currentNumber = String(result);
                this.firstOperand = result;
                this.waitForSecondNumber = true;     
          } else // その他で計算
          if(this.operator  && op !== "="){
                const result = this.doCalculation(this.operator , this.currentRealNumber)
                this.screenText = result + " " + op;
                this.currentNumber = String(result);
                this.firstOperand = result;
                this.waitForSecondNumber = true;
          }

          if(op !== "="){this.operator = op;}
          this.operatorKeyOn = true;
          this.subOperatorKeyOn = false;
          if(op == "="){this.equalKeyOn = true;}else{this.equalKeyOn=false;}

    }

    // Infinity をオーバーフローに
    if(this.currentNumber == 'Infinity'){
      this.currentNumber = 'オーバーフロー';
      this.isFormDisabled = true;
    }

    // 実数値を置き換え
    this.currentRealNumber = Number(this.currentNumber);

    console.log(this.currentNumber,"this.currentNumber",this.currentRealNumber,'this.currentRealNumber');
    
    // 絶対値を取得
    if(Math.sign(Number(this.currentNumber)) == -1){
      this.currentNumberAbs = this.currentNumber.slice(1);
    } else{
      this.currentNumberAbs = this.currentNumber;
    }
    
    console.log(this.currentNumberAbs,"this.currentNumberAbs");
    
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

    console.log(this.operator,"operator");
    this.memoryNumberKeyOn = false; // メモリーキーオフ
  }

  // クリア
  public clear(){
    // 数値クリア
    this.currentNumber = '0';
    this.currentRealNumber = 0;
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
    
  }

  // 数値のみクリア
  public reset(){
   

    if(this.undifined(this.currentNumber) == 0){  // 定義不可能
      this.currentNumber = "0"; this.screenText = "";
      this.firstOperand = null;
    }

    this.currentNumber = '0';  // 数値を0に
    console.log(this.operator);
    
    if(this.screenText == "" || this.screenText == "0"){ // サブスクリーンが0の時
      this.screenText = "";
    } else
    if(this.equalKeyOn == true && this.operator !== ""){  // x + y = z の時 次の計算に移行 + y を保存する
      console.log(this.secondOperand,"this.secondOperand");
      const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
      console.log(secondOpresult,"secondOpresult");
      if(this.secondOperand == null || (this.screenText !== "" && secondOpresult !== this.secondOperand)){
        this.secondOperandString = this.screenText.slice(this.screenText.indexOf(" " + this.operator + " ")+3,this.screenText.indexOf("=")-1);
        this.secondOperand = secondOpresult;
      }    
      console.log(this.secondOperand,"this.secondOperand");
      console.log(this.secondOperand);
      this.screenText = "";
    } else 
    if(this.operator){ // 計算途中
      let firstOperandString = this.screenText.slice(0,this.screenText.indexOf(" " + this.operator));
      this.screenText = firstOperandString + " " + this.operator;
    } else {      
      this.screenText = "";
    }
    
    if(this.screenText.includes("null")){   // nullが表示されてしまう場合
      this.screenText = "";
    }

    // 実数値を置き換え
    this.currentRealNumber = Number(this.currentNumber);

     // フラグオフ
     this.memoryNumberKeyOn = false;
     this.subOperatorKeyOn = false;
     this.operatorKeyOn = false;
     this.isFormDisabled = false;
  }

  // 一文字消去
  public Delete(){
      // フラグオフ
      this.isFormDisabled = false;

      if(this.undifined(this.currentNumber) == 0){  // 定義不可能
      this.currentNumber = "0"; this.screenText = "";}

      console.log(this.operator,this.screenText?.slice(-1),this.equalKeyOn,this.operatorKeyOn);
      
      if(this.memoryNumberKeyOn){ // メモリーキー　の後は変更なし
      } else
      if(this.operator !== "" && this.screenText?.slice(-1) == this.operator && this.operatorKeyOn == true){ // x + x + x + 　保持する
      } else
      if(this.operator !== "" && this.screenText?.slice(-1) == this.operator){ //  x + y の yのみ消去
        this.currentNumber = "0";
      } else 
      if(this.operator == "" && this.screenText?.includes("=") == true){
      } else
      if(this.screenText?.includes('=') == true){ // x + y = z  スクリーンのみ消去
          this.screenText = ""
      } else
      if(this.screenText?.includes(this.operator) == true){ //  8 + √ 9   保持する
      } else
      if(this.currentNumber?.includes("e") == true){ // e+nのとき スクリーンのみ消去 
        this.screenText = "";
      } else
      if(this.currentNumber == "0"){    // スクリーンが0のとき
      } else 
      if(this.screenText == null){    // サブスクリーンが null の時
        this.currentNumber = this.currentNumber.slice(0, -1);
      } else {     // 基本は一文字消去
        this.currentNumber = this.currentNumber.slice(0, -1);
        this.screenText = this.screenText?.slice(0, -1); 
      } 
      // currentNumber がnull なら0 に
      if(this.currentNumber == ""){
        this.currentNumber = "0"
      }
      // 実数値を置き換え
      this.currentRealNumber = Number(this.currentNumber);
    }

  public undifined(currentNumber: string){
    if(currentNumber == "NaN" || currentNumber == '0で割ることはできません' || currentNumber =='無効な入力です' || currentNumber == 'オーバーフロー'){
      return 0;
    } else {
      return 1;
    }
  }
  
  public setSecondOperand(text: string,op: string){   // セカンドオペランドで場合分け
    const secondOperandText = text.slice(text.indexOf(" " + op + " ")+3,text.indexOf("=")-1) 
    if(secondOperandText.includes("negate")){ // negate を分解
      secondOperandText.replace("negate","-");
      console.log(secondOperandText,"secondOperandText");
    }
    if(secondOperandText.includes('1/')){       // セカンドオペランドが　1/x 
      return 1 / Number(secondOperandText.slice(secondOperandText.indexOf("(")+1,secondOperandText.indexOf(")")));
    } else
    if(secondOperandText.includes('²')){      // セカンドオペランドが　x²
      return Number(secondOperandText.slice(secondOperandText.indexOf("(")+1,secondOperandText.indexOf(")")))**2 ;
    } else 
    if(secondOperandText.includes("√")){  // セカンドオペランドが　√x
      return Math.sqrt(Number(secondOperandText.slice(secondOperandText.indexOf("(")+1,secondOperandText.indexOf(")"))));
    } else {// セカンドオペランドが　数値
      return Number(secondOperandText);
    }
  }

  ngOnInit(): void {
    
  }  
}


