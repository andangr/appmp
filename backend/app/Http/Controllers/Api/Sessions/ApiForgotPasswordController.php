<?php

namespace onestopcore\Http\Controllers\Api\Sessions;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use onestopcore\Http\Controllers\Controller;
use onestopcore\Mail\ForgotPassword;
use onestopcore\User;

class ApiForgotPasswordController extends Controller {
    /**
     * Generate token and send reset link if email is registered
     * @param  Request $request
     * @return json
     */
    public function forgotPassword(Request $request) {
        $user = User::where('email', '=', $request->get('email'))->first();
        if ($user) {
            $token = app('auth.password.broker')->createToken($user);
            $this->sendEmail($user, $token);
            return response()->json([
                'code' => 200,
                'error' => false,
                'message' => 'Please check your email. We\'ve sent you the link for reset your password!'], 200);

        } else {
            return response()->json([
                'code' => 200,
                'error' => true,
                'message' => 'Your email is not registered',
            ]);
        }
    }

    /**
     * Sending email to user
     * @param  User   $user
     * @param  String $token Reset password token
     * @return mixed
     */
    public function sendEmail(User $user, $token) {
        return Mail::to($user)->send(new ForgotPassword($user, $token));
    }
}
