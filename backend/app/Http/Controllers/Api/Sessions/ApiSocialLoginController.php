<?php

namespace onestopcore\Http\Controllers\Api\Sessions;

use Illuminate\Http\Request;
use onestopcore\Http\Controllers\Controller;
use onestopcore\User;

class ApiSocialLoginController extends Controller {

    /**
     * Login with social media
     * @param  Request $request
     * @return mixed
     */
    public function socialLogin(Request $request) {
        $user = User::where('email', '=', $request->email)->first();
        if ($user == null) {
            $user = $this->register($request);
        }
        return $this->sendResponse($user);
    }

    /**
     * Register based on new data
     * @param  Request $request
     * @return User User object
     */
    protected function register(Request $request) {
        return User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
    }

    /**
     * Send access token
     * @param  User   $user
     * @return mixed
     */
    protected function sendResponse(User $user) {
        $token = $user->createToken('social')->accessToken;
        return response()->json(['code' => 200, 'error' => false, 'message' => 'Success login', 'access_token' => $token], 200);
    }
}
