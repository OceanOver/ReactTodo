import request from '@/utils/request';

export interface ModifyPasswordProps {
  newPassword: string;
  password: string;
}

export interface HeaderProps {
  header: string;
}

export async function requestUserInfo(): Promise<any> {
  return request('/user/info');
}

export async function modifyPassword(params: ModifyPasswordProps) {
  return request('/user/modifyPassword', {
    method: 'POST',
    data: params,
  });
}

export async function uploadHeader(params: HeaderProps) {
  return request('/user/updateHeader', {
    method: 'PUT',
    data: params,
  });
}
