<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class PortalController extends Controller
{
    public function __construct()
    {
        $this->middleware('signed');
    }

    public function __invoke(User $user, Request $request)
    {
        abort_if($request->missing('cid'), 401);
        $cid = $request->get('cid');

        abort_unless(Cache::has($cid), 401);

        $cache = Cache::get($cid);

        abort_unless(isset($cache['user_id'], $cache['ip']), 401);

        abort_if($cache['user_id'] !== $user->id && $cache['ip'] !== \request()->ip(), 401);

        Cache::forget($cid);

        Auth::guard()->login($user);

        return redirect(RouteServiceProvider::HOME);
    }
}
