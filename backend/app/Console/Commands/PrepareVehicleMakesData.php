<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class PrepareVehicleMakesData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vehicle:prepare-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Copy vehicle data CSV to database/data directory for seeding';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $sourceFile = base_path('data/vehicles_data.csv');
        $targetDir = database_path('data');
        $targetFile = $targetDir . '/vehicles_data.csv';
        
        // Check if source file exists
        if (!File::exists($sourceFile)) {
            $this->error("Source file not found: $sourceFile");
            return 1;
        }
        
        // Create target directory if it doesn't exist
        if (!File::exists($targetDir)) {
            File::makeDirectory($targetDir, 0755, true);
        }
        
        // Copy the file
        File::copy($sourceFile, $targetFile, true);
        
        $this->info("Successfully copied vehicle data to database/data directory.");
        $this->info("You can now run 'php artisan db:seed --class=VehicleMakeModelSeeder' to import the data.");
        
        return 0;
    }
}
