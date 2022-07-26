class CommonUtil {

  // 配列をint型にする
  static binaryArrayToInt(arr)
  {
    let int;
    for (const el of arr)
    {
      int = int << 8 | el;
    }
    return int;
  }

  // 配列を１６進数文字列にする
  static binaryArrayToHex(arr)
  {
    let str = '';
    for(const el of arr)
    {
      str += el.toString('16').padStart(2, '0')
    }
    return str.toUpperCase();
  }

  static StringTocharCodes(str)
  {
    let charCodes = "";
    for (let i = 0; i < str.length; i++)
    {
      const char = str.charCodeAt(i);
      const front = (char & 0xFF00) >> 8;
      const back = char & 0x00FF;
      charCodes += back.toString(16) + front.toString(16);
    }
    console.log(charCodes);
    return charCodes.toUpperCase();
  }

  static nunberToHex(value)
  {
    return `0x${value.toString(16).toUpperCase().padStart(6, '0')}`;
  }
}
