<?php

namespace onestopcore\Http\Controllers\Api;

use DB;
use Illuminate\Http\Request;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use onestopcore\Http\Controllers\Controller;
use onestopcore\Transformers\UserTransformer;
use onestopcore\User;
use Validator;

class ApiUsersController extends Controller {
    public function index() {
        $paginator = User::paginate(10);
        $users = $paginator->getCollection();

        return fractal()
            ->collection($users, new UserTransformer())
            ->paginateWith(new IlluminatePaginatorAdapter($paginator))
            ->serializeWith(new \League\Fractal\Serializer\ArraySerializer())
            ->toArray();
    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|unique:users',
        ]);

        if ($validator->fails()) {
            return response()->json(['code' => 200, 'error' => true, 'message' => 'Email sudah terdaftar'], 200);
        }

        DB::beginTransaction();
        try {
            User::create($request->all());
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['code' => 200, 'error' => true, 'message' => 'Gagal menyimpan user'], 200);
        }

        DB::commit();
        return response()->json(['code' => 200, 'error' => false, 'message' => 'Berhasil menyimpan user'], 200);
    }

    public function update(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|unique:users,email,' . $id,
        ]);
        if ($validator->fails()) {
            return response()->json(['code' => 200, 'error' => true, 'message' => 'Email sudah terdaftar'], 200);
        }
        \Log::info($request->get('password'));
        DB::beginTransaction();
        try {
            $user = User::find($id);
            if ($request->get('password') != '') {
                $request->merge([
                    'password' => bcrypt($request->get('password')),
                ]);
            }
            $user->update($request->all());

        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['code' => 200, 'error' => true, 'message' => 'Gagal mengubah user'], 200);
        }
        DB::commit();
        return response()->json(['code' => 200, 'error' => false, 'message' => 'Berhasil mengubah user'], 200);
    }

    public function destroy($id) {
        DB::beginTransaction();
        try {
            User::findOrFail($id)->delete();
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['code' => 200, 'error' => true, 'message' => 'Gagal menghapus user'], 200);
        }
        DB::commit();
        return response()->json(['code' => 200, 'error' => false, 'message' => 'Berhasil menghapus user'], 200);
    }

}
