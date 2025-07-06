<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;

class CustomerImportTemplateExport implements FromArray
{
    public function array(): array
    {
        return [
            // Headings row – users may add *extra* custom-field columns if they like
            ['first_name', 'last_name', 'email', 'phone', 'address', 'status', 'tags'],
            // One example row
            ['John', 'Doe', 'john@example.com', '555-1234', '123 Main St', 'Active', 'VIP,New'],
        ];
    }
}
