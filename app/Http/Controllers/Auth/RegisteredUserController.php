<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterUserRequest;
use App\Models\User;
use App\Services\EmailVerificationService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    protected $emailVerificationService;

    public function __construct(EmailVerificationService $emailVerificationService)
    {
        $this->emailVerificationService = $emailVerificationService;
    }

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function createAdmin(): Response
    {
        return Inertia::render('Auth/AdminRegister');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisterUserRequest $request): RedirectResponse
    {
        $request->validated();

        // Verify email validity
        $emailValidation = $this->emailVerificationService->verifyEmail($request->email);
        
        // Decode JSON if necessary
if (is_string($emailValidation)) {
    $emailValidation = json_decode($emailValidation, true);
}

// Check if decoding was successful and if 'data' exists
if (!is_array($emailValidation) || !isset($emailValidation['data'])) {
    return redirect()->back()->withErrors(['email' => 'There was an issue validating the email address. Please try again.']);
}

        if ($emailValidation['data']['result'] !== 'deliverable') {
            return redirect()->back()->withErrors(['email' => 'The email address is invalid.']);
        }

        Log::info('Email Validation Response: ', $emailValidation);


        $role = $request->input('role') === 'admin' ? 'admin' : 'user';

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $role,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }

    public function storeAdmin(RegisterUserRequest $request): RedirectResponse
    {
        $request->validated();

        $emailValidation = $this->emailVerificationService->verifyEmail($request->email);
        if ($emailValidation['data']['result'] !== 'deliverable') {
            return redirect()->back()->withErrors(['email' => 'The email address is invalid or not deliverable.']);
        }


        $role = 'admin';

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $role
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
