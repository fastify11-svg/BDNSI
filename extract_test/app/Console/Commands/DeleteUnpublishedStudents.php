<?php

namespace App\Console\Commands;

use App\Models\Student;
use Illuminate\Console\Command;

class DeleteUnpublishedStudents extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'student:delete-unpublished';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete students whose results are not published within 45 days of registration';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $dateThreshold = now()->subDays(45);

        $deletedCount = Student::where('created_at', '<=', $dateThreshold)
            ->whereNull('result_publised')
            ->delete();

        $this->info("Deleted {$deletedCount} students without published results older than 45 days.");

        return 0;
    }
}
