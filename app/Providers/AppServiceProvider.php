<?php

namespace App\Providers;

use App\Mixin\ResponseMixin;
use Illuminate\Pagination\Paginator;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Model;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Model::preventLazyLoading(! $this->app->isProduction());

        Paginator::useTailwind();
        Paginator::useBootstrap();
        ResponseFactory::mixin(new ResponseMixin);
        Blade::directive('selected', function ($expression) {
            return "<?php echo ($expression) ? 'selected' : ''; ?>";
        });

        Blade::directive('viteReactRefresh', function () {
            return '<?php
                $isDev = file_exists(public_path("hot"));
                if ($isDev) {
                    $url = file_get_contents(public_path("hot"));
                    echo \'<script type="module">
                        import RefreshRuntime from "\'.$url.\'/@react-refresh"
                        RefreshRuntime.injectIntoGlobalHook(window)
                        window.$RefreshReg$ = () => {}
                        window.$RefreshSig$ = () => (type) => type
                        window.__vite_plugin_react_preamble_installed__ = true
                    </script>\';
                }
            ?>';
        });

        Blade::directive('vite', function ($expression) {
            return '<?php
                $isDev = file_exists(public_path("hot"));
                if ($isDev) {
                    $url = file_get_contents(public_path("hot"));
                    $files = '.$expression.';
                    $html = \'<script type="module" src="\'.$url.\'/@vite/client"></script>\';
                    foreach((array)$files as $file) {
                        if (str_ends_with($file, ".css")) {
                            $html .= \'<link rel="stylesheet" href="\'.$url.\'/\'.$file.\'">\';
                        } else {
                            $html .= \'<script type="module" src="\'.$url.\'/\'.$file.\'"></script>\';
                        }
                    }
                    echo $html;
                } else {
                    $manifestPath = public_path("build/manifest.json");
                    if (!file_exists($manifestPath)) {
                        echo "";
                    } else {
                        $manifest = json_decode(file_get_contents($manifestPath), true);
                        $files = '.$expression.';
                        $html = "";
                        $processed = [];
                        $getLinks = function($file) use (&$getLinks, &$manifest, &$processed) {
                            $tags = "";
                            if (isset($processed[$file])) return $tags;
                            $processed[$file] = true;
                            if (!isset($manifest[$file])) return $tags;
                            
                            $chunk = $manifest[$file];
                            
                            if (isset($chunk["css"])) {
                                foreach($chunk["css"] as $css) {
                                    $tags .= \'<link rel="stylesheet" href="/build/\'.$css.\'">\';
                                }
                            }
                            if (isset($chunk["imports"])) {
                                foreach($chunk["imports"] as $import) {
                                    $tags .= $getLinks($import);
                                }
                            }
                            
                            $compiled = $chunk["file"];
                            if (str_ends_with($compiled, ".css")) {
                                $tags .= \'<link rel="stylesheet" href="/build/\'.$compiled.\'">\';
                            } else {
                                $tags .= \'<script type="module" src="/build/\'.$compiled.\'"></script>\';
                            }
                            return $tags;
                        };

                        foreach((array)$files as $file) {
                            $html .= $getLinks($file);
                        }
                        echo $html;
                    }
                }
            ?>';
        });

        // Add Model Event Observers to clear Frontend Caches
        $modelsToClearCache = [
            \App\Models\Slider::class,
            \App\Models\Subject::class,
            \App\Models\Team::class,
            \App\Models\YoutubeVideo::class,
            \App\Models\Notice::class,
            \App\Models\Center::class,
            \App\Models\Student::class,
            \App\Models\SiteConfig::class,
        ];

        $clearCache = function () {
            $keys = [
                'homepage_sliders',
                'homepage_sponsors',
                'homepage_photo_gallery',
                'homepage_courses',
                'homepage_teams',
                'homepage_youtube_videos',
                'homepage_notices',
                'homepage_centers',
                'homepage_success_students',
                'homepage_counts',
                'site_config', // For SiteConfig::firstCached()
            ];
            foreach ($keys as $key) {
                \Illuminate\Support\Facades\Cache::forget($key);
            }
        };

        foreach ($modelsToClearCache as $model) {
            $model::saved($clearCache);
            $model::deleted($clearCache);
        }
    }
}
