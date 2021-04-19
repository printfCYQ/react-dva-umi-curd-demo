import { extend } from 'umi-request'
import { FormValues } from './data.d';

import { message } from 'antd'

const errorHandler = function (error: any) {
    console.log(error)
    if (error.response) {
        if (error.response.status > 400) {
            message.error(error.data.message ? error.data.message : error.data)
        }
    } else {
        message.error('Network Error')
    }
}

const extendRequest = extend({ errorHandler })

export const getRemoteList = async () => {
    return extendRequest('/api/users', {
        method: 'get'
    }).then(function (res) {
        return res
    }).catch(function (err) {
        console.log(err)
    })
}

export const edit = async ({ id, values }: { id: number, values: FormValues }) => {
    return extendRequest(`/api/users/${id}`, {
        method: 'put',
        data: values
    }).then(function () {
        return true
    }).catch(function () {
        return false
    })
}

export const add = async ({ values }: { values: FormValues }) => {
    return extendRequest(`/api/users`, {
        method: 'post',
        data: values
    }).then(function () {
        return true
    }).catch(function () {
        return false
    })
}

export const del = async ({ id }: { id: number }) => {
    return extendRequest(`/api/users/${id}`, {
        method: 'delete',
    }).then(function () {
        return true
    }).catch(function () {
        return false
    })
}