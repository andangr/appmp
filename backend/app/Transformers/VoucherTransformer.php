<?php

namespace onestopcore\Transformers;

use League\Fractal\TransformerAbstract;
use onestopcore\Voucher;

class VoucherTransformer extends TransformerAbstract {
    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform(Voucher $item) {
        return [
            'id' => $item->id,
            'code' => $item->code,
            'name' => $item->name,
            'disc' => $item->disc,
            'start_date' => $item->start_date,
            'end_date' => $item->end_date,
            'max_claim' => $item->max_claim,
            'target_type' => $item->target_type,
            'is_active' => $item->is_active,
        ];
    }
}
