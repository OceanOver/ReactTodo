import { UserStateType } from './user';
import { LoginStateType } from './login';
import { TaskStateType } from './task';

export { UserStateType as UserModelState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    user?: boolean;
    login?: boolean;
    task?: boolean;
  };
}

export interface ConnectState {
  loading: Loading;
  user: UserStateType;
  login: LoginStateType;
  task: TaskStateType;
}
