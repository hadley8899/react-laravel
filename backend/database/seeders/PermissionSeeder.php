<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /**
     * Seed the permissions and roles.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // User management
            'manage_users',
            'view_users',

            // Settings
            'manage_settings',
            'view_settings',

            // Reports
            'manage_reports',
            'view_reports',

            // Appointments
            'manage_appointments',
            'view_appointments',

            // Customers
            'manage_customers',
            'view_customers',

            // Invoices
            'manage_invoices',
            'view_invoices',

            // Vehicles
            'manage_vehicles',
            'view_vehicles',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create the super admin role and assign all permissions
        $role = Role::create(['name' => 'Super Admin']);
        $role->givePermissionTo(Permission::all());

        // Create roles and assign permissions
        $role = Role::create(['name' => 'Admin']);
        $role->givePermissionTo(Permission::all());

        $role = Role::create(['name' => 'Manager']);
        $role->givePermissionTo([
            'view_users',
            'manage_settings', 'view_settings',
            'manage_reports', 'view_reports',
            'manage_appointments', 'view_appointments',
            'manage_customers', 'view_customers',
            'manage_invoices', 'view_invoices',
            'manage_vehicles', 'view_vehicles',
        ]);

        $role = Role::create(['name' => 'User']);
        $role->givePermissionTo([
            'view_settings',
            'view_reports',
            'view_appointments', 'manage_appointments',
            'view_customers',
            'view_invoices',
            'view_vehicles',
        ]);
    }
}
