<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')->hourly();
        $schedule->command('center:check-financial-restrictions')->dailyAt('01:00')->withoutOverlapping();
        $schedule->job(new \App\Jobs\SendPaymentReminders)->dailyAt('08:00')->withoutOverlapping();
        $schedule->command('app:backup')->hourly()->withoutOverlapping();
        $schedule->command('student:delete-unpublished')->daily()->withoutOverlapping();
        $schedule->command('telescope:prune --hours=48')->daily()->withoutOverlapping();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
