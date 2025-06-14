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
    public function run(): void
    {
        $csvFile = database_path('data/vehicles_data.csv');

        if (!file_exists($csvFile)) {
            Log::error("CSV file not found: $csvFile");
            $this->command->error("CSV file not found: $csvFile");
            return;
        }

        if (!file_exists(database_path('data'))) {
            mkdir(database_path('data'), 0755, true);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('vehicle_models')->truncate();
        DB::table('vehicle_makes')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $this->command->info('Importing vehicle makes and models...');
        $this->command->info('This may take a while...');

        $makes = [];
        $makeModels = [];

        if (($handle = fopen($csvFile, 'r')) !== false) {
            $header = fgetcsv($handle, 0, ';');
            $col = function ($name) use ($header) {
                return array_search($name, $header);
            };

            $imported = 0;

            while (($data = fgetcsv($handle, 0, ';')) !== false) {
                if (count($data) < 2 || empty($data[$col('Make')]) || empty($data[$col('Model')])) {
                    continue;
                }

                $make = trim($data[$col('Make')]);
                $model = trim($data[$col('Model')]);

                $makeKey = strtolower($make);
                $modelKey = strtolower($model);
                $pairKey = $makeKey . '|' . $modelKey;
                if (isset($makeModels[$pairKey])) {
                    continue;
                }

                if (!isset($makes[$make])) {
                    $makeRecord = VehicleMake::query()->create(['name' => $make]);
                    $makes[$make] = $makeRecord->id;
                }

                try {
                    VehicleModel::query()->create([
                        'vehicle_make_id' => $makes[$make],
                        'name' => $model,
                        'fuel_type' => $data[$col('Fuel Type')] ?? null,
                        'fuel_type_1' => $data[$col('Fuel Type1')] ?? null,
                        'engine_description' => $data[$col('Engine descriptor')] ?? null,
                        'drive' => $data[$col('Drive')] ?? null,
                        'engine_displacement' => $data[$col('Engine displacement')] ?? null,
                        'cylinders' => is_numeric($data[$col('Cylinders')] ?? null) ? (int)$data[$col('Cylinders')] : null,
                        'combined_mpg' => is_numeric($data[$col('Combined Mpg For Fuel Type1')] ?? null) ? (float)$data[$col('Combined Mpg For Fuel Type1')] : null,
                        'base_model' => isset($data[$col('baseModel')]) ? (strtolower($data[$col('baseModel')]) === 'yes' ? 1 : 0) : null,
                        'start_stop' => isset($data[$col('Start-Stop')]) ? (strtolower($data[$col('Start-Stop')]) === 'yes' ? 1 : 0) : null,
                        'year' => is_numeric($data[$col('Year')] ?? null) ? (int)$data[$col('Year')] : null,
                        'transmission' => $data[$col('Transmission')] ?? null,
                    ]);
                } catch (Throwable $th) {
                    Log::error("Error inserting model '$model' for make '$make': " . $th->getMessage());
                    $this->command->error("Error inserting model '$model' for make '$make': " . $th->getMessage());
                    continue;
                }

                $makeModels[$pairKey] = true;
                $imported++;

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
