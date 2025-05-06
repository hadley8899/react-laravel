<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'description' => $this->description,
            'quantity' => (float)$this->quantity,
            'unit' => $this->unit,
            'unit_price' => (float)$this->unit_price,
            'amount' => (float)$this->amount,
        ];
    }
}
