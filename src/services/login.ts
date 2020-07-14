import request from '@/utils/request';

export interface LoginParamsType {
  username: string;
  password: string;
}

export interface RegisterParamsType {
  username: string;
  password: string;
  rePasswd: string;
}

export async function requestLogin(params: LoginParamsType) {
  return request('/login', {
    method: 'POST',
    data: params,
  });
}

export async function requestRegister(params: RegisterParamsType) {
  return request('/register', {
    method: 'POST',
    data: params,
  });
}
