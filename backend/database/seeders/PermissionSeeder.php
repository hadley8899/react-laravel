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
            'update_company',
            'update_appointment_settings',
            'update_invoice_settings',
            'view_settings',

            // Appointments
            'view_appointments',
            'update_appointments',
            'create_appointments',
            'delete_appointments',

            // Customers
            'view_customers',
            'update_customers',
            'create_customers',
            'delete_customers',

            // Invoices
            'view_invoices',
            'update_invoices',
            'create_invoices',
            'delete_invoices',

            // Vehicles
            'view_vehicles',
            'update_vehicles',
            'create_vehicles',
            'delete_vehicles',

            // Reports
            'view_reports',

            // Super Admin only
            'update_company_plan_settings', // can update plan, status, trial dates
            'switch_companies',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create the super admin role and assign all permissions
        $role = Role::create(['name' => 'Super Admin']);
        $role->givePermissionTo(Permission::all());

        // Create roles and assign permissions
        $role = Role::create(['name' => 'Admin']);
        $role->givePermissionTo(array_diff($permissions, [
            'update_company_plan_settings', // Exclude plan settings for Admin
            'switch_companies', // Exclude switching companies for Admin
        ]));

        $role = Role::create(['name' => 'Manager']);
        $role->givePermissionTo([
            'view_users',
            'view_settings',
            'update_appointment_settings',
            'update_invoice_settings',
            'view_reports',

            // Appointments
            'view_appointments',
            'create_appointments',
            'update_appointments',
            'delete_appointments',

            // Customers
            'view_customers',
            'create_customers',
            'update_customers',

            // Invoices
            'view_invoices',
            'create_invoices',
            'update_invoices',

            // Vehicles
            'view_vehicles',
            'create_vehicles',
            'update_vehicles',
        ]);

        $role = Role::create(['name' => 'User']);
        $role->givePermissionTo([
            'view_settings',
            'view_reports',

            // Appointments
            'view_appointments',
            'create_appointments',
            'update_appointments',

            // Customers
            'view_customers',

            // Invoices
            'view_invoices',

            // Vehicles
            'view_vehicles',
        ]);
    }
}
