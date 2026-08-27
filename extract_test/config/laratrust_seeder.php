<?php

return [
    /**
     * Control if the seeder should create a user per role while seeding the data.
     */
    'create_users' => false,

    /**
     * Control if all the laratrust tables should be truncated before running the seeder.
     */
    'truncate_tables' => false,

    'roles_structure' => [
        'admin' => [
            'user' => 'c,r,u,d',
            'center' => 'c,r,u,d',
            'subject' => 'c,r,u,d',
            'session' => 'c,r,u,d',
            'student' => 'c,r,u,d',
            'result' => 'c,r,u,d',
            'team' => 'c,r,u,d',
            'sub-admin' => 'c,r,u,d',
            'exam' => 'c,r,u,d',
            'question' => 'c,r,u,d',
            'slider' => 'c,r,u,d',
            'notice' => 'c,r,u,d',
            'adminList' => 'c,r,u,d',
            'configDictionary' => 'c,r,u,d',
            'translation' => 'c,r,u,d',
            'sponsor' => 'c,r,u,d',
            'upazila-store' => 'c,r,u,d',
            'license' => 'c,r,u,d',
            'youtube-video' => 'c,r,u,d',
        ],
        'sub_admin' => [
            'student' => 'c,r,u',
            'result' => 'c,r,u',
        ],
    ],

    'permissions_map' => [
        'c' => 'create',
        'r' => 'read',
        'u' => 'update',
        'd' => 'delete',
    ],
];
