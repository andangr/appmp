<?php

namespace onestopcore\Http\Controllers\Api\Sessions;

use Illuminate\Http\Request;
use onestopcore\Http\Controllers\Controller;
use onestopcore\User;

class ApiSocialLoginController extends Controller {
    public function socialLogin(Request $request) {
        $user = User::where('email', '=', $request->email)->first();
        if ($user == null) {
            $user = $this->register($request);
        }
        return $this->sendResponse($user);
    }

    protected function register(Request $request) {
        return User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
    }

    protected function sendResponse(User $user) {
        $token = $user->createToken('social')->accessToken;
        return response()->json(['code' => 200, 'error' => false, 'message' => 'Success login', 'access_token' => $token], 200);
    }
}
