<?php

namespace onestopcore\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use onestopcore\User;

class ResetNotification extends Mailable {
    use Queueable, SerializesModels;

    protected $user;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(User $user) {
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build() {
        return $this->view('emails.auth.reset_password_notification')
            ->with('user', $this->user)
            ->with('homepage', config('frontend.url'));
    }
}
