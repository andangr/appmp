<?php

namespace onestopcore\Http\Controllers\Api;

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
}
