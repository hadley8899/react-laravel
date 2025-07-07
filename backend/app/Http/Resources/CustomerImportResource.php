<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerImportResource extends JsonResource
{
    /** @inheritDoc */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'filename' => $this->filename,
            'status' => $this->status,
            'total_rows' => $this->total_rows,
            'imported_rows' => $this->imported_rows,
            'failed_rows' => $this->failed_rows,
            'created_at' => $this->created_at,
            'started_at' => $this->started_at,
            'finished_at' => $this->finished_at,
            'meta' => $this->meta,
        ];
    }
}
