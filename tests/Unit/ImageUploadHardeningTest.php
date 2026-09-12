<?php

namespace Tests\Unit;

use App\Lib\Image;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;
use Tests\TestCase;

class ImageUploadHardeningTest extends TestCase
{
    public function test_store_file_uses_mime_extension_not_client_extension(): void
    {
        Storage::fake('local');

        $tmp = tempnam(sys_get_temp_dir(), 'img');
        // Minimal valid JPEG bytes so finfo/MIME detection stays image/jpeg.
        file_put_contents($tmp, base64_decode('/9j/4AAQSkZJRgABAQAAAQABAAD/2wAAAAD/9k='));
        $file = new UploadedFile($tmp, 'photo.php', 'image/jpeg', null, true);

        $path = Image::storeFile($file, 'students', 'photo.php');

        $this->assertStringEndsWith('.jpg', $path);
        $this->assertStringNotContainsString('.php', $path);
        Storage::disk('local')->assertExists($path);
    }

    public function test_store_file_rejects_unsupported_mime_types(): void
    {
        Storage::fake('local');

        $file = UploadedFile::fake()->create('payload.txt', 10, 'text/plain');

        $this->expectException(InvalidArgumentException::class);
        Image::storeFile($file, 'students');
    }
}
