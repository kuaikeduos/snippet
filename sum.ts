/**
 * [功能说明:] 数组求和(array sum)
 * 
 * [用例:] sum([1, 2, 3]) // => 6
 * 
 * [参数:] @param arr 包含数字的数组
 * [返回值:] @returns 数组元素之和
 */
function sum(arr: Array<number>): number {
  return arr.reduce((a, b) => a + b, 0);
}