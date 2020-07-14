import request from '@/utils/request';
import { TaskType } from '@/models/task';

export interface ListParamsType {
  type?: number | string;
  page?: number | string;
  size?: number | string;
  startDate?: string;
  endDate?: string;
}

export interface DeleteParamsType {
  type?: number | string;
}

export async function requestTaskList(params: ListParamsType): Promise<any> {
  return request('/item', {
    method: 'GET',
    params,
  });
}

export async function requestStatistics(): Promise<any> {
  return request('/item/statistics');
}

export async function deleteTask(id: number): Promise<any> {
  return request(`/item/${id}`, {
    method: 'DELETE',
  });
}

export async function deleteTasks(params: DeleteParamsType): Promise<any> {
  return request('/item/delete', {
    method: 'DELETE',
    params,
  });
}

export async function updateTask(data: TaskType) {
  const { id } = data;
  return request(`/item/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function addTask(data: TaskType) {
  return request('/item', {
    method: 'POST',
    data,
  });
}
