// 全局常量

console.log(ENV);

let _preURL: string = 'http://127.0.0.1:7009';
let _staticURL: string = 'http://127.0.0.1:7009';
if (ENV === 'dev') {
  _preURL = 'http://127.0.0.1:7009';
} else if (ENV === 'prod') {
  _preURL = 'http://todo.api.oceanover.top';
  _staticURL = 'http://todo.file.oceanover.top';
}
console.log('### URL ###');
console.log(_preURL);

export const preURL = _preURL;
export const staticURL = _staticURL;
export const apiURL = `${_preURL}/api`;
export const uploadURL = `${apiURL}/upload`;
