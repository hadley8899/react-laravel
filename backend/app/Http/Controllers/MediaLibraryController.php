<?php

namespace App\Http\Controllers;

use App\Models\MediaAsset;
use App\Models\MediaDirectory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Intervention\Image\ImageManager;

// composer require intervention/image ^3

class MediaLibraryController extends Controller
{
    /* -----------------------------------------------------------------
     |  Convenience
     |----------------------------------------------------------------- */
    private function company()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        return $user->company;           // adjust if your relationship differs
    }

    /* -----------------------------------------------------------------
     |  DIRECTORY ENDPOINTS
     |----------------------------------------------------------------- */

    /** GET /api/media/directories (flat list or tree) */
    public function listDirectories(): Response
    {
        $dirs = MediaDirectory::where('company_id', $this->company()->id)
            ->with('children')
            ->get();

        return response($dirs);
    }

    /** POST /api/media/directories */
    public function storeDirectory(Request $req): Response
    {
        $data = $req->validate([
            'name' => 'required|string|max:255',
            'parent_uuid' => 'nullable|uuid|exists:media_directories,uuid',
        ]);

        $parent = $data['parent_uuid']
            ? MediaDirectory::where('uuid', $data['parent_uuid'])
                ->where('company_id', $this->company()->id)
                ->firstOrFail()
            : null;

        $dir = MediaDirectory::create([
            'uuid' => (string)\Illuminate\Support\Str::uuid(),
            'company_id' => $this->company()->id,
            'parent_id' => $parent?->id,
            'created_by' => Auth::id(),
            'name' => $data['name'],
        ]);

        return response($dir, 201);
    }

    /** PATCH /api/media/directories/{uuid} */
    public function updateDirectory(Request $req, string $uuid): Response
    {
        $dir = MediaDirectory::where('uuid', $uuid)
            ->where('company_id', $this->company()->id)
            ->firstOrFail();

        $data = $req->validate([
            'name' => 'sometimes|string|max:255',
            'parent_uuid' => [
                'sometimes',
                'nullable',
                'uuid',
                Rule::notIn([$uuid]), // prevent setting parent to itself
            ],
        ]);

        if (isset($data['name'])) {
            $dir->name = $data['name'];
        }

        if (array_key_exists('parent_uuid', $data)) {
            $newParent = $data['parent_uuid']
                ? MediaDirectory::where('uuid', $data['parent_uuid'])
                    ->where('company_id', $this->company()->id)
                    ->firstOrFail()
                : null;

            $dir->parent_id = $newParent?->id;
        }

        $dir->save();

        return response($dir);
    }

    /** DELETE /api/media/directories/{uuid} (soft) */
    public function destroyDirectory(string $uuid): Response
    {
        $dir = MediaDirectory::where('uuid', $uuid)
            ->where('company_id', $this->company()->id)
            ->firstOrFail();

        $dir->delete(); // cascades via FK to children & assets
        return response()->noContent();
    }

    /* -----------------------------------------------------------------
     |  ASSET ENDPOINTS
     |----------------------------------------------------------------- */

    /** GET /api/media/assets */
    public function listAssets(Request $req): Response
    {
        $req->validate([
            'directory_uuid' => 'nullable|uuid',
            'search' => 'nullable|string|max:100',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $query = MediaAsset::where('company_id', $this->company()->id)
            ->latest('created_at');

        if ($req->directory_uuid) {
            $dir = MediaDirectory::where('uuid', $req->directory_uuid)
                ->where('company_id', $this->company()->id)
                ->firstOrFail();

            $query->where('directory_id', $dir->id);
        }

        if ($req->search) {
            $query->where(function ($q) use ($req) {
                $q->where('original_name', 'like', "%{$req->search}%")
                    ->orWhere('alt', 'like', "%{$req->search}%");
            });
        }

        $perPage = $req->per_page ?? 40;

        return response($query->paginate($perPage));
    }

    /** POST /api/media/assets (multipart/form-data) */
    public function uploadAsset(Request $req): Response
    {
        $data = $req->validate([
            'file' => 'required|file|max:51200', // ≤ 50 MB
            'directory_uuid' => 'nullable|uuid',
            'alt' => 'nullable|string|max:255',
        ]);

        $dir = $data['directory_uuid']
            ? MediaDirectory::where('uuid', $data['directory_uuid'])
                ->where('company_id', $this->company()->id)
                ->firstOrFail()
            : null;

        $file = $data['file'];

        // Build storage path: media/company-{id}/{uuid}.{ext}
        $uuid = (string)\Illuminate\Support\Str::uuid();
        $ext = $file->getClientOriginalExtension();
        $path = "company-{$this->company()->id}/{$uuid}.{$ext}";

        // Store original file
        $file->storeAs($path, '', ['disk' => 'media']); // 'media' disk in config/filesystems.php

        // Optional image dimensions (skip if not image)
        [$width, $height] = [null, null];
        if (str_starts_with($file->getMimeType(), 'image/')) {
            $manager = ImageManager::withDrivers(['gd']);
            $img = $manager->read($file->getPathname());
            $width = $img->width();
            $height = $img->height();
        }

        $asset = MediaAsset::create([
            'uuid' => $uuid,
            'company_id' => $this->company()->id,
            'directory_id' => $dir?->id,
            'uploaded_by' => Auth::id(),
            'filename' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'width' => $width,
            'height' => $height,
            'alt' => $data['alt'] ?? null,
        ]);

        return response($asset, 201);
    }

    /** PATCH /api/media/assets/{uuid} (rename, alt, move) */
    public function updateAsset(Request $req, string $uuid): Response
    {
        $asset = MediaAsset::where('uuid', $uuid)
            ->where('company_id', $this->company()->id)
            ->firstOrFail();

        $data = $req->validate([
            'alt' => 'sometimes|nullable|string|max:255',
            'directory_uuid' => 'sometimes|nullable|uuid',
        ]);

        if (array_key_exists('alt', $data)) {
            $asset->alt = $data['alt'];
        }

        if (array_key_exists('directory_uuid', $data)) {
            $newDir = $data['directory_uuid']
                ? MediaDirectory::where('uuid', $data['directory_uuid'])
                    ->where('company_id', $this->company()->id)
                    ->firstOrFail()
                : null;
            $asset->directory_id = $newDir?->id;
        }

        $asset->save();

        return response($asset);
    }

    /** DELETE /api/media/assets/{uuid} (soft delete) */
    public function destroyAsset(string $uuid): Response
    {
        $asset = MediaAsset::where('uuid', $uuid)
            ->where('company_id', $this->company()->id)
            ->firstOrFail();

        $asset->delete();

        return response()->noContent();
    }

    /** POST /api/media/assets/{uuid}/restore */
    public function restoreAsset(string $uuid): Response
    {
        $asset = MediaAsset::onlyTrashed()
            ->where('uuid', $uuid)
            ->where('company_id', $this->company()->id)
            ->firstOrFail();

        $asset->restore();

        return response($asset);
    }
}
