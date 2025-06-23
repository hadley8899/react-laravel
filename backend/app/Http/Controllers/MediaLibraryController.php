<?php

namespace App\Http\Controllers;

use App\Http\Requests\Media\ListAssetsRequest;
use App\Http\Requests\Media\StoreDirectoryRequest;
use App\Http\Requests\Media\UpdateAssetRequest;
use App\Http\Requests\Media\UpdateDirectoryRequest;
use App\Http\Requests\Media\UploadAssetRequest;
use App\Http\Resources\MediaAssetResource;
use App\Http\Resources\MediaDirectoryResource;
use App\Models\MediaAsset;
use App\Models\MediaDirectory;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class MediaLibraryController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(MediaAsset::class, 'asset');
    }

    private function company()
    {
        /** @var User $user */
        $user = Auth::user();
        return $user->company;
    }

    public function listDirectories(): AnonymousResourceCollection
    {
        $dirs = MediaDirectory::query()->where('company_id', $this->company()->id)
            ->with('children')
            ->get();

        return MediaDirectoryResource::collection($dirs);
    }

    public function storeDirectory(StoreDirectoryRequest $storeDirectoryRequest): MediaDirectoryResource
    {
        $validated = $storeDirectoryRequest->validated();

        $parent = $validated['parent_uuid']
            ? MediaDirectory::query()->where('uuid', $validated['parent_uuid'])
                ->where('company_id', $this->company()->id)
                ->firstOrFail()
            : null;

        $dir = MediaDirectory::query()->create([
            'company_id' => $this->company()->id,
            'parent_id' => $parent?->id,
            'created_by' => Auth::id(),
            'name' => $validated['name'],
        ]);

        return new MediaDirectoryResource($dir);
    }

    public function updateDirectory(UpdateDirectoryRequest $req, string $uuid): Response
    {
        $dir = MediaDirectory::query()->where('uuid', $uuid)
            ->where('company_id', $this->company()->id)
            ->firstOrFail();

        $data = $req->validate([
            'name' => 'sometimes|string|max:255',
            'parent_uuid' => [
                'sometimes',
                'nullable',
                'uuid',
                Rule::notIn([$uuid]),
            ],
        ]);

        if (isset($data['name'])) {
            $dir->name = $data['name'];
        }

        if (array_key_exists('parent_uuid', $data)) {
            $newParent = $data['parent_uuid']
                ? MediaDirectory::query()
                    ->where('uuid', $data['parent_uuid'])
                    ->where('company_id', $this->company()->id)
                    ->firstOrFail()
                : null;

            $dir->parent_id = $newParent?->id;
        }

        $dir->save();

        return response($dir);
    }

    public function destroyDirectory(string $uuid): Response
    {
        $dir = MediaDirectory::query()->where('uuid', $uuid)
            ->where('company_id', $this->company()->id)
            ->firstOrFail();

        $dir->delete();
        return response()->noContent();
    }

    public function listAssets(ListAssetsRequest $req): AnonymousResourceCollection
    {
        $req->validated();

        $query = MediaAsset::query()->where('company_id', $this->company()->id)
            ->latest('created_at');

        if ($req->directory_uuid) {
            $dir = MediaDirectory::query()->where('uuid', $req->directory_uuid)
                ->where('company_id', $this->company()->id)
                ->firstOrFail();

            $query->where('directory_id', $dir->id);
        }

        if ($req->search) {
            $query->where(function ($q) use ($req) {
                $q->where('original_name', 'like', "%$req->search%")
                    ->orWhere('alt', 'like', "%$req->search%");
            });
        }

        $perPage = $req->per_page ?? 40;

        $results = $query->paginate($perPage);

        return MediaAssetResource::collection($results);
    }

    public function uploadAsset(UploadAssetRequest $req): MediaAssetResource
    {
        $data = $req->validated();

        $dir = $data['directory_uuid']
            ? MediaDirectory::query()->where('uuid', $data['directory_uuid'])
                ->where('company_id', $this->company()->id)
                ->firstOrFail()
            : null;

        $file = $data['file'];

        $uuid = (string)Str::uuid();
        $ext = $file->getClientOriginalExtension();
        $path = "company-{$this->company()->uuid}/$uuid.$ext";

        [$width, $height] = [null, null];
        if (str_starts_with($file->getMimeType(), 'image/')) {
            $manager = new ImageManager(new Driver());
            $img = $manager->read($file->getPathname());
            $width = $img->width();
            $height = $img->height();
        }

        // Store original file
        $file->storeAs($path, '', ['disk' => 'media']);

        $asset = MediaAsset::query()->create([
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

        return new MediaAssetResource($asset);
    }

    public function updateAsset(UpdateAssetRequest $req, string $uuid): MediaAssetResource
    {
        $asset = MediaAsset::query()->where('uuid', $uuid)
            ->where('company_id', $this->company()->id)
            ->firstOrFail();

        $data = $req->validated();

        if (array_key_exists('alt', $data)) {
            $asset->alt = $data['alt'];
        }

        if (array_key_exists('directory_uuid', $data)) {
            $newDir = $data['directory_uuid']
                ? MediaDirectory::query()
                    ->where('uuid', $data['directory_uuid'])
                    ->where('company_id', $this->company()->id)
                    ->firstOrFail()
                : null;
            $asset->directory_id = $newDir?->id;
        }

        $asset->save();

        return new MediaAssetResource($asset);
    }

    public function destroyAsset(string $uuid): Response
    {
        $asset = MediaAsset::query()
            ->where('uuid', $uuid)
            ->where('company_id', $this->company()->id)
            ->firstOrFail();

        $asset->delete();

        return response()->noContent();
    }

    public function restoreAsset(string $uuid): MediaAssetResource
    {
        $asset = MediaAsset::onlyTrashed()
            ->where('uuid', $uuid)
            ->where('company_id', $this->company()->id)
            ->firstOrFail();

        $asset->restore();

        return new MediaAssetResource($asset);
    }
}
