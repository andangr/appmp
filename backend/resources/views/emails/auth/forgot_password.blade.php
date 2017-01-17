@extends('layout.email_template')
@section('content')
<table style="width: auto; max-width: 570px; margin: 0 auto; padding: 0;" align="center" width="570" cellpadding="0" cellspacing="0">
    <tr>
        <td style="font-family: Arial, &#039;Helvetica Neue&#039;, Helvetica, sans-serif; padding: 35px;">
            <!-- Greeting -->
            <h1 style="margin-top: 0; color: #2F3133; font-size: 19px; font-weight: bold; text-align: left;">
                        Hello  {{ $user->name }}!
            </h1>

            <!-- Intro -->
                <p style="margin-top: 0; color: #74787E; font-size: 16px; line-height: 1.5em;">
                    You are receiving this email because we received a forgot password request for your account.
                </p>

                <p>
                    This is your reset link : <a href={{ $reset_link}} target="_blank">{{ $reset_link }}</a>
                </p>

            <!-- Outro -->
                <p style="margin-top: 0; color: #74787E; font-size: 16px; line-height: 1.5em;">
                    If you did not make this change, please contact administrator.
                </p>

            <!-- Salutation -->
            <p style="margin-top: 0; color: #74787E; font-size: 16px; line-height: 1.5em;">
                Regards,<br>administrator
            </p>

        </td>
    </tr>
</table>
@endsection