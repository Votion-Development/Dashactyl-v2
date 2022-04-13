import { Egg, Package, Resource } from '../structures';

function getDefaultEgg(): Egg {
    return {
        name: 'default egg',
        display: 'Default Egg',
        minimum:{
            memory: 100,
            disk: 100,
            cpu: 10
        },
        maximum:{
            memory: null,
            disk: null,
            cpu: null
        },
        info:{
            egg: 3,
            docker_image: 'quay.io/pterodactyl/core:java',
            startup: 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -Dterminal.jline=false -Dterminal.ansi=true -jar {{SERVER_JARFILE}}',
            environment:{
                SERVER_JARFILE: 'server.jar',
                BUILD_NUMBER: 'latest'
            },
            feature_limits:{
                databases: 1,
                backups: 1
            }
        },
        isDefault: true,
        createdAt: Date.now()
    }
}

function getDefaultPackage(): Package {
    return {
        name: 'default-package',
        display: 'Default Package',
        memory: 1024,
        disk: 1024,
        cpu: 100,
        servers: 1,
        cost: 50,
        isDefault: true,
        createdAt: Date.now()
    }
}

function getDefaultResouces(): Resource {
    return {
        memory: 1024,
        disk: 1024,
        cpu: 10,
        servers: 1,
        coins: 0
    }
}

export default {
    getDefaultEgg,
    getDefaultPackage,
    getDefaultResouces
}
