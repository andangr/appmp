<?php

namespace onestopcore\Transformers;

use League\Fractal\TransformerAbstract;
use onestopcore\User;

class UserTransformer extends TransformerAbstract {
    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform(User $user) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => ($user->role == null) ? '' : $user->role,
        ];
    }
}
