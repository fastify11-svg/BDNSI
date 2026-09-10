# Non-Production Payment & SMS Provisioning Instructions

This document outlines the steps required to provision and mock Payment and SMS features for the BDNSI application in non-production environments (Local, Staging, Testing).

## 1. SMS Provisioning (Mocking)

To avoid sending real SMS messages and incurring costs during development or testing, the application is configured to automatically intercept SMS sending when the environment is non-production.

### How it Works
In `App\Lib\Helper::sendSms()`, the application checks the `APP_ENV` variable:
- If `APP_ENV=local` or `APP_ENV=testing`, the SMS is intercepted.
- Instead of triggering the SMS Gateway API, the SMS content is written directly to the Laravel log.

### Verification
1. Ensure your `.env` file contains:
   ```env
   APP_ENV=local
   ```
2. Trigger an action that sends an SMS (e.g., approving a center, student payment).
3. Open `storage/logs/laravel.log` and verify the output:
   ```log
   [YYYY-MM-DD HH:MM:SS] local.INFO: Mock SMS to 01700000000: Dear Student, your payment was successful...
   ```

## 2. Payment Gateway Provisioning (Sandbox)

The application supports multiple payment gateways (SSLCommerz, bKash). Instead of using `.env` variables, the credentials and environment mode are managed dynamically via the database `payment_gateways` table.

### Configuration Steps
To use a sandbox payment gateway:

1. **Activate the Gateway in Sandbox Mode**:
   Access the database directly (or via the Admin Payment Settings UI if available) and update the target gateway in the `payment_gateways` table:
   - `is_active` = `1` (true)
   - `is_sandbox` = `1` (true)

2. **Configure Sandbox Credentials**:
   *For SSLCommerz:*
   - `store_id`: Enter your SSLCommerz sandbox Store ID (e.g., `testbox`).
   - `store_password`: Enter your SSLCommerz sandbox Store Password.

   *For bKash:*
   - `app_key`, `app_secret`, `username`, `password`: Enter your bKash Tokenized Checkout sandbox credentials.

3. **Verify Sandbox URLs**:
   The `PaymentController` is hardcoded to automatically switch endpoints when `is_sandbox` is true.
   - SSLCommerz Sandbox: `https://sandbox.sslcommerz.com/gwprocess/v3/api.php`
   - bKash Sandbox: `https://tokenized.sandbox.bka.sh/v1.2.0-beta`

### Testing a Mock Payment
1. Ensure the gateway is active and sandbox mode is enabled.
2. Initiate a payment from the Center Hub or Student Portal.
3. You will be redirected to the provider's sandbox portal. Use the provider's provided test cards/accounts to simulate successful and failed payments.
4. Verify that the application receives the success/fail IPN callback correctly and updates the database records.
