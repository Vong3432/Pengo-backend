import User from "App/Models/User";

export interface ICreateUserData {
    avatar: string,
    phone: string,
    roleId: number,
    email: string,
    username: string,
    password: string
}

export interface IUpdateUserData {
    avatar?: string,
    phone?: string,
    roleId?: number,
    email?: string,
    username?: string,
    password?: string
}

export interface ICreateFounderData {
    avatar: string,
    phone: string,
    roleId: number,
    email: string,
    username: string,
    password: string
}

export interface IUpdateFounderData {
    avatar?: string,
    phone?: string,
    roleId?: number,
    email?: string,
    username?: string,
    password?: string
}

export interface ICreateStaffData {
    avatar: string,
    phone: string,
    roleId: number,
    email: string,
    username: string,
    password: string
}

export interface IUpdateStaffData {
    avatar?: string,
    phone?: string,
    roleId?: number,
    email?: string,
    username?: string,
    password?: string
}

export interface IUser {
    user: User
}