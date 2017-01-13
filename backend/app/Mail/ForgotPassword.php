<?php

namespace onestopcore\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use onestopcore\User;

class ForgotPassword extends Mailable {
    use Queueable, SerializesModels;

    protected $user;
    protected $token;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(User $user, $token) {
        $this->user = $user;
        $this->token = $token;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build() {
        $reset_link = config('frontend.url') . '/reset_password?token=' . $this->token;
        return $this->view('emails.auth.forgot_password')
            ->with('user', $this->user)
            ->with('reset_link', $reset_link);
    }
}
