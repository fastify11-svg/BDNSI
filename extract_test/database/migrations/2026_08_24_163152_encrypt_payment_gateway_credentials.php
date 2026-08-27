<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;

class EncryptPaymentGatewayCredentials extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $columns = ['store_id', 'store_password', 'signature_key', 'app_key', 'app_secret', 'username', 'password'];
        foreach ($columns as $column) {
            DB::statement("ALTER TABLE payment_gateways MODIFY {$column} TEXT");
        }

        $gateways = DB::table('payment_gateways')->get();
        foreach ($gateways as $gateway) {
            $updateData = [];
            
            $fields = ['store_id', 'store_password', 'signature_key', 'app_key', 'app_secret', 'username', 'password'];
            foreach ($fields as $field) {
                if (!empty($gateway->$field) && !Str::startsWith($gateway->$field, 'eyJpdiI6')) {
                    try {
                        $updateData[$field] = Crypt::encryptString($gateway->$field);
                    } catch (\Exception $e) {
                        // Already encrypted or invalid
                    }
                }
            }

            if (!empty($updateData)) {
                DB::table('payment_gateways')->where('id', $gateway->id)->update($updateData);
            }
        }
    }

    public function down()
    {
        $gateways = DB::table('payment_gateways')->get();
        foreach ($gateways as $gateway) {
            $updateData = [];
            
            $fields = ['store_id', 'store_password', 'signature_key', 'app_key', 'app_secret', 'username', 'password'];
            foreach ($fields as $field) {
                if (!empty($gateway->$field)) {
                    try {
                        $updateData[$field] = Crypt::decryptString($gateway->$field);
                    } catch (\Exception $e) {
                        // Already decrypted or invalid
                    }
                }
            }

            if (!empty($updateData)) {
                DB::table('payment_gateways')->where('id', $gateway->id)->update($updateData);
            }
        }

        $columns = ['store_id', 'store_password', 'signature_key', 'app_key', 'app_secret', 'username', 'password'];
        foreach ($columns as $column) {
            DB::statement("ALTER TABLE payment_gateways MODIFY {$column} VARCHAR(255)");
        }
    }
}
