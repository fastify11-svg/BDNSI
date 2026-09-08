<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
class CommandCenterController extends Controller {
    public function index() { return response()->json(['status' => 'Command Center Active']); }
}
