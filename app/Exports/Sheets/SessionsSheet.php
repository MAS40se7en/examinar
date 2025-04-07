<?php

namespace App\Exports\Sheets;

use App\Models\User;
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

class SessionsSheet implements FromArray, WithHeadings, WithStyles, withEvents, WithTitle
{
    protected $project;

    public function __construct($project) {
        $this->project = $project;
    }

    public function array(): array
    {
        $list = [];


        $sessions = $this->project->sessions()->get();

        foreach ($sessions as $session) {
            $list[] = [
                $session->id,
                $session->project_id,
                $session->start_date,
                $session->end_date,
            ];
        }

        return $list;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Project ID',
            'Start Date',
            'End Date',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Apply styles to the header row
        $sheet->getStyle('A4:D4')->applyFromArray([
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

        // Apply border to the entire table
        $sheet->getStyle('A4:D' . $sheet->getHighestRow())->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'],
                ],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
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
                $sheet->setCellValue('A1', 'Project ID: ');
                $sheet->setCellValue('A2', 'Project Name: ');
                $sheet->setCellValue('B1', $this->project->id);
                $sheet->setCellValue('B2', $this->project->name);
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
        return 'Sessions';
    }
}
