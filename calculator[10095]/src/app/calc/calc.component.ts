import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrl: './calc.component.css'
})
export class CalcComponent  {

  

  update( _v: string ) // input tag を更新する関数
    {
        if(input) input.value = _v
    }
  append( _v: string ) // 数字ボタンが押されたので数字を後ろに追加する
    {
        if(input) input.value += _v
    }

  calc() // 「＝」ボタンが押されたので計算する
    {
        const v = input.value
        const f = new Function( 'return ' + v )
        if(input) input.value = f().toString() 
    }
}

const input = <HTMLInputElement>document.querySelector( 'input' )