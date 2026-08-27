<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentPublicResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'fathers_name' => $this->fathers_name,
            'mothers_name' => $this->mothers_name,
            'roll' => $this->roll,
            'registration' => $this->registration,
            'picture' => $this->picture,
            'status' => is_object($this->status) && method_exists($this->status, 'value') ? $this->status->value : (is_string($this->status) ? $this->status : null),
            'course_duration' => $this->course_duration,
            'course_type' => is_object($this->course_type) && method_exists($this->course_type, 'value') ? $this->course_type->value : (is_string($this->course_type) ? $this->course_type : null),
            'result_grade' => $this->t_written(),
            
            // Relationships
            'center' => $this->whenLoaded('center', function () {
                return [
                    'name' => $this->center->name,
                    'code' => $this->center->code,
                ];
            }),
            'subject' => $this->whenLoaded('subject', function () {
                return [
                    'name' => $this->subject->name,
                ];
            }),
            'session' => $this->whenLoaded('session', function () {
                return [
                    'name' => $this->session->name,
                ];
            }),
            'result' => $this->whenLoaded('result', function () {
                return [
                    'written' => $this->result->written,
                    'practical' => $this->result->practical,
                    'viva' => $this->result->viva,
                    'certificate' => $this->result->certificate_serial ?? $this->result->certificate,
                    'certificate_serial' => $this->result->certificate_serial ?? $this->result->certificate,
                ];
            }),
            'semesterResults' => $this->whenLoaded('semesterResults', function () {
                return $this->semesterResults->map(function ($sem) {
                    return [
                        'semester_name' => $sem->semester_name,
                        'semester_gpa' => $sem->semester_gpa,
                        'subjects_data' => $sem->subjects_data,
                    ];
                });
            }),
        ];
    }
}
