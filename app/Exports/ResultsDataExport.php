<?php

namespace App\Exports;

use App\Exports\Sheets\AnswersSheet;
use App\Exports\Sheets\ProjectSheet;
use App\Exports\Sheets\SessionsSheet;
use App\Models\Project;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use App\Exports\Sheets\UsersSheet;
use Session;

class ResultsDataExport implements WithMultipleSheets
{
    use Exportable;

    protected $project;

    public function __construct(Project $project) {
        $this->project = $project;
    }

    public function sheets(): array
    {

        return [
            new ProjectSheet($this->project),
            new AnswersSheet($this->project),
            new UsersSheet($this->project),
            new SessionsSheet($this->project),
        ];
    }
    
    
}
