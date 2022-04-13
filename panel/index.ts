import fetch from 'node-fetch';
import load from '../structures/settings';
import { Response } from '../structures';
import { Server, User } from '../structures/panel';

const { pterodactyl } = load();

async function _fetch<T = {}>(
    method: string,
    path: string,
    data?: object
): Promise<Response<T>> {
    const body = data ? JSON.stringify(data) : undefined;

    console.log(`${pterodactyl.url}/api/application${path}`);
    const res = await fetch(`${pterodactyl.url}/api/application${path}`, {
        method,
        body,
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${pterodactyl.key}`
        }
    });

    if (res.status === 204) return {} as Response<T>;
    if ([200, 201, 202].includes(res.status)) return await res.json();
    if (res.status < 500) await res.json().then(d => { throw new Error(d.errors[0].code) });
    throw new Error(`Pterodactyl could not be contacted (status: ${res.status}).`);
}

export async function fetchOrCreateUser(
    username: string,
    email: string,
    password: string
    ): Promise<User> {
    let user = await _fetch<User>('GET', `/users?filter[email]=${email}`).catch(()=>{});
    if (user) return user.attributes!;

    user = await _fetch('POST', '/users', {
        username,
        email,
        first_name: username,
        last_name: username,
        password
    });
    return user.attributes!;
}

export async function fetchServers(email: string): Promise<Server[]> {
    const servers = await _fetch<Server>('GET', `/users?filter=[email]=${email}&include=servers`);
    return servers.data!;
}

export default {
    fetchOrCreateUser,
    fetchServers
}
