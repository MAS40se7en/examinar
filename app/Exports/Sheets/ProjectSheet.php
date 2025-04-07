<?php

namespace App\Exports\Sheets;

use App\Models\Project;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\BeforeSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProjectSheet implements FromArray, WithHeadings, WithStyles, WithEvents, WithTitle
{
    protected $project;

    public function __construct($project) {
        $this->project = $project;
    }

    public function array(): array
    {
        $userGroup = $this->project->userGroup; // Assuming the relation is named `userGroup`
        $userIds = $userGroup->users; // Array of user IDs in the user group
        $numberOfUsers = count($userIds); // Number of users in the user group

        return [
            [
                $this->project->id,
                $this->project->name,
                $this->project->description,
                $this->project->questions()->count(), // Number of questions
                $userGroup->name, // User group name
                $numberOfUsers, // Number of users
                $this->project->start_date,
                $this->project->deadline,
            ]
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Description',
            'Number of Questions',
            'User Group Name',
            'Number of Users',
            'Start Date',
            'Deadline',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A4:H4')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 12,
                'color' => ['argb' => 'FFFFFFFF'], // White color for font
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FF000000'], // Black background for headers
            ],
        ]);

        $sheet->getStyle('A5:H5')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 16
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
            ],
        ]);

        // Apply border to the entire table
        $sheet->getStyle('A4:H' . $sheet->getHighestRow())->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'],
                ],
            ],
        ]);

        // Auto-size columns based on content length
        $this->autoSizeColumns($sheet);
    }

    private function autoSizeColumns(Worksheet $sheet)
    {
        foreach (range('A', $sheet->getHighestColumn()) as $columnID) {
            $sheet->getColumnDimension($columnID)->setAutoSize(true);
        }
    }

    public function registerEvents(): array
    {
        return [
            BeforeSheet::class => function (BeforeSheet $event) {
                $currentUser = auth()->user();
                $sheet = $event->sheet->getDelegate();
                $sheet->setCellValue('D1', 'Exported By:');
                $sheet->setCellValue('E1', $currentUser->name);
                $sheet->setCellValue('A3', ' ');
                $sheet->setCellValue('B3', ' ');
                
                // Center align project information
                $sheet->getStyle('A1:B2')->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                    'font' => [
                        'bold' => true,
                        'size' => 14,
                    ],
                    'borders' => [
                        'allborders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['argb' => 'FF000000'],
                        ]
                    ]
                ]);

                $sheet->getStyle('D1:E1')->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                ]);
            },
        ];
    }

    /**
     * Return the title of the sheet
     * 
     * @return string
     */
    public function title(): string {
        return 'Project Details';
    }
    
    
}
