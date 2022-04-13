export interface Server {
    id: number;
    uuid: string;
    identifier: string;
    external_id: string;
    name: string;
    description: string | null;
    is_suspended: boolean;
    limits: { [key: string]: any };
    feature_limits: { [key: string]: any };
    user: number;
    node: number;
    alloction: number;
    nest: number;
    egg: number;
}

export interface User {
    id: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    language: string;
    external_id: string | null;
    root_admin: boolean;
}
