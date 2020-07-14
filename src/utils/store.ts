import engine from 'store/src/store-engine';

const localStorage = require('store/storages/localStorage');

const localStorages = [localStorage];

export const localStore: StoreJsAPI = engine.createStore(localStorages);

// ########localStore###########
/**
 * 保存数据
 * @param key
 * @param value
 */
export const localSave = (key: string, value: any) => {
  localStore.set(key, value);
};

/**
 * 获取值
 * @param key
 */
export const localGet = (key: string) => localStore.get(key);

/**
 * 删除数据
 */
export const localRemove = (key: string) => {
  localStore.remove(key);
};

/**
 * 删除所有
 */
export const localClearAll = () => {
  localStore.clearAll();
};
