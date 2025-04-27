<?php

namespace Database\Seeders;

use App\Models\VehicleMake;
use App\Models\VehicleModel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class VehicleMakeModelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csvFile = database_path('data/vehicles_data.csv');

        if (!file_exists($csvFile)) {
            Log::error("CSV file not found: $csvFile");
            $this->command->error("CSV file not found: $csvFile");
            return;
        }

        // Create directory if it doesn't exist
        if (!file_exists(database_path('data'))) {
            mkdir(database_path('data'), 0755, true);
        }

        // Truncate tables to avoid duplicates
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('vehicle_models')->truncate();
        DB::table('vehicle_makes')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $this->command->info('Importing vehicle makes and models...');
        $this->command->info('This may take a while...');

        // Track unique makes and models to avoid duplicates
        $makes = [];
        $makeModels = [];

        // Open the CSV file
        if (($handle = fopen($csvFile, 'r')) !== false) {
            // Skip the header row
            fgetcsv($handle, 0, ';');

            $imported = 0;

            // Process each row
            while (($data = fgetcsv($handle, 0, ';')) !== false) {
                // Skip invalid rows
                if (count($data) < 2 || empty($data[0]) || empty($data[1])) {
                    continue;
                }

                $make = trim($data[0]);
                $model = trim($data[1]);

                // Skip if already processed this make-model pair
                $pairKey = $make . '|' . $model;
                if (isset($makeModels[$pairKey])) {
                    continue;
                }

                // Create make if it doesn't exist
                if (!isset($makes[$make])) {
                    $makeRecord = VehicleMake::query()->create(['name' => $make]);
                    $makes[$make] = $makeRecord->id;
                }

                try {
                    // Create model
                    VehicleModel::query()->create([
                        'vehicle_make_id' => $makes[$make],
                        'name' => $model
                    ]);
                } catch (Throwable $th) {
                    // Log the error and continue
                    Log::error("Error inserting model '$model' for make '$make': " . $th->getMessage());
                    $this->command->error("Error inserting model '$model' for make '$make': " . $th->getMessage());
                    continue;
                }

                $makeModels[$pairKey] = true;
                $imported++;

                // Show progress every 1000 records
                if ($imported % 1000 === 0) {
                    $this->command->info("Processed $imported records...");
                }
            }

            fclose($handle);

            $this->command->info("Import completed! Imported $imported unique make-model combinations.");
        } else {
            $this->command->error("Could not open the CSV file.");
        }
    }
}
