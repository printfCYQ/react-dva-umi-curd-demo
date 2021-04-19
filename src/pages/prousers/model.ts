import { Effect, Reducer, Subscription } from 'umi';
import { getRemoteList, del } from './service'
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
    namespace: 'prousers';
    state: UserModelState;
    effects: {
        getRemote: Effect;
        // edit: Effect;
        del: Effect;
        // add: Effect;
    };
    reducers: {
        getList: Reducer<UserModelState>;
    };
    subscriptions: { setup: Subscription };
}

const UserModel: UserModelType = {
    namespace: 'prousers',

    state: {
        data: [],
        meta: {
            total: 1,
            per_page: 5,
            page: 1
        }
    },

    effects: {
        *getRemote({ payload: { page, per_page } }, { put, call }) {
            const data = yield call(getRemoteList, { page, per_page })

            yield put({
                type: "getList",
                payload: data
            })
        },

        // *edit({ payload: { id, values } }, { put, call, select }) {
        //     const data = yield call(edit, { id, values })
        //     console.log(data)
        //     if (data) {
        //         message.success('编辑成功')
        //         const { page, per_page } = yield select((state: any) => {
        //             return state.prousers.meta
        //         })
        //         yield put({
        //             type: "getRemote",
        //             payload: {
        //                 page,
        //                 per_page
        //             }
        //         })
        //     } else {
        //         message.error('编辑失败')
        //     }

        // },

        // *add({ payload: { values } }, { put, call, select }) {
        //     const data = yield call(add, { values })
        //     console.log(data)

        //     if (data) {
        //         message.success('添加成功')
        //         const { page, per_page } = yield select((state: any) => {
        //             return state.prousers.meta
        //         })
        //         yield put({
        //             type: "getRemote",
        //             payload: {
        //                 page,
        //                 per_page
        //             }
        //         })
        //     } else {
        //         message.error('添加失败')
        //     }
        // },

        *del({ payload: { id } }, { put, call, select }) {
            const data = yield call(del, { id })
            console.log(data)

            if (data) {
                message.success('删除成功')

                const { page, per_page } = yield select((state: any) => {
                    return state.prousers.meta
                })
                yield put({
                    type: "getRemote",
                    payload: {
                        page,
                        per_page
                    }
                })
            } else {
                message.error('删除失败')
            }
        },
    },
    reducers: {
        getList(state: any, { payload }) {
            return payload
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!")
                if (pathname === '/prousers') {
                    dispatch({
                        type: 'getRemote',
                        payload: {
                            page: 1,
                            per_page: 5
                        }
                    });
                }
            });
        },
    },
};

export default UserModel;
