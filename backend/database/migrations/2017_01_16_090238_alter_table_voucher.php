<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableVoucher extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('voucher', function (Blueprint $table) {
            $table->renameColumn('startdate', 'start_date');
            $table->renameColumn('enddate', 'end_date');
            $table->renameColumn('maxclaim', 'max_claim');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('voucher', function (Blueprint $table) {
            $table->renameColumn('start_date', 'startdate');
            $table->renameColumn('end_date', 'enddate');
            $table->renameColumn('max_claim', 'maxclaim');
            $table->dropColumn(['created_at', 'updated_at']);
        });
    }
}
