export interface Account {
    username:       string;
    email:          string; //!
    password:       string | null;
    avatar:         string;
    resources:      Resource;
    package:        string;
    referral:       string | null;
    permissions:    string[];

    /* for later v2.x release:
    suspended: boolean;
    twoFactor: ...
    lastLogin: number;
    */
}

export interface APIKey {
    code:           string;
    permissions:    string[];
    createdBy:      string;
    createdAt:      number;
    lastUsedAt:     number;
}

export interface Coupon {
    code:       string;
    uses:       number;
    expiresAt:  number | null;
    redeemed:   string[];
    resources:  Resource;
}

export interface Egg {
    name:               string;
    display:            string;
    minimum:{
        memory:         number;
        disk:           number;
        cpu:            number;
    }
    maximum:{
        memory:         number | null;
        disk:           number | null;
        cpu:            number | null;
    }
    info:{
        egg:            number;
        docker_image:   string;
        startup:        string;
        environment:    { [key: string]: string }
        feature_limits: { [key: string]: number }
    }
    isDefault:          boolean;
    createdAt:          number;
}

export interface Package {
    name:       string;
    display:    string;
    memory:     number;
    disk:       number;
    cpu:        number;
    servers:    number;
    cost:       number;
    isDefault:  boolean;
    createdAt:  number;
}

export interface PartialServer {
    id:             number;
    identifier:     string;
    name:           string;
    description:    string | null;
    suspended:      boolean;
}

export interface Referral {
    code:       string;
    referred:   string[];
}

export interface Resource {
    memory:     number;
    disk:       number;
    cpu:        number;
    servers:    number;
    coins:      number;
}

export interface Response<T> {
    object:         string;
    data?:          T[];
    attributes?:    T;
}

export interface Session {
    user:       Account;
    servers:    PartialServer[];
    type:       SessionType;
    isAdmin:    boolean;
}

export enum SessionType {
    None,
    Returning,
    NewAccount
}

export interface Settings {
    root:           string;
    api:{
        enabled:    boolean;
        endpoints:  string[];
        keys:       string[];
    }
    afk:{
        enabled:    boolean;
        coins:      number;
    }
    coupons:{
        enabled:    boolean;
    }
    renewal:{
        enabled:    boolean;
        duration:   number;
        suspend:    boolean;
        fee:        number;
    }
    servers:{
        enabled:    boolean;
    }
    users:{
        enabled:    boolean;
    }
}
