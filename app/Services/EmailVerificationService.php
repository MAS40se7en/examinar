<?php 

namespace App\Services;

use Illuminate\Support\Facades\Http;

class EmailVerificationService
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = env('HUNTER_API_KEY'); // Store your API key in .env
    }

    public function verifyEmail($email)
    {
        try {
            // Build the URL with query parameters
            $url = 'https://api.hunter.io/v2/email-verifier';

            // Make the GET request with query parameters
            $response = Http::get($url, [
                'email' => $email,
                'api_key' => $this->apiKey,
            ]);

            $responseData = $response->json();

            if ($response->successful()) {
                return $responseData;
            } else {
                return ['success' => false, 'message' => $responseData['message'] ?? 'Error occurred'];
            }
        } catch (\Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function findEmail($domain, $firstName, $lastName)
    {
        try {
            $url = 'https://api.hunter.io/v2/email-finder';
            $response = Http::get($url, [
                'domain' => $domain,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'api_key' => $this->apiKey,
            ]);

            $responseData = $response->json();

            if ($response->successful()) {
                return $responseData;
            } else {
                return ['success' => false, 'message' => $responseData['message'] ?? 'Error occurred'];
            }
        } catch (\Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
