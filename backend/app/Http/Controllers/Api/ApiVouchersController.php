<?php

namespace onestopcore\Http\Controllers\Api;

use DB;
use Illuminate\Http\Request;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use onestopcore\Http\Controllers\Controller;
use onestopcore\Transformers\VoucherTransformer;
use onestopcore\Voucher;

class ApiVouchersController extends Controller {
    public function index(Request $request) {
        $paginator = Voucher::paginate(3);
        $vouchers = $paginator->getCollection();

        return fractal()
            ->collection($vouchers, new VoucherTransformer())
            ->paginateWith(new IlluminatePaginatorAdapter($paginator))
            ->serializeWith(new \League\Fractal\Serializer\ArraySerializer())
            ->toArray();
    }

    public function store(Request $request) {
        DB::beginTransaction();
        try {
            $request->merge([
                'id' => $this->getNextStatementId(),
                'start_date' => new \Carbon\Carbon($request->get('start_date')),
                'end_date' => new \Carbon\Carbon($request->get('end_date')),
            ]);
            Voucher::create($request->all());
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['code' => 200, 'error' => true, 'message' => 'Gagal menyimpan voucher'], 200);
        }

        DB::commit();
        return response()->json(['code' => 200, 'error' => false, 'message' => 'Berhasil menyimpan voucher'], 200);
    }

    public function update(Request $request, $id) {
        DB::beginTransaction();
        try {
            $voucher = Voucher::findOrFail($id);
            $request->merge([
                'start_date' => new \Carbon\Carbon($request->get('start_date')),
                'end_date' => new \Carbon\Carbon($request->get('end_date')),
            ]);
            $voucher->update($request->all());

        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['code' => 200, 'error' => true, 'message' => 'Gagal menyimpan voucher'], 200);
        }
        DB::commit();
        return response()->json(['code' => 200, 'error' => false, 'message' => 'Berhasil mengubah voucher'], 200);
    }

    public function destroy(Request $request, $id) {
        DB::beginTransaction();
        try {
            Voucher::findOrFail($id)->delete();
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['code' => 200, 'error' => true, 'message' => 'Gagal menghapus voucher'], 200);
        }
        DB::commit();
        return response()->json(['code' => 200, 'error' => false, 'message' => 'Berhasil menghapus voucher'], 200);
    }

    public function getNextStatementId() {
        $next_id = DB::select("select nextval('voucher_id_seq')");
        return intval($next_id['0']->nextval);
    }
}
