<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableProduct2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('product', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->boolean('is_active')->default(false);;
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
         Schema::table('product', function (Blueprint $table) {
            $table->string('status', 100)->default(0);
            $table->dropColumn(['created_at', 'updated_at', 'is_active']);
        });
    }
}
