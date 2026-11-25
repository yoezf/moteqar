<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Receives the contact form from the landing page (same fields as the popup form).
 * POST /api/leads  (JSON)
 */
class LeadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // Honeypot: real visitors never fill this hidden field, bots usually do. Pretend success and store nothing.
        if ($request->filled('website')) {
            return response()->json(['ok' => true], 201);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160'],
            'company' => ['nullable', 'string', 'max:160'],
            'service' => ['required', Rule::in(array_keys(Lead::SERVICES))],
            'budget' => ['nullable', 'string', 'max:60'],
            'package' => ['nullable', 'string', 'max:60'],
            'details' => ['required', 'string', 'min:10', 'max:4000'],
        ]);

        Lead::create($data + ['source' => 'landing', 'status' => 'new']);

        return response()->json(['ok' => true], 201);
    }
}
