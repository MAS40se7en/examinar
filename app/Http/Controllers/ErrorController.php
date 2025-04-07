<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ErrorController extends Controller
{
    public function showErrorPage(Request $request) {
        $previousUrl = $request->input('prvs', url()->previous());

        return inertia('Error', [
            'prvs' => $previousUrl
        ]);
    }
}
