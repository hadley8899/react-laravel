<?php

namespace App\Policies;

use App\Models\MediaAsset;
use App\Models\User;

class MediaAssetPolicy
{
    /* --------------------------------------------------------------
     |  View
     |-------------------------------------------------------------- */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_media') || $user->hasPermissionTo('manage_media');
    }

    public function view(User $user, MediaAsset $asset): bool
    {
        return $asset->company_id === $user->company_id
            && ($user->hasPermissionTo('view_media') || $user->hasPermissionTo('manage_media'));
    }

    /* --------------------------------------------------------------
     |  Create / Upload
     |-------------------------------------------------------------- */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_media') || $user->hasPermissionTo('manage_media');
    }

    /* --------------------------------------------------------------
     |  Update (rename, move, alt text)
     |-------------------------------------------------------------- */
    public function update(User $user, MediaAsset $asset): bool
    {
        return $asset->company_id === $user->company_id
            && ($user->hasPermissionTo('update_media') || $user->hasPermissionTo('manage_media'));
    }

    /* --------------------------------------------------------------
     |  Delete / Restore
     |-------------------------------------------------------------- */
    public function delete(User $user, MediaAsset $asset): bool
    {
        return $asset->company_id === $user->company_id
            && ($user->hasPermissionTo('delete_media') || $user->hasPermissionTo('manage_media'));
    }

    public function restore(User $user, MediaAsset $asset): bool
    {
        return $this->update($user, $asset);
    }

    public function forceDelete(User $user, MediaAsset $asset): bool
    {
        return $this->delete($user, $asset);
    }
}
