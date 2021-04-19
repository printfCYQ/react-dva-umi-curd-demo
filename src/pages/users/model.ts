import { Effect, Reducer, Subscription } from 'umi';
import { getRemoteList, edit, del, add } from './service'
import { message } from 'antd'
import { SingleUserModelState } from './data.d'

export interface UserModelState {
    data: SingleUserModelState[],
    meta: {
        total: number,
        per_page: number,
        page: number,
    }
}

export interface UserModelType {
    namespace: 'users';
    state: UserModelState;
    effects: {
        getRemote: Effect;
        edit: Effect;
        del: Effect;
        add: Effect;
    };
    reducers: {
        getList: Reducer<UserModelState>;
    };
    subscriptions: { setup: Subscription };
}

const UserModel: UserModelType = {
    namespace: 'users',

    state: {
        data: [],
        meta: {
            total: 1,
            per_page: 5,
            page: 1
        }
    },

    effects: {
        *getRemote(action, { put, call }) {
            const data = yield call(getRemoteList)

            yield put({
                type: "getList",
                payload: data
            })
        },

        *edit({ payload: { id, values } }, { put, call }) {
            const data = yield call(edit, { id, values })
            console.log(data)
            if (data) {
                message.success('编辑成功')
                yield put({
                    type: "getRemote"
                })
            } else {
                message.error('编辑失败')
            }

        },

        *add({ payload: { values } }, { put, call }) {
            const data = yield call(add, { values })
            console.log(data)

            if (data) {
                message.success('添加成功')
                yield put({
                    type: "getRemote"
                })
            } else {
                message.error('添加失败')
            }
        },

        *del({ payload: { id } }, { put, call }) {
            const data = yield call(del, { id })
            console.log(data)

            if (data) {
                message.success('删除成功')
                yield put({
                    type: "getRemote"
                })
            } else {
                message.error('删除失败')
            }
        },
    },
    reducers: {
        getList(state, { payload }) {
            return payload
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/users') {
                    dispatch({
                        type: 'getRemote',
                    });
                }
            });
        },
    },
};

export default UserModel;
