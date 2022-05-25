class CommonUtil {

  // 配列をint型にする
  static binaryArrayToInt(arr){
    let int;
    for (const el of arr)
    {
      int = int << 8 | el;
    }
    return int;
  }

  // 配列を１６進数文字列にする
  static binaryArrayToHex(arr){
    let str = '';
    for(const el of arr)
    {
      str += el.toString('16').padStart(2, '0')
    }
    return str.toUpperCase();
  }
}
