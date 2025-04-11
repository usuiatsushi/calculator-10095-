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
    currentNumberAbs: string = "0"

  screenText:string = '';

  firstOperand: number = null; 
  secondOperand: number = null;

  operator: string = '';
  subOperator: string = '';
  operatorKeyOn: boolean = false;
  subOperatorKeyOn: boolean = false;
  equalKeyOn: boolean = false;

  waitForSecondNumber = false;

  memoryNumber:number = 0;
  memoryNumberKeyOn: boolean = false;
  
  // 文字数制限
  MAX_LENGTH:number = 12;
  
  
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
    if(Math.sign(Number(this.currentNumber)) == -1){
      this.currentNumberAbs = this.currentNumber.slice(1);
    }
      this.currentNumberAbs = this.currentNumber;

    console.log(this.currentNumberAbs,"currentNumberAbs");
    
    if (this.currentNumberAbs.length > this.MAX_LENGTH) {
      // 入力値の絶対値の文字数をMAX_LENGTHに制限　それ以降は反応しない
      if(v == "00"){
          if(this.currentNumberAbs.length == this.MAX_LENGTH + 1){
              this.currentNumber =  this.currentNumber.substring(0,this.currentNumber.length-1);
          } else if(this.currentNumber.length == this.MAX_LENGTH + 2){
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
      } else{
        // 数値が0以外]
      }
  }

  getDecimal(){

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
    
    console.log(this.subOperatorKeyOn,"this.subOperatorKeyOn",this.equalKeyOn, "this.equalKeyOn",this.operatorKeyOn,"operatorKeyOn",this.operator,"operator",op,"op");
    
    // 定義不可能
    if(this.currentNumber == "NaN" || this.currentNumber == "error"){
      this.currentNumber = "0";
      this.firstOperand = 0;
    }
    
    // サブオペレーター
    // x分の１ボタン
    if(op === '1/'){
      if(this.equalKeyOn){
          const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
          this.secondOperand = secondOpresult
          console.log(this.secondOperand,"this.secondOperand");
          const result = 1/Number(this.currentNumber)
          this.screenText = "1 /(" +this.currentNumber + ")" ;
          this.currentNumber = String(result);
          this.firstOperand = result;
      }
      if(this.operator){
          this.screenText = this.screenText + " " + "1/(" +this.currentNumber + ")" ;
          this.currentNumber = String(1/Number(this.currentNumber));
      } else  {  // 数値のみ 
          const result = 1/Number(this.currentNumber)
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
          const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
          this.secondOperand = secondOpresult
          console.log(this.secondOperand,"this.secondOperand");
          const result = Number(this.currentNumber)**2
          this.screenText = "(" + this.currentNumber + ")" + "²" ;
          this.currentNumber = String(result);
          this.firstOperand = result;
      } else
      if(this.operator){
          this.screenText = this.screenText + " " + "(" + this.currentNumber + ")" + "²";
          this.currentNumber = String(Number(this.currentNumber)**2);
      } else {  // 数値のみ
          const result = Number(this.currentNumber)**2
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
   
    if(op === '√'){        // ルート
      if(this.equalKeyOn == true){         // ＝の後
          const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
          this.secondOperand = secondOpresult
          console.log(this.secondOperand,"this.secondOperand");
          const result = Math.sqrt(Number(this.currentNumber))
          this.screenText = "√(" +this.currentNumber + ")" ; 
          this.currentNumber = String(result);
          this.firstOperand = result;
      } else
      if(this.operator){         //   +-×÷　の後
          this.screenText += " " + "√(" +this.currentNumber + ")";
          this.currentNumber = String(Math.sqrt(Number(this.currentNumber)));
      } else {    // 数値のみ
          const result = Math.sqrt(Number(this.currentNumber))
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
    // オペランドチェック　数値一つ目か二つ目か
          if(this.firstOperand === null){
            this.firstOperand = Number(this.currentNumber);
            this.screenText = this.currentNumber + " " + op;
            this.waitForSecondNumber = true;
          } else 
          if(this.operator == ""){
            this.firstOperand = Number(this.currentNumber);
            this.screenText = this.screenText + " " + op;
            this.waitForSecondNumber = true;
          } else 
          // = 連打
          if(this.equalKeyOn == true && op == "="){
                const secondOpresult = this.setSecondOperand(this.screenText,this.operator);
                this.secondOperand = secondOpresult
                console.log(this.secondOperand,"this.secondOperand");
                this.firstOperand = Number(this.currentNumber);
                this.screenText = this.currentNumber + " " + this.operator + " " + this.secondOperand + " =";
                const result = this.doCalculation(this.operator , Number(this.secondOperand))
                this.currentNumber = String(result);
                this.firstOperand = result;
                this.waitForSecondNumber = true;
          } else
          // = 後の四則演算
          if(this.equalKeyOn == true && op !== "="){
            this.screenText = this.firstOperand + " " + op ;
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
                const result = this.doCalculation(this.operator , Number(this.currentNumber));
                this.screenText = this.screenText + " =";
                this.currentNumber = String(result);
                this.firstOperand = result;
                this.waitForSecondNumber = true;
          } else
          if(this.subOperatorKeyOn == true && op !== "="){
                this.firstOperand = Number(this.currentNumber);
                this.screenText = this.screenText + " " + op;
                this.waitForSecondNumber = true;
          } else // =　で計算
          if(this.operator  && op == "="){  
                const result = this.doCalculation(this.operator , Number(this.currentNumber));
                this.screenText = this.screenText + " " + this.currentNumber + " " + op;
                this.currentNumber = String(result);
                this.firstOperand = result;
                this.waitForSecondNumber = true;     
          } else // その他で計算
          if(this.operator  && op !== "="){
                const result = this.doCalculation(this.operator , Number(this.currentNumber))
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
    
    if(Math.sign(Number(this.currentNumber)) == -1){
      this.currentNumberAbs = this.currentNumber.slice(1);
    } else{
      this.currentNumberAbs = this.currentNumber;
    }

    console.log(this.currentNumberAbs,"this.currentNumberAbs");
    
    if (this.currentNumberAbs.length > this.MAX_LENGTH) {
      // ~e+~ の時
      if(this.currentNumberAbs.includes("e")){ 
        this.currentNumberAbs = String(Math.round((Number(this.currentNumberAbs.substring(0,this.MAX_LENGTH+1)))*(10**(this.MAX_LENGTH-2)))/(10**(this.MAX_LENGTH-2))) + "e" + this.currentNumberAbs.substring(this.currentNumberAbs.indexOf("e")+1);
      } else 
      // 小数点あり
      if(this.currentNumberAbs.includes(".")){　
        console.log(this.currentNumberAbs.indexOf(".")," .");
          this.currentNumberAbs = String((Math.round(Number(this.currentNumberAbs.substring(0,this.MAX_LENGTH+2)) * (10**((this.MAX_LENGTH)-this.currentNumberAbs.indexOf("."))))) / (10**((this.MAX_LENGTH)-this.currentNumberAbs.indexOf("."))));
          // 1000000000000の時　1.0e+12に書き換え　MAX_LENGTHを変更したら変更
          if(this.currentNumberAbs == String(10**this.MAX_LENGTH)){this.currentNumberAbs = "1.0e+" + this.MAX_LENGTH ;} 
      } else {
      // MAX_LENGTH+1 桁以上
          this.currentNumberAbs = String(Math.round(Number(this.currentNumberAbs.substring(0,this.MAX_LENGTH+1))/10)/(10**(this.MAX_LENGTH-1))) + "e+" + String(this.currentNumberAbs.length-1);
      }
    
    
        if(Math.sign(Number(this.currentNumber)) == -1){
          this.currentNumber =　"-" +  this.currentNumberAbs;
        } else { this.currentNumber = this.currentNumberAbs;}
      
    }
    
    console.log(this.operator,"operator");
    
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
    // オペレータークリア
    this.operator = '';
    this.subOperator = "";
    // フラグクリア
    this.waitForSecondNumber = false;
    this.memoryNumberKeyOn = false;
    this.subOperatorKeyOn = false;
    this.operatorKeyOn = false;
    this.equalKeyOn = false;
  }

  // 数値のみクリア
  public reset(){
    // メモリーキーオフ
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

      if(this.undifined(this.currentNumber) == 0){
      this.currentNumber = "0"; this.screenText = "";}

      console.log(this.operator,this.screenText?.slice(-1),this.equalKeyOn,this.operatorKeyOn);
      
      if(this.currentNumber == "Infinity"){
        this.currentNumber = '0';
        this.screenText = this.screenText.substring(0,this.screenText.indexOf("Infinity"));
      } else
      if(this.currentNumber == "-Infinity"){
        this.currentNumber = '0';
        this.screenText = this.screenText.substring(0,this.screenText.indexOf("-Infinity"));
      } else
      if(this.currentNumber.includes("e")){ // e+nのとき スクリーンのみ消去 
        this.screenText = "";
      } else
      if(this.screenText.includes(this.operator)){
      } else
      if(this.operator !== "" && this.screenText.slice(-1) == this.operator){
        this.currentNumber = "0";
      } else      
      if(this.screenText.includes(this.operator) == true){
        this.screenText = ""
      } else
      if(this.currentNumber == "0"){    // 入力値が0のとき
      } else 
      if(this.screenText == null){    // 結果表示が null の時
        this.currentNumber = this.currentNumber.slice(0, -1);
      } else {     // 基本は一文字消去
        this.currentNumber = this.currentNumber.slice(0, -1);
        this.screenText = this.screenText?.slice(0, -1);
      }

      if(this.currentNumber == "" || this.currentNumber == "-"){this.currentNumber = "0"}
    }

  public undifined(currentNumber: string){
    if(currentNumber == "NaN" || currentNumber == "error"){
      return 0;
    } else {
      return 1;
    }
  }
  
  public setSecondOperand(text: string,op: string){
    // セカンドオペランドで場合分け
    const secondOperandText = text.slice(text.indexOf(" " + op + " ")+3,text.indexOf("=")-1) 
    // セカンドオペランドが　1/x 
    if(secondOperandText.includes('1/')){
      return 1 / Number(secondOperandText.slice(secondOperandText.indexOf("(")+1,secondOperandText.indexOf(")")));
    } else
    // セカンドオペランドが　x²
    if(secondOperandText.includes('²')){
      return Number(secondOperandText.slice(secondOperandText.indexOf("(")+1,secondOperandText.indexOf(")")))**2 ;
    } else 
    // セカンドオペランドが　√x
    if(secondOperandText.includes("√")){ 
      return Math.sqrt(Number(secondOperandText.slice(secondOperandText.indexOf("(")+1,secondOperandText.indexOf(")"))));
    } else {
    // セカンドオペランドが　数値
      return Number(secondOperandText);
    }
  }

  ngOnInit(): void {
    
  }  
}