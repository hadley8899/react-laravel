<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VariableResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'friendly_name' => $this['friendly_name'],
            'key' => $this['key'],   // already prefixed, use directly in {{ }}
            'type' => $this['type'],
            'scope' => $this['scope'], // 'company' | 'customer' (handy for grouping)
        ];
    }
}
