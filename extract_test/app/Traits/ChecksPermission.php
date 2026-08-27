<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

trait ChecksPermission
{
    public function callAction($method, $parameters)
    {
        if (isset($this->mapActionPermission)) {
            $actionPermissionMap = $this->mapActionPermission;
        } else {
            if (isset($this->permissionPrefix)) {
                $resourceName = $this->permissionPrefix;
            } else {
                $fullClass = explode('\\', Route::currentRouteAction());
                $segments = explode('@', $fullClass[count($fullClass) - 1]);
                $resourceName = Str::of(str_replace('Controller', '', $segments[0]))
                    ->lower()
                    ->singular();
            }

            $actionPermissionMap = [
                'index' => $resourceName.'-read',
                'show' => $resourceName.'-read',
                'create' => $resourceName.'-create',
                'store' => $resourceName.'-create',
                'edit' => $resourceName.'-update',
                'update' => $resourceName.'-update',
                'destroy' => $resourceName.'-delete',
            ];

            if (isset($this->mapExtraActionPermission)) {
                $actionPermissionMap = array_merge($actionPermissionMap, $this->mapExtraActionPermission);
            }
        }

        if (! in_array($method, ($this->skipActions ?? []), true)) {
            static::abort($actionPermissionMap[$method]);
        }

        return $this->{$method}(...array_values($parameters));
    }

    protected static function abort($permission)
    {
        abort_if(! optional(Auth::guard('admin')->user())->isAbleTo($permission), config('laratrust.middleware.handlers.abort.code'), config('laratrust.middleware.handlers.abort.message'));
    }
}
