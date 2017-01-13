<?php

namespace onestopcore\Http\Controllers\Api;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Foundation\Auth\ResetsPasswords;

use onestopcore\Http\Controllers\Controller;

class ApiResetPasswordController extends Controller
{   
    use ResetsPasswords;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Reset the given user's password.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function resetPwd(Request $request)
    {
        $this->validate($request, $this->fieldRules(), $this->validationErrorMessages());

        $response = $this->broker()->reset(
            $this->credentials($request), function ($user, $password) {
                $this->resetPassword($user, $password);
            }
        );

        
        return $response == Password::PASSWORD_RESET
                    ? $this->sendSuccessResponse($response)
                    : $this->sendFailedResponse($request, $response);
    }

    /**
     * Get the password reset validation rules.
     *
     * @return array
     */
    protected function fieldRules()
    {
        return [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed',
        ];
    }

    /**
     * Get the response for a successful password reset.
     *
     * @param  string  $response
     * @return \Illuminate\Http\RedirectResponse
     */
    protected function sendSuccessResponse($response)
    {
        return response()->json([
                 'code' => 200,
                 'error' => false,
                 'message' => trans($response)], 200);
    }

    /**
     * Get the response for a failed password reset.
     *
     * @param  \Illuminate\Http\Request
     * @param  string  $response
     * @return \Illuminate\Http\RedirectResponse
     */
    protected function sendFailedResponse(Request $request, $response)
    {
        return response()->json([
                 'code' => 200,
                 'error' => true,
                 'message' => json_encode(trans($response))]);
    }

}
