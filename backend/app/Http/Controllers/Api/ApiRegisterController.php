<?php

namespace onestopcore\Http\Controllers\Api;

use onestopcore\Http\Controllers\Controller;
use Illuminate\Http\Request;
use onestopcore\User;
use Validator;
use Illuminate\Support\MessageBag;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

class ApiRegisterController extends Controller
{
    /**
     * @var object
     */
    private $client;

    /**
     * DefaultController constructor.
     */
    public function __construct()
    {
        $this->client = DB::table('oauth_clients')->where('id', 2)->first();
    }

    /**
     * @param Request $request
     * @return mixed
     */
    protected function register(Request $request)
    {
        
        $validator = $this->validator($request->all());

       if ($validator->fails()) {
           return array(
               'code' => 201,
               'message' => 'Error whle registering user, please try again or contact adminstrator. '
           );
       }

       $registerUser = $this->create($request->all());

        return $this->successResponse('User Registration is successful. Please Login with your account.');
    }
    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
    }

}
